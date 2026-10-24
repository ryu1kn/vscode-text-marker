
# How to Contribute

## Setting up dev environment

### Prerequisites

* Node.js version specified in [.nvmrc](./.nvmrc)
* Yarn for package manager: https://yarnpkg.com/

### Setup

```sh
yarn install
```

## Development

I'd love to see that tests are written to confirm the new behaviours.

You can run all checks (linting & testing) with `yarn run check`.

## Build

You can check what CI is checking at [.travis.yml](./.travis.yml).

## Localized highlight controls

Use Node.js 24.12.0 and Yarn Classic 1.22.22 for the validated build environment.
If Yarn is not installed globally, run `npm exec --yes --package=yarn@1.22.22 -- yarn install --frozen-lockfile`.
Run `npm run check` for TypeScript compilation, linting and the full test suite.
The test suite uses a VS Code API stub; a passing test does not replace a manual extension-host UI check.

Menu and setting translations live in `package.nls*.json`; runtime translations live in `l10n/bundle.l10n*.json`.
Keep English, Simplified Chinese and Traditional Chinese keys in sync. Use `vscode.l10n.t` in runtime code.
Configuration keys and command identifiers must remain language-independent.

Package with `npm exec --yes --package=@vscode/vsce@4.0.0 -- vsce package --no-yarn` after validation.

## Real VS Code smoke test

After packaging, run `node scripts/host-smoke.cjs <package.vsix> <path-to-Code-executable> <locale>`
using Node.js 24 or later. Supported locales are `en`, `zh-cn` and `zh-tw`.
The script installs the VSIX into a fresh isolated profile, installs the official Chinese language pack
when needed, and starts a real extension host with a local renderer debugging port.
It checks ten rendered color menu items, literal array text navigation, live border/radius/opacity
changes including zero, localized regex and save prompts, and regex preservation after recoloring.
Screenshots, renderer styles, menu labels and the actual saved rule remain under ignored
`__host-smoke/`; failed runs are preserved. The test closes its own window automatically.
Personal VS Code profiles, settings and windows are not used by this test.

English, Simplified Chinese and Traditional Chinese have passed this smoke test on Windows
VS Code 1.108.2. Installing a language pack through the CLI does not immediately generate
`languagepacks.json`: the first workbench scan creates it after early startup locale resolution.
The script first bootstraps the isolated workbench and waits for that official cache, then restarts
its test window with the requested display locale. It asserts the actual host locale before testing
translated UI; resource/stub tests do not replace this check.
