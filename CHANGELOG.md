# Change Log

All notable changes to "Text Marker (Highlighter)" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.8.0] - 2018-09-15
### Added
- Highlight colour can now be updated through right-click menu. [#22](https://github.com/ryu1kn/vscode-text-marker/issues/22)
- Usage data collecting capability, together with the configuration (`textmarker.enableTelemetry`) which stops Text Marker to collect usage data.

## [1.7.0] - 2018-08-28
### Added
- Configuration for opacity for all highlights. Easy to see overwrapped patterns. [#23](https://github.com/ryu1kn/vscode-text-marker/issues/23)

## [1.6.0] - 2018-08-09
### Added
- New configuration for individually show/hide Text Marker commands on the context menu. [#21](https://github.com/ryu1kn/vscode-text-marker/issues/21)

## [1.5.0] - 2018-08-06
### Added
- Auto-scroll window if a new cursor location is out of the visible area. [#20](https://github.com/ryu1kn/vscode-text-marker/issues/20)

## [1.4.0] - 2018-08-05
### Added
- Feature to jump to next/previous location of the same highlight. [#14](https://github.com/ryu1kn/vscode-text-marker/issues/14)

## [1.3.1] - 2018-07-22
### Fixed
- Fixed the issue that a string pattern highlight could not be toggled off by selecting the exact same text.
  [#18](https://github.com/ryu1kn/vscode-text-marker/issues/18)

## [1.3.0] - 2018-06-22
### Added
- New configurations to set default modes for case sensitivity and whole match. [#19](https://github.com/ryu1kn/vscode-text-marker/issues/19)

## [1.2.0] - 2018-06-21
### Added
- Text colour can be automatically chosen so that it stands out from the background highlight. Thanks to @Kronuz !
  [#15](https://github.com/ryu1kn/vscode-text-marker/issues/15) & [#17](https://github.com/ryu1kn/vscode-text-marker/issues/17)

## [1.1.0] - 2018-05-15
### Added
- Introduced a configuration to change the default highlight colour. [#16](https://github.com/ryu1kn/vscode-text-marker/issues/16)

## [1.0.0] - 2018-05-12
### Added
- Introduced a configuration to use the highlight colour on the ruler. [#12](https://github.com/ryu1kn/vscode-text-marker/issues/12)

### Removed
- Removed deprecated commands: **Highlight Selected Text** and **Mark Text to Highlight/Unhighlight**

## [0.11.0] - 2018-02-17
### Added
- Introduced **Save All Highlights** command. Saved highlights are restored next time you open the editor. [#5](https://github.com/ryu1kn/vscode-text-marker/issues/5)

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
- Introduced **Toggle Highlight** command. When you remove highlight with this command, it works not only string type highlight but also regex type highlight. [#6](https://github.com/ryu1kn/vscode-text-marker/issues/6)

### Changed
- Right click menu **Highlight Selected Text** has been replaced with **Toggle Highlight** command.

## [0.8.0] - 2017-06-04
### Added
- Introduced the mode for whole match. Whether text matching is done with whole match is decided by the current mode.
  The mode can be flipped with **Toggle Mode for Whole/Partial Match** command accessible from the status bar.

## [0.7.0] - 2017-06-03
### Added
- Support "whole match" text matching. [#7](https://github.com/ryu1kn/vscode-text-marker/issues/7)

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
- Support regex to highlight text. [#8](https://github.com/ryu1kn/vscode-text-marker/issues/8)
- Put **Highlight Selected Text** command in the right click menu

### Changed
- Deprecated **Mark Text to Highlight/Unhighlight** command in favour of **Highlight Selected Text** and **Unhighlight Text** commands. [#8](https://github.com/ryu1kn/vscode-text-marker/issues/8)

## [0.3.0] - 2016-11-07
### Added
- Select the word under the cursor if no text is selected when triggering mark text command. [#3](https://github.com/ryu1kn/vscode-text-marker/issues/3)

## [0.2.0] - 2016-11-04
### Added
- Utilised `OverviewRuler` to help users easily find where in the file highlighted texts can be found. [#4](https://github.com/ryu1kn/vscode-text-marker/issues/4)

## [0.1.0] - 2016-09-13
### Added
- Added **Clear All Highlights** command to remove all highlights at once

## [0.0.1] - 2016-07-05
### Added
- Initial release of Text Marker
