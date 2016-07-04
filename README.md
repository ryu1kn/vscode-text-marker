# Text Marker

## Features

Select text in your code and mark all matches. The marking colour is configurable

![Highlight and unhighlight text](https://raw.githubusercontent.com/ryu1kn/vscode-text-marker/master/images/animations/highlight-unhighlight-texts.gif)

## Commands

* `TextMarker: Mark text`

    Mark the selected text for highlighting. Marking the already selected text will unhighlight the text.

## Extension Settings

You can specify a template for a print statement per language.

* `textmarker.highlightColors`

    List of colors to be used to highlight the selected text. The colors are used with respect to the order in the list.

* `textmarker.delayForRefreshingHighlight`

    Number of milliseconds to wait before refreshing the highlights on editor contents change. `null` for no refresh.

## Release Notes

### 0.0.1

Initial release of Text Marker
