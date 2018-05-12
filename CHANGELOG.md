# Change Log

All notable changes to "Text Marker (Highlighter)" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased
### Added
- Introduced a configuration to use the highlight color on the ruler. ([Issue #12](https://github.com/ryu1kn/vscode-text-marker/issues/12))

### Removed
- Removed deprecated commands: **Highlight Selected Text** and **Mark Text to Highlight/Unhighlight**

## [0.11.0] - 2018-02-17
### Added
- Introduced **Save All Highlights** command. Saved highlights are restored next time you open the editor. ([Issue #5](https://github.com/ryu1kn/vscode-text-marker/issues/5))

## [0.10.1] - 2017-09-14
### Fixed
- Fixed the link to the gif animation

## [0.10.0] - 2017-06-11
### Added
- Introduced **Update Highlight** command. You can change the pattern, case sensitivity or whole/partial match of an existing highlight, available as a right-click menu.

### Changed
- Deprecated **Highlight Selected Text** command in favour of **Toggle Highlight** commands.

## [0.9.0] - 2017-06-06
### Added
- Introduced **Toggle Highlight** command. When you remove highlight with this command, it works not only string type highlight but also regex type highlight. ([Issue #6](https://github.com/ryu1kn/vscode-text-marker/issues/6))

### Changed
- Right click menu **Highlight Selected Text** has been replaced with **Toggle Highlight** command.

## [0.8.0] - 2017-06-04
### Added
- Introduced the mode for whole match. Whether text matching is done with whole match is decided by the current mode.
  The mode can be flipped with **Toggle Mode for Whole/Partial Match** command accessible from the status bar.

## [0.7.0] - 2017-06-03
### Added
- Support "whole match" text matching ([Issue #7](https://github.com/ryu1kn/vscode-text-marker/issues/7))

## [0.6.1] - 2017-06-02
### Fixed
- Fixed the problem that the symbols for representing the current mode for case sensitivity were used in reverse

## [0.6.0] - 2017-06-02
### Added
- Introduced the mode for case sensitivity. Whether text matching should be done by ignoring case is decided by the current mode.
  The mode can be flipped with **Toggle Mode for Case Sensitivity** command accessible from the status bar.

## [0.5.0] - 2017-05-28
### Added
- Support case insensitive text matching

## [0.4.0] - 2017-05-24
### Added
- Support regex to highlight text ([Issue #8](https://github.com/ryu1kn/vscode-text-marker/issues/8))
- Put **Highlight Selected Text** command in the right click menu

### Changed
- Deprecated **Mark Text to Highlight/Unhighlight** command in favour of **Highlight Selected Text** and **Unhighlight Text** commands (See [Issue #8](https://github.com/ryu1kn/vscode-text-marker/issues/8))

## [0.3.0] - 2016-11-07
### Added
- Select the word under the cursor if no text is selected when triggering mark text command ([Issue #3](https://github.com/ryu1kn/vscode-text-marker/issues/3))

## [0.2.0] - 2016-11-04
### Added
- Utilised `OverviewRuler` to help users easily find where in the file highlighted texts can be found ([Issue #4](https://github.com/ryu1kn/vscode-text-marker/issues/4))

## [0.1.0] - 2016-09-13
### Added
- Added **Clear All Highlights** command to remove all highlights at once

## [0.0.1] - 2016-07-05
### Added
- Initial release of Text Marker
