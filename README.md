# LaTeX in Notebooklm

A Tampermonkey userscript that adds LaTeX rendering capability to Google's Notebooklm using KaTeX. This allows you to write mathematical formulas with standard LaTeX syntax using `$formula$` delimiters.

## Features

- Renders inline LaTeX formulas using `$formula$` syntax
- Automatically processes new content as it's added to the page
- Uses KaTeX for fast, beautiful math rendering

## Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension:
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
   - [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)

2. Install the script:
   - **Recommended**: Click [here](https://raw.githubusercontent.com/ergs0204/LatexInNotebooklm/refs/heads/main/renderLatex.user.js) to install via `.user.js` file
     - This will open the script in Tampermonkey for one-click installation.
   - **Manual method**:
     - Open the Tampermonkey dashboard
     - Create a new script
     - Copy and paste the entire content of `renderLatex.user.js`
     - Save the script

## Usage

1. Navigate to https://notebooklm.google.com/
2. Output with mathematical formulas using LaTeX syntax surrounded by dollar signs
   - Example: `$E = mc^2$` will render as a properly formatted equation.

## Examples

- `$E = mc^2$` - Einstein's mass-energy equivalence
- `$F = G \frac{m_1 m_2}{r^2}$` - Newton's law of universal gravitation
- `$\int_{a}^{b} f(x) \, dx$` - Definite integral

## Dependencies

- [KaTeX](https://katex.org/) - The fastest math typesetting library for the web

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 

## Third-Party Licenses

This project uses the following third-party libraries:

- **KaTeX** - [MIT License](https://github.com/KaTeX/KaTeX/blob/main/LICENSE)
  - Copyright (c) 2013-2020 Khan Academy and other contributors
  - Used for rendering LaTeX equations 

## Known Issues

- **Underscore `_` breaks rendering**: NotebookLM treats underscores as markdown for _italic_ text, which splits LaTeX expressions across different DOM nodes. As a result, formulas like `$F = G \frac{m_1 m_2}{r^2}$` may not render correctly if `_` triggers a markdown split.
- This is the limitation of NotebookLM's current markdown handling. Unfortunately, there's no reliable workaround—LaTeX rendering may improve once NotebookLM offers better support natively.
