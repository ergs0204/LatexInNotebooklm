# Contributing

Thanks for helping improve LaTeX in NotebookLM. Bug reports, compatibility fixes, documentation improvements, and focused feature proposals are welcome.

## Report A Bug

Before opening an issue, check whether the problem has already been reported. Include:

- Browser and version
- Userscript manager and version
- A minimal LaTeX expression that reproduces the problem
- Expected and actual behavior
- Console errors, if any

Do not include private NotebookLM content in screenshots or logs.

## Submit A Change

1. Fork the repository and create a branch from `main`.
2. Make a focused change in `renderLatex.user.js` or the documentation.
3. Test inline and display math in NotebookLM on at least one supported browser.
4. Confirm that editing a prompt still works and already-rendered content is not rendered twice.
5. Open a pull request describing the problem, solution, and manual test results.

Keep pull requests small when possible. If a change alters delimiter handling or DOM traversal, include examples that cover the new behavior and likely edge cases.

## Development Notes

This project is a standalone userscript without a build step. Install your branch directly in a userscript manager, reload NotebookLM, and test against dynamically added chat content.

By contributing, you agree that your contribution may be distributed under the repository's MIT License.
