// ==UserScript==
// @name         Render LaTeX in NotebookLM (Conflict Evasion)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Robustly renders LaTeX by ignoring the active element to prevent conflicts with NotebookLM's native Markdown parser.
// @author       ergs0204 (with Zolangui mod)
// @match        https://notebooklm.google.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js
// @resource     katexCSS https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    const addKaTeXStyles = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
        document.head.appendChild(link);
    };

    const ignoreClass = 'katex-ignore-active-render';
    const katexOptions = {
        delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
        ],
        ignoredClasses: [ignoreClass], // The key to avoiding conflicts!
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
        renderTimeout = setTimeout(renderPageWithIgnore, 300); // 300ms delay
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', () => {
        addKaTeXStyles();
        renderPageWithIgnore();
    });

})();
