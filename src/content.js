import { DEFAULTS, load, normalizeFilter } from './settings.js';

const STYLE_ID = 'better-github-styles';
const PULLS_PATH = /^\/[^/]+\/[^/]+\/pulls\/?$/;
const GITHUB_HOSTS = new Set(['github.com', 'www.github.com']);

let settings = { ...DEFAULTS };
let refreshQueued = false;

// Escapes a value for use inside a double-quoted CSS string.
const cssString = (value) => String(value)
	.replace(/[\\"]/g, '\\$&')
	.replace(/[\x00-\x1f\x7f]/g, (char) => `\\${ char.charCodeAt(0).toString(16) } `);

function buildCss() {
	const username = settings.username.trim();
	
	if (! settings.dimDrafts || ! username) {
		return '';
	}
	
	const mine = `.opened-by a[title*="${ cssString(username) }"]`;
	
	return `
		.js-issue-row:has(.octicon-git-pull-request-draft):has(${ mine }) {
			opacity: 0.6;
			filter: sepia(70%) hue-rotate(240deg);
		}
		
		.js-issue-row:has(.octicon-git-pull-request-draft):not(:has(${ mine })) {
			opacity: 0.2;
		}
	`;
}

function applyStyles() {
	const root = document.head ?? document.documentElement;
	const css = buildCss();
	let style = document.getElementById(STYLE_ID);
	
	if (! root) {
		return;
	}
	
	if (! css) {
		style?.remove();
		return;
	}
	
	if (! style) {
		style = document.createElement('style');
		style.id = STYLE_ID;
		root.append(style);
	}
	
	if (style.textContent !== css) {
		style.textContent = css;
	}
}

function rewriteLinks() {
	if (! settings.rewritePullsLinks) {
		return;
	}
	
	const filter = normalizeFilter(settings.defaultPullsFilter);
	
	if (! filter) {
		return;
	}
	
	for (const link of document.querySelectorAll('a[href]:not([data-better-github])')) {
		link.dataset.betterGithub = 'seen';
		
		const url = URL.parse(link.href, location.href);
		
		if (! url || url.search || ! GITHUB_HOSTS.has(url.host) || ! PULLS_PATH.test(url.pathname)) {
			continue;
		}
		
		url.searchParams.set('q', filter);
		link.href = url.href;
	}
}

function refresh() {
	if (refreshQueued) {
		return;
	}
	
	refreshQueued = true;
	
	requestAnimationFrame(() => {
		refreshQueued = false;
		applyStyles();
		rewriteLinks();
	});
}

chrome.storage.onChanged.addListener((changes, area) => {
	if (area !== 'sync') {
		return;
	}
	
	Object.assign(settings, Object.fromEntries(
		Object.entries(changes).map(([key, { newValue }]) => [key, newValue ?? DEFAULTS[key]]),
	));
	
	// The filter may have changed, so every link needs another look.
	for (const link of document.querySelectorAll('a[data-better-github]')) {
		delete link.dataset.betterGithub;
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

settings = await load();
refresh();
