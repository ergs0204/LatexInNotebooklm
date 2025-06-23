// ==UserScript==
// @name         NotebookLM LaTeX Renderer 3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  The definitive stable version. Detaches all citations from a paragraph, renders the math, then re-appends citations at the end to ensure perfect rendering and preservation.
// @author       ergs0204, Zolangui
// @match        https://notebooklm.google.com/*
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js
// @require      https://github.com/sizzlemctwizzle/GM_config/raw/master/gm_config.js
// @resource     KATEX_CSS https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const PROCESSED_CLASS = 'latex-processed-by-userscript';

    GM_config.init({
        id: 'NotebookLM_LaTeX_Config',
        title: 'LaTeX Renderer Settings',
        fields: {
            'contentSelector': { 'label': 'Content Paragraph Selector', 'type': 'text', 'default': 'div.paragraph' },
            'chipSelector': { 'label': 'Citation Chip Selector', 'type': 'text', 'default': 'button.citation-marker' },
            'debounceTime': { 'label': 'Render Debounce Time (ms)', 'type': 'int', 'default': 300, 'min': 50 }
        },
        events: {
            'save': () => { GM_config.close(); location.reload(); },
            'init': main
        }
    });

    function main() {
        const CONFIG = {
            CONTENT_SELECTOR: GM_config.get('contentSelector'),
            CHIP_SELECTOR: GM_config.get('chipSelector'),
            DEBOUNCE_TIME: GM_config.get('debounceTime')
        };

        try {
            let katexCSS = GM_getResourceText("KATEX_CSS");
            const fontURLPrefix = `https://cdn.jsdelivr.net/npm/katex@${katex.version}/dist/`;
            katexCSS = katexCSS.replace(/url\(fonts\//g, `url(${fontURLPrefix}fonts/`);
            GM_addStyle(katexCSS);
            GM_addStyle('.katex { font-size: 1.3em; vertical-align: -0.1em; }');
        } catch (e) {
            console.error("[NLM-LaTeX|ERROR]", "Failed to inject KaTeX CSS.", e);
        }

        const katexOptions = {
            delimiters: [
                { left: "$$", right: "$$", display: true }, { left: "\\[", right: "\\]", display: true },
                { left: "$", right: "$", display: false }, { left: "\\(", right: "\\)", display: false }
            ],
            throwOnError: false,
        };

        const processParagraph = (p) => {
            if (p.classList.contains(PROCESSED_CLASS) || !p.textContent.includes('$')) {
                return;
            }

            const detachedMarkers = Array.from(p.querySelectorAll(CONFIG.CHIP_SELECTOR));
            detachedMarkers.forEach(chip => chip.remove());

            let child = p.firstChild;
            while (child) {
                if (child.nodeName === 'SPAN') {
                    let nextRelevantSibling = child.nextSibling;
                    while (nextRelevantSibling && (nextRelevantSibling.nodeType !== Node.ELEMENT_NODE || nextRelevantSibling.nodeName !== 'SPAN')) {
                        nextRelevantSibling = nextRelevantSibling.nextSibling;
                    }
                    if (nextRelevantSibling) {
                        child.textContent += nextRelevantSibling.textContent;
                        let nodeToRemove = child.nextSibling;
                        while (nodeToRemove !== nextRelevantSibling) {
                            let temp = nodeToRemove.nextSibling;
                            p.removeChild(nodeToRemove);
                            nodeToRemove = temp;
                        }
                        if (nextRelevantSibling) p.removeChild(nextRelevantSibling);
                        continue;
                    }
                }
                child = child.nextSibling;
            }
            p.normalize();

            renderMathInElement(p, katexOptions);

            if (detachedMarkers.length > 0) {
                detachedMarkers.forEach(marker => {
                    p.appendChild(marker);
                    p.insertBefore(document.createTextNode(' '), marker);
                });
            }

            p.classList.add(PROCESSED_CLASS);
        };

        let renderTimeout;
        const observer = new MutationObserver((mutations) => {
            clearTimeout(renderTimeout);

            renderTimeout = setTimeout(() => {
                document.querySelectorAll(`.${PROCESSED_CLASS}`).forEach(p => {
                    if (!p.querySelector('.katex')) {
                        p.classList.remove(PROCESSED_CLASS);
                    }
                });

                document.querySelectorAll(CONFIG.CONTENT_SELECTOR).forEach(processParagraph);

            }, CONFIG.DEBOUNCE_TIME);
        });

        const initialize = () => {
            document.querySelectorAll(CONFIG.CONTENT_SELECTOR).forEach(processParagraph);
            observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        };

        GM_registerMenuCommand('Configure LaTeX Renderer', () => GM_config.open());
        initialize();
    }
})();
