// Shared defaults and storage helpers. Loaded by the content script and the
// options page.
var BetterGitHub = (function () {
  const DEFAULTS = {
    username: '',
    dimDrafts: true,
    defaultPullsFilter: '?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc',
    rewritePullsLinks: true,
  };

  function load() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(DEFAULTS, (stored) => resolve(stored));
    });
  }

  function save(settings) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(settings, () => resolve());
    });
  }

  // Normalizes whatever the user typed into a leading-"?" query string.
  // Accepts "?q=...", "q=...", or a bare query such as "is:pr is:open".
  function normalizeFilter(value) {
    const trimmed = (value || '').trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('?')) return trimmed;
    if (/^[\w.\-\[\]%]+=/.test(trimmed)) return '?' + trimmed;
    return '?q=' + encodeURIComponent(trimmed);
  }

  return { DEFAULTS, load, save, normalizeFilter };
})();
