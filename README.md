[![Build Status](https://travis-ci.org/ryu1kn/vscode-text-marker.svg?branch=master)](https://travis-ci.org/ryu1kn/vscode-text-marker) [![Code Climate](https://codeclimate.com/github/ryu1kn/vscode-text-marker/badges/gpa.svg)](https://codeclimate.com/github/ryu1kn/vscode-text-marker)

# Text Marker (Highlighter)

## Features

* Highlight/Unhighlight text from both command palette or right-click menu
* Update existing highlight rules from the right-click menu
* Highlight text using a regular expression
* Case sensitive/insensitive text matching
  * Matching is done depending on the current mode for case sensitivity. You can toggle the mode from the status bar.
* Whole/Partial text matching
  * Matching is done depending on the current mode for whole match. You can toggle the mode from the status bar.
* Highlighting colour is configurable

Highlight/Unhighlight text. Regular expression can also be used. It highlights your text as you type.

![Highlight and unhighlight text](https://raw.githubusercontent.com/ryu1kn/vscode-text-marker/master/images/animations/highlight-unhighlight-texts.gif)

Switch matching mode. Case sensitive match, Whole match are available. From command palette, you can even change the matching mode after you specified a highlight.

![Ignore Case and Whole Match](https://raw.githubusercontent.com/ryu1kn/vscode-text-marker/master/images/animations/ignore-case-and-whole-match.gif)

You can update a highlight rule after you set it.

![Update Existing Highlight](https://raw.githubusercontent.com/ryu1kn/vscode-text-marker/master/images/animations/update-highlight.gif)


## Commands

* `Toggle Highlight` (**Command ID**: `textmarker.toggleHighlight`)

    Highlight selected text, if no text is selected, the word under cursor will be highlighted.
    Issueing this command on a highlight without selecting any text will remove the highlight.
    Available on right-click menu.

* `Update Highlight` (**Command ID**: `textmarker.updateHighlight`)

    Update the existing highlight (Toggle case sensitivity, whole/partial match, pattern text).
    Available on right-click menu.

* `Highlight Text Using Regex` (**Command ID**: `textmarker.highlightUsingRegex`)

    Highlight text that matches a given regular expression.

* `Unhighlight Text` (**Command ID**: `textmarker.unhighlight`)

    Remove a highlight from the list of highlights.

* `Clear All Highlights` (**Command ID**: `textmarker.clearAllHighlight`)

    Clear all highlights with one shot.

* `Toggle Case Sensitivity` (**Command ID**: `textmarker.toggleCaseSensitivity`)

    Toggle the case sensitivity of a highlight.

* `Toggle Mode for Case Sensitivity` (**Command ID**: `textmarker.toggleModeForCaseSensitivity`)

    Toggle mode for case sensitivity.
    Available on Status bar.

* `Toggle Whole/Partial Match` (**Command ID**: `textmarker.toggleWholeMatch`)

    Toggle whole match and partial match.

* `Toggle Mode for Whole/Partial Match` (**Command ID**: `textmarker.toggleModeForWholeMatch`)

    Toggle mode for whole match and partial match.
    Available on Status bar.

* `(DEPRECATED) Highlight Selected Text` (**Command ID**: `textmarker.highlight`)

    Mark the selected text for highlighting. If no text is selected, the word under cursor will be marked.
    Marking the already selected text will unhighlight the text.

    DEPRECATED. Please use Toggle Highlight (`textmarker.toggleHighlight`) command instead.

* `(DEPRECATED) Mark Text to Highlight/Unhighlight` (**Command ID**: `textmarker.markText`)

    Mark the selected text for highlighting. If no text is selected, the word under cursor will be marked.
    Marking the already selected text will unhighlight the text.

    DEPRECATED. Please use Toggle Highlight (`textmarker.toggleHighlight`) command instead.

## Extension Settings

* `textmarker.highlightColors`

    List of colours to be used to highlight the selected text. The colours are used with respect to the order in the list.

* `textmarker.delayForRefreshingHighlight`

    Number of milliseconds to wait before refreshing the highlights on editor contents change. `null` for no refresh.

## Keyboard Shortcuts

You can quickly invoke the above TextMarker commands by registering them to your keyboard shortcut settings. For example:

```json
  { "key": "ctrl+h", "command": "textmarker.toggleHighlight", "when": "editorTextFocus" }
```

## Request Features or Report Bugs

* https://github.com/ryu1kn/vscode-text-marker/issues

## Changelog

* https://github.com/ryu1kn/vscode-text-marker/blob/master/CHANGELOG.md
