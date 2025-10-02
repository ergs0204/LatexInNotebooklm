[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ergs0204/LatexInNotebooklm)
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
   
> [!IMPORTANT]  
> On some Chromium-based browsers (Chrome, Brave, Vivaldi, Edge, Opera, etc.),  
> Tampermonkey will not run user scripts unless you explicitly enable:  
> `Manage Extensions > Tampermonkey > Details > Allow User Scripts`  
> Make sure this toggle is **ON**, otherwise the script will never execute.  

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


**Without LaTeX rendering:**
![Without LaTeX rendering](res/without_render.png)

**With LaTeX rendering enabled:**
![With LaTeX rendering](res/with_render.png)

## Dependencies

- [KaTeX](https://katex.org/) - The fastest math typesetting library for the web

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Third-Party Licenses

This project uses the following third-party libraries:

- **KaTeX** - [MIT License](https://github.com/KaTeX/KaTeX/blob/main/LICENSE)
  - Copyright (c) 2013-2020 Khan Academy and other contributors
  - Used for rendering LaTeX equations