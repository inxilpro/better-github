import { DEFAULTS, load, save } from './settings.js';

const form = document.getElementById('settings');
const status = document.getElementById('status');
const fields = Object.fromEntries(
	['username', 'dimDrafts', 'rewritePullsLinks', 'defaultPullsFilter']
		.map((id) => [id, document.getElementById(id)]),
);

function render(settings) {
	fields.username.value = settings.username;
	fields.dimDrafts.checked = settings.dimDrafts;
	fields.rewritePullsLinks.checked = settings.rewritePullsLinks;
	fields.defaultPullsFilter.value = settings.defaultPullsFilter;
}

function flash(message) {
	status.textContent = message;
	setTimeout(() => status.textContent = '', 2000);
}

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	
	const settings = {
		username: fields.username.value.trim().replace(/^@/, ''),
		dimDrafts: fields.dimDrafts.checked,
		rewritePullsLinks: fields.rewritePullsLinks.checked,
		defaultPullsFilter: fields.defaultPullsFilter.value.trim(),
	};
	
	await save(settings);
	render(settings);
	flash('Saved');
});

document.getElementById('reset').addEventListener('click', async () => {
	await save(DEFAULTS);
	render(DEFAULTS);
	flash('Reset');
});

render(await load());
