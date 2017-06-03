
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
* Put "Highlight Selected Text" command in the right click menu
* Deprecated "Mark Text to Highlight/Unhighlight" command in favour of "Highlight Selected Text" and "Unhighlight Text" commands (See [Issue #8](https://github.com/ryu1kn/vscode-text-marker/issues/8))

### 0.3.0: 7 November 2016

* Select the word under the cursor if no text is selected when triggering mark text command ([Issue #3](https://github.com/ryu1kn/vscode-text-marker/issues/3))

### 0.2.0: 4 November 2016

* Utilised `OverviewRuler` to help users easily find where in the file highlighted texts can be found ([Issue #4](https://github.com/ryu1kn/vscode-text-marker/issues/4))

### 0.1.0: 13 September 2016

* Added **Clear All Highlights** command to remove all highlights at once

### 0.0.1: 5 July 2016

* Initial release of Text Marker
