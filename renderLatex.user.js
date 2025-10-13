// ==UserScript==
// @name         Render LaTeX in NotebookLM
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Robust KaTeX rendering for NotebookLM
// @author       ergs0204 (with Zolangui + adamnelsonarcher)
// @match        https://notebooklm.google.com/*
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js
// @resource     katexCSS https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css
// @license      MIT
// ==/UserScript==

// Improvements by adamnelsonarcher (2025)
// - Coalesces multi-node $$ and $ spans
// - Escapes unescaped %
// - Adds table-cell and <br> normalization
// - Fixes inline math and nested quantifiers rendering

(function () {
	'use strict';

	const addKaTeXStyles = () => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css';
		document.head.appendChild(link);
	};

	const addCustomStyles = () => {
		const css = `.katex { vertical-align: -0.1em; }`;
		if (typeof GM_addStyle === 'function') {
			GM_addStyle(css);
		} else {
			const style = document.createElement('style');
			style.textContent = css;
			document.head.appendChild(style);
		}
	};

	const candidateSelector = 'p, div, li, section, article, span, td, th';

	const convertBRsInsideMathyBlocks = (root) => {
		const candidates = root.querySelectorAll(candidateSelector);
		candidates.forEach(el => {
			const tc = el.textContent || '';
			// If the text looks like it contains math delimiters, normalize <br> → '\n'
			if ((tc.match(/[\$]{2}/g) || []).length >= 2 || (tc.match(/\$/g) || []).length >= 2 || (tc.match(/\\\[/g) || []).length >= 1) {
				el.querySelectorAll('br').forEach(br => br.replaceWith(document.createTextNode('\n')));
				el.normalize();
			}
		});
	};

	// Map a textContent offset to (node,offset) in DOM
	const pointAtOffset = (el, target) => {
		const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
		let node, seen = 0, last = null;
		while ((node = walker.nextNode())) {
			last = node;
			const len = node.nodeValue.length;
			if (seen + len >= target) {
				return { node, offset: target - seen };
			}
			seen += len;
		}
		return last ? { node: last, offset: last.nodeValue.length } : null;
	};

	// Escape stray % in LaTeX math content
	const sanitizeMathContent = (s) => {
		// Replace unescaped % with \%
		return s.replace(/(?<!\\)%/g, '\\%');
	};

	const coalesceForDelims = (root, leftDelim, rightDelim, sanitizeFn) => {
		const containers = root.querySelectorAll(candidateSelector);
		containers.forEach(el => {
			el.normalize();
			let tc = el.textContent || '';
			const L = leftDelim.length, R = rightDelim.length;

			if (tc.indexOf(leftDelim) === -1 || tc.indexOf(rightDelim) === -1) return;

			let startFrom = 0;
			while (true) {
				tc = el.textContent || '';
				let open = tc.indexOf(leftDelim, startFrom);
				if (open === -1) break;
                
				if (leftDelim === '$' && tc.slice(open, open + 2) === '$$') {
					startFrom = open + 2;
					continue;
				}

				let close = tc.indexOf(rightDelim, open + L);
				if (close === -1) break;

				if (leftDelim === '$') {
					const before = tc[open - 1];
					if (before === '\\') { startFrom = open + 1; continue; }
					while (close !== -1) {
						const prev = tc[close - 1];
						const isDouble = tc.slice(close, close + 2) === '$$';
						if (prev !== '\\' && !isDouble) break;
						close = tc.indexOf('$', close + 1);
					}
					if (close === -1) break;
				}

				const p1 = pointAtOffset(el, open);
				const p2 = pointAtOffset(el, close + R);
				if (!p1 || !p2) break;

				const range = document.createRange();
				range.setStart(p1.node, p1.offset);
				range.setEnd(p2.node, p2.offset);

				const exact = tc.slice(open, close + R);
				const inner = exact.slice(L, exact.length - R);
				const innerSan = sanitizeFn ? sanitizeFn(inner) : inner;
				const rebuilt = leftDelim + innerSan + rightDelim;

				range.deleteContents();
				const tn = document.createTextNode(rebuilt);

				const anchor = pointAtOffset(el, open);
				if (anchor) {
					if (anchor.offset > 0) {
						anchor.node.splitText(anchor.offset);
						anchor.node.parentNode.insertBefore(tn, anchor.node.nextSibling);
					} else {
						anchor.node.parentNode.insertBefore(tn, anchor.node);
					}
				} else {
					el.appendChild(tn);
				}

				el.normalize();
				startFrom = open + rebuilt.length;
			}
		});
	};

	const ignoreClass = 'katex-ignore-active-render';
	const katexOptions = {
		delimiters: [
			{ left: "$$", right: "$$", display: true },
			{ left: "$", right: "$", display: false },
			{ left: "\\(", right: "\\)", display: false },
			{ left: "\\[", right: "\\]", display: true }
		],
		ignoredClasses: [ignoreClass],
		ignoredTags: ["script","noscript","style","textarea","pre","code"],
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

			convertBRsInsideMathyBlocks(document.body);

			// Coalesce and sanitize in safe order: $$ first, then $; also support \[ \] / \( \)
			coalesceForDelims(document.body, '$$', '$$', sanitizeMathContent);
			coalesceForDelims(document.body, '$', '$', sanitizeMathContent);
			coalesceForDelims(document.body, '\\[', '\\]', sanitizeMathContent);
			coalesceForDelims(document.body, '\\(', '\\)', sanitizeMathContent);

			renderMathInElement(document.body, katexOptions);
		} catch (e) {
			console.error('KaTeX render error:', e);
		} finally {
			if (hasIgnoreClass && activeEl) {
				activeEl.classList.remove(ignoreClass);
			}
		}
	};

	const observer = new MutationObserver(() => {
		clearTimeout(renderTimeout);
		renderTimeout = setTimeout(renderPageWithIgnore, 250);
	});

	window.addEventListener('load', () => {
		addKaTeXStyles();
		addCustomStyles();
		renderPageWithIgnore();
		observer.observe(document.body, { childList: true, subtree: true });
	});
})();
