# Chrome Web Store Listing

Copy from the sections below into the matching fields on the Developer Dashboard.

## Store Listing tab

### Title

    Better GitHub

### Summary

Comes from `description` in `manifest.json`. Max 132 characters.

    Dims draft pull requests and adds a default filter to pull request list links on GitHub.

### Description

    Better GitHub makes pull request lists on github.com easier to scan.

    DIM DRAFT PULL REQUESTS
    Draft pull requests fade into the background so open, ready-for-review work stands out. Drafts you opened yourself keep some contrast and get a subtle tint, so you can still find your own work at a glance. Enter your GitHub username in the settings to turn this on.

    DEFAULT FILTER ON PULL REQUEST LINKS
    Any link to a bare pull request list (github.com/owner/repo/pulls) is rewritten to include a default filter, so you land on open pull requests sorted by most recently updated instead of GitHub's default ordering. The filter is editable, and you can turn the rewriting off entirely.

    PRIVACY
    The extension only runs on github.com, requests a single permission (storage) to save your settings, and makes no network requests. Nothing leaves your browser. Source code is available at https://github.com/inxilpro/better-github.

### Category

    Developer Tools

### Language

    English

### Screenshots

At least one, 1280x800 or 640x400, PNG or JPEG. Suggested:

1. A repository's pull request list with several drafts dimmed and one of your own drafts tinted.
2. The settings popup with the username filled in.

### Small promo tile (optional)

440x280 PNG or JPEG. The 128px icon on a plain background is enough.

### Official URL

    https://github.com/inxilpro/better-github

### Support URL

    https://github.com/inxilpro/better-github/issues

## Privacy tab

### Single purpose description

    Makes pull request lists on github.com easier to scan by dimming draft pull requests and adding a default filter to links to pull request lists.

### Permission justification: storage

    Saves the user's settings (GitHub username, feature toggles, and default filter text) in chrome.storage.sync so they persist and follow the user's Chrome profile.

### Host permission justification: https://github.com/*

    The content script runs only on github.com. It injects a stylesheet that dims draft pull request rows and rewrites the href of links pointing at a repository's pull request list to include a default filter. No page content is read for any other purpose and nothing is sent anywhere.

### Are you using remote code?

    No, I am not using remote code.

The loader's dynamic `import()` loads a file packaged inside the extension, which does not count as remote code.

### Data usage

Check nothing under "What user data do you plan to collect?". The username is entered by the user, stored in Chrome sync storage, and never transmitted to the developer or any third party, so it does not meet the store's definition of collection.

Then certify all three:

- [x] I do not sell or transfer user data to third parties, outside of the approved use cases
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

### Privacy policy URL

    https://github.com/inxilpro/better-github/blob/main/PRIVACY.md

## Distribution tab

- Visibility: Public (or Unlisted to share by link only).
- Regions: All regions.

## Package

Run `./package.sh` from the repo root. Upload the resulting `dist/better-github-<version>.zip` on the Package tab.
