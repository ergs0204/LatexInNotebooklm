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

2.  Install the script:
   - Open Tampermonkey dashboard
   - Create a new script
   - Copy and paste the entire content of `renderLatex.js`
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