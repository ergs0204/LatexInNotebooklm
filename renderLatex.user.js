// ==UserScript==
// @name         Render LaTeX in NotebookLM
// @namespace    http://tampermonkey.net/
// @version      5.6
// @description  A minimal, stable, and robust renderer focusing solely on perfect LaTeX display without extra features.
// @author       ergs0204 (with Zolangui modifications)
// @match        https://notebooklm.google.com/*
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js
// @resource     katexCSS https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    const addKaTeXStyles = () => {
        const katexLink = document.createElement('link');
        katexLink.rel = 'stylesheet';
        katexLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css';
        document.head.appendChild(katexLink);
    };

    const addCustomStyles = () => {
        const css = `.katex { vertical-align: -0.1em; }`;
        GM_addStyle(css);
    };

    const preprocessAndSanitize = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            let originalText = node.nodeValue;
            let newText = originalText;

            const displayMathRegex = /\$\$(.*?)\$\$/gs;
            let tempTextForDisplay = newText;
            let match_display;
            while ((match_display = displayMathRegex.exec(tempTextForDisplay)) !== null) {
                const content = match_display[1].trim();
                const isComplex = content.length > 25 || content.includes('\\begin') || content.includes('\\frac') || content.includes('\\sum') || content.includes('\\int') || content.includes('\\lim') || content.includes('\\\\') || content.split(' ').length > 4;
                if (!isComplex) {
                    newText = newText.replace(`$$${match_display[1]}$$`, `$${content}$`);
                }
            }

            if (newText !== originalText) {
                node.nodeValue = newText;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'PRE', 'CODE'].includes(node.tagName)) {
                return;
            }
            for (const child of Array.from(node.childNodes)) {
                preprocessAndSanitize(child);
            }
        }
    };

    const ignoreClass = 'katex-ignore-active-render';
    const katexOptions = {
        delimiters: [
            { left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false }, { left: "\\[", right: "\\]", display: true }
        ],
        ignoredClasses: [ignoreClass],
        throwOnError: false
    };

    let renderTimeout;
    const renderPageWithIgnore = () => {
        const activeEl = document.activeElement;
        let hasIgnoreClass = false;
        try {
            if (activeEl && (activeEl.isContentEditable || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT')) {
                activeEl.classList.add(ignoreClass);
                hasIgnoreClass = true;
            }
            preprocessAndSanitize(document.body);
            renderMathInElement(document.body, katexOptions);
        } catch (e) {
            console.error("KaTeX render error:", e);
        } finally {
            if (hasIgnoreClass && activeEl) {
                activeEl.classList.remove(ignoreClass);
            }
        }
    };

    const observer = new MutationObserver(() => {
        clearTimeout(renderTimeout);
        renderTimeout = setTimeout(renderPageWithIgnore, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        addKaTeXStyles();
        addCustomStyles();
        renderPageWithIgnore();
    });

})();
