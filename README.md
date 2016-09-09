# Text Marker

## Features

Select text in your code and mark all matches. The marking colour is configurable

![Highlight and unhighlight text](https://raw.githubusercontent.com/ryu1kn/vscode-text-marker/master/images/animations/highlight-unhighlight-texts.gif)

## Commands

* `TextMarker: Mark Text to Highlight/Unhighlight`

    Mark the selected text for highlighting. Marking the already selected text will unhighlight the text.

## Extension Settings

* `textmarker.highlightColors`

    List of colours to be used to highlight the selected text. The colours are used with respect to the order in the list.

* `textmarker.delayForRefreshingHighlight`

    Number of milliseconds to wait before refreshing the highlights on editor contents change. `null` for no refresh.

## Keyboard Shortcuts

You can quickly toggle highlight of a selected text by registering the TextMarker command to your keyboard shortcut settings. For example:

```json
  { "key": "ctrl+h", "command": "textmarker.markText",
                        "when": "editorTextFocus" }
```

## Request Features or Report Bugs

https://github.com/ryu1kn/vscode-text-marker/issues

## Release Notes

### 0.0.1

Initial release of Text Marker
