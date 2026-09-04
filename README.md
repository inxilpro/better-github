# Better GitHub

A Chrome extension (Manifest V3) that makes GitHub pull request lists easier to
scan.

## What it does

1. **Fades out draft pull requests.** Drafts you opened keep some contrast and
   get a tint; everyone else's drafts fade further into the background.
2. **Adds a default filter to bare pull request links.** A link to
   `github.com/owner/repo/pulls` becomes
   `github.com/owner/repo/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc`, so you
   land on open PRs sorted by most recently updated.

Both behaviours can be turned off, and the filter is editable.

## Install

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and pick this folder.
4. Click the extension icon and enter your GitHub username, then **Save**.

Draft dimming stays off until a username is set, since the styles need to know
which pull requests are yours.

## Settings

| Setting | Default | Notes |
| --- | --- | --- |
| Your GitHub username | empty | Matched against the "opened by" link. |
| Dim draft pull requests | on | Applies the styles below. |
| Add a default filter to bare pull request links | on | Rewrites `/owner/repo/pulls` links. |
| Default pull request filter | `?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc` | Accepts `?q=…`, `q=…`, or a plain query such as `is:pr is:open`. |

Settings live in `chrome.storage.sync`, so they follow your Chrome profile.

## The styles

With the username set to `octocat`:

```css
.js-issue-row:has(.octicon-git-pull-request-draft):has(.opened-by a[title*="octocat"]) {
  opacity: 0.6;
  filter: sepia(70%) hue-rotate(240deg);
}

.js-issue-row:has(.octicon-git-pull-request-draft):not(:has(.opened-by a[title*="octocat"])) {
  opacity: 0.2;
}
```

## Files

| Path | Purpose |
| --- | --- |
| `manifest.json` | Extension manifest (MV3). |
| `src/settings.js` | Defaults and storage helpers, shared by the content script and options page. |
| `src/content.js` | Injects the styles and rewrites links on `github.com`. |
| `src/options.html` / `.css` / `.js` | Settings page, also used as the toolbar popup. |
| `icons/` | Toolbar and store icons. |

## Notes

- Only one permission is requested: `storage`.
- Link rewriting skips any link that already has a query string.
- GitHub swaps page content without a full reload, so the content script watches
  the DOM and re-applies both changes after navigation.
