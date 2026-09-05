import { DEFAULTS, load } from './settings.js';

const STYLE_ID = 'better-github-styles';
const ORIGINAL_HREF = 'betterGithubHref';
const PULLS_PATH = /^\/[^/]+\/[^/]+\/pulls\/?$/;
const GITHUB_HOSTS = new Set(['github.com', 'www.github.com']);

let settings = { ...DEFAULTS };
let seenLinks = new WeakSet();
let pendingRoots = new Set();
let flushQueued = false;

// Escapes a value for use inside a double-quoted CSS string.
const cssString = (value) => String(value)
	.replace(/[\\"]/g, '\\$&')
	.replace(/[\x00-\x1f\x7f]/g, (char) => `\\${ char.charCodeAt(0).toString(16) } `);

function buildCss() {
	const username = settings.username.trim();
	
	if (! settings.dimDrafts || ! username) {
		return '';
	}
	
	const mine = `.opened-by a[data-hovercard-url="/users/${ cssString(username) }/hovercard"]`;
	
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
	const css = buildCss();
	let style = document.getElementById(STYLE_ID);
	
	if (! css) {
		style?.remove();
		return;
	}
	
	if (! style) {
		style = document.createElement('style');
		style.id = STYLE_ID;
	}
	
	if (style.textContent !== css) {
		style.textContent = css;
	}
	
	// Turbo navigations can swap out <head>, so re-attach if we were dropped.
	if (! style.isConnected) {
		(document.head ?? document.documentElement).append(style);
	}
}

function rewriteLink(link) {
	if (seenLinks.has(link)) {
		return;
	}
	
	seenLinks.add(link);
	
	// Most links on a page aren't PR lists, so skip URL parsing for them.
	if (! link.getAttribute('href').includes('/pulls')) {
		return;
	}
	
	const url = URL.parse(link.href, location.href);
	
	if (! url || url.search || ! GITHUB_HOSTS.has(url.host) || ! PULLS_PATH.test(url.pathname)) {
		return;
	}
	
	url.searchParams.set('q', settings.defaultPullsFilter);
	link.dataset[ORIGINAL_HREF] = link.getAttribute('href');
	link.href = url.href;
}

function rewriteLinks(roots) {
	if (! settings.rewritePullsLinks || ! settings.defaultPullsFilter) {
		return;
	}
	
	for (const root of roots) {
		if (root.matches?.('a[href]')) {
			rewriteLink(root);
		}
		
		root.querySelectorAll('a[href]').forEach(rewriteLink);
	}
}

function restoreLinks() {
	for (const link of document.querySelectorAll('a[data-better-github-href]')) {
		link.setAttribute('href', link.dataset[ORIGINAL_HREF]);
		delete link.dataset[ORIGINAL_HREF];
	}
	
	seenLinks = new WeakSet();
}

function scheduleRefresh(roots) {
	for (const root of roots) {
		pendingRoots.add(root);
	}
	
	if (flushQueued) {
		return;
	}
	
	flushQueued = true;
	
	requestAnimationFrame(() => {
		const roots = pendingRoots.has(document) ? [document] : pendingRoots;
		
		pendingRoots = new Set();
		flushQueued = false;
		
		applyStyles();
		rewriteLinks(roots);
	});
}

chrome.storage.onChanged.addListener((changes, area) => {
	if (area !== 'sync') {
		return;
	}
	
	Object.assign(settings, Object.fromEntries(
		Object.entries(changes).map(([key, { newValue }]) => [key, newValue ?? DEFAULTS[key]]),
	));
	
	restoreLinks();
	scheduleRefresh([document]);
});

new MutationObserver((records) => {
	const added = records
		.flatMap((record) => [...record.addedNodes])
		.filter((node) => node.nodeType === Node.ELEMENT_NODE);
	
	if (added.length) {
		scheduleRefresh(added);
	}
}).observe(document.documentElement, {
	childList: true,
	subtree: true,
});

settings = await load();
scheduleRefresh([document]);
