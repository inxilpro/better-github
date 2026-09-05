export const DEFAULTS = Object.freeze({
	username: '',
	dimDrafts: true,
	defaultPullsFilter: 'is:pr is:open sort:updated-desc',
	rewritePullsLinks: true,
});

export const load = () => chrome.storage.sync.get(DEFAULTS);

export const save = (settings) => chrome.storage.sync.set(settings);
