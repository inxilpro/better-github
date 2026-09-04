// Better GitHub content script.
//
// 1. Dims draft pull requests in issue/PR lists, keeping your own drafts more
//    visible than everyone else's.
// 2. Rewrites bare links to /<owner>/<repo>/pulls so they carry a default
//    filter.
(function () {
  const STYLE_ID = 'better-github-styles';
  const PULLS_PATH = /^\/[^/]+\/[^/]+\/pulls\/?$/;
  const GITHUB_HOSTS = new Set(['github.com', 'www.github.com']);

  let settings = { ...BetterGitHub.DEFAULTS };

  // Escapes a value for use inside a double-quoted CSS string.
  function cssString(value) {
    return String(value)
      .replace(/[\\"]/g, '\\$&')
      .replace(/[\x00-\x1f\x7f]/g, (ch) => '\\' + ch.charCodeAt(0).toString(16) + ' ');
  }

  function buildCss() {
    const username = (settings.username || '').trim();
    if (!settings.dimDrafts || !username) return '';

    const mine = `.opened-by a[title*="${cssString(username)}"]`;
    return [
      `.js-issue-row:has(.octicon-git-pull-request-draft):has(${mine}) {`,
      '  opacity: 0.6;',
      '  filter: sepia(70%) hue-rotate(240deg);',
      '}',
      '',
      `.js-issue-row:has(.octicon-git-pull-request-draft):not(:has(${mine})) {`,
      '  opacity: 0.2;',
      '}',
      '',
    ].join('\n');
  }

  function applyStyles() {
    const root = document.head || document.documentElement;
    if (!root) return;

    let style = document.getElementById(STYLE_ID);
    const css = buildCss();

    if (!css) {
      if (style) style.remove();
      return;
    }

    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      root.appendChild(style);
    }
    if (style.textContent !== css) style.textContent = css;
  }

  function rewriteLinks() {
    if (!settings.rewritePullsLinks) return;

    const filter = BetterGitHub.normalizeFilter(settings.defaultPullsFilter);
    if (!filter) return;

    for (const link of document.querySelectorAll('a[href]:not([data-better-github])')) {
      link.setAttribute('data-better-github', 'seen');

      let url;
      try {
        url = new URL(link.href, location.href);
      } catch {
        continue;
      }

      if (!GITHUB_HOSTS.has(url.host)) continue;
      if (url.search) continue;
      if (!PULLS_PATH.test(url.pathname)) continue;

      link.href = url.origin + url.pathname + filter + url.hash;
    }
  }

  let queued = false;
  function refresh() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      applyStyles();
      rewriteLinks();
    });
  }

  BetterGitHub.load().then((stored) => {
    settings = stored;
    refresh();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    for (const [key, change] of Object.entries(changes)) {
      settings[key] = change.newValue;
    }
    // Re-check every link: the filter may have changed.
    for (const link of document.querySelectorAll('a[data-better-github]')) {
      link.removeAttribute('data-better-github');
    }
    refresh();
  });

  new MutationObserver(refresh).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  document.addEventListener('DOMContentLoaded', refresh);
  document.addEventListener('turbo:load', refresh);
  document.addEventListener('pjax:end', refresh);
})();
