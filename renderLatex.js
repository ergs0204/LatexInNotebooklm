// ==UserScript==
// @name         Render LaTeX with KaTeX ($...$)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Renders inline LaTeX formulas written as $formula$ using KaTeX
// @author       ergs0204
// @match        https://notebooklm.google.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js
// @resource     katexCSS https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css
// ==/UserScript==

(function () {
  'use strict';

  // Inject KaTeX CSS into the page
  const addKaTeXStyles = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);
  };

  // Render LaTeX using KaTeX auto-render
  const renderLaTeX = () => {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$", right: "$", display: false }
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    });
  };

  // Observe changes and re-render math (for dynamic pages)
  const observeMutations = () => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            try {
              renderMathInElement(node, {
                delimiters: [{ left: "$", right: "$", display: false }],
                ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
              });
            } catch (e) {
              console.error("KaTeX render error:", e);
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  // Run the script
  window.addEventListener('load', () => {
    addKaTeXStyles();
    renderLaTeX();
    observeMutations();
  });
})();
