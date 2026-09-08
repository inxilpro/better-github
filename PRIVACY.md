# Privacy Policy for Better GitHub

_Last updated: 2026-09-08_

Better GitHub is a Chrome extension that adjusts how pull request lists look and link on github.com. It does not collect, transmit, sell, or share any data.

## What the extension stores

The extension keeps the following settings in Chrome's built-in sync storage (`chrome.storage.sync`):

- The GitHub username you enter, used only to tell your own draft pull requests apart from other people's.
- Whether draft dimming is on.
- Whether pull request link rewriting is on.
- The default pull request filter text.

These values never leave your browser except through Chrome's own profile sync, which is controlled by your Google account settings. The extension has no server and makes no network requests of its own.

## What the extension reads

On github.com pages, the extension reads the page's DOM to find pull request rows and links to pull request lists. It injects a stylesheet and rewrites the `href` of some links. It does not read page content for any other purpose, and it does not run on any other site.

## Permissions

- `storage`: to save your settings.
- Access to `https://github.com/*`: to run the content script that applies the styles and rewrites links.

## Third parties

No data is shared with third parties. The extension includes no analytics, tracking, or advertising code.

## Removing your data

Uninstalling the extension removes its settings from Chrome. You can also clear them at any time with the **Reset defaults** button on the settings page.

## Contact

Questions about this policy can be filed as an issue at https://github.com/inxilpro/better-github/issues.
