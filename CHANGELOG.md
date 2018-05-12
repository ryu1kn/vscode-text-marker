
### Unreleased

* Introduced a configuration to use the highlight color on the ruler. ([Issue #12](https://github.com/ryu1kn/vscode-text-marker/issues/12))
* Removed deprecated commands: **Highlight Selected Text** and **Mark Text to Highlight/Unhighlight**

### 0.11.0: 17 February 2018

* Introduced **Save All Highlights** command. Saved highlights are restored next time you open the editor. ([Issue #5](https://github.com/ryu1kn/vscode-text-marker/issues/5))

### 0.10.1: 14 September 2017

* Fixed the link to the gif animation

### 0.10.0: 11 June 2017

* Introduced **Update Highlight** command. You can change the pattern, case sensitivity or whole/partial match of an existing highlight, available as a right-click menu.
* Deprecated **Highlight Selected Text** command in favour of **Toggle Highlight** commands.

### 0.9.0: 6 June 2017

* Introduced **Toggle Highlight** command. When you remove highlight with this command, it works not only string type highlight but also regex type highlight. ([Issue #6](https://github.com/ryu1kn/vscode-text-marker/issues/6))
* Right click menu **Highlight Selected Text** has been replaced with **Toggle Highlight** command.

### 0.8.0: 4 June 2017

* Introduced the mode for whole match. Whether text matching is done with whole match is decided by the current mode.
  The mode can be flipped with **Toggle Mode for Whole/Partial Match** command accessible from the status bar.

### 0.7.0: 3 June 2017

* Support "whole match" text matching ([Issue #7](https://github.com/ryu1kn/vscode-text-marker/issues/7))

### 0.6.1: 2 June 2017

* Fixed the problem that the symbols for representing the current mode for case sensitivity were used in reverse

### 0.6.0: 2 June 2017

* Introduced the mode for case sensitivity. Whether text matching should be done by ignoring case is decided by the current mode.
  The mode can be flipped with **Toggle Mode for Case Sensitivity** command accessible from the status bar.

### 0.5.0: 28 May 2017

* Support case insensitive text matching

### 0.4.0: 24 May 2017

* Support regex to highlight text ([Issue #8](https://github.com/ryu1kn/vscode-text-marker/issues/8))
* Put **Highlight Selected Text** command in the right click menu
* Deprecated **Mark Text to Highlight/Unhighlight** command in favour of **Highlight Selected Text** and **Unhighlight Text** commands (See [Issue #8](https://github.com/ryu1kn/vscode-text-marker/issues/8))

### 0.3.0: 7 November 2016

* Select the word under the cursor if no text is selected when triggering mark text command ([Issue #3](https://github.com/ryu1kn/vscode-text-marker/issues/3))

### 0.2.0: 4 November 2016

* Utilised `OverviewRuler` to help users easily find where in the file highlighted texts can be found ([Issue #4](https://github.com/ryu1kn/vscode-text-marker/issues/4))

### 0.1.0: 13 September 2016

* Added **Clear All Highlights** command to remove all highlights at once

### 0.0.1: 5 July 2016

* Initial release of Text Marker
