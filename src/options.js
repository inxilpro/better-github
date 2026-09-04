const fields = {
  username: document.getElementById('username'),
  dimDrafts: document.getElementById('dimDrafts'),
  rewritePullsLinks: document.getElementById('rewritePullsLinks'),
  defaultPullsFilter: document.getElementById('defaultPullsFilter'),
};

const form = document.getElementById('settings');
const status = document.getElementById('status');

function render(settings) {
  fields.username.value = settings.username;
  fields.dimDrafts.checked = settings.dimDrafts;
  fields.rewritePullsLinks.checked = settings.rewritePullsLinks;
  fields.defaultPullsFilter.value = settings.defaultPullsFilter;
}

function flash(message) {
  status.textContent = message;
  setTimeout(() => {
    status.textContent = '';
  }, 2000);
}

BetterGitHub.load().then(render);

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const settings = {
    username: fields.username.value.trim().replace(/^@/, ''),
    dimDrafts: fields.dimDrafts.checked,
    rewritePullsLinks: fields.rewritePullsLinks.checked,
    defaultPullsFilter: BetterGitHub.normalizeFilter(fields.defaultPullsFilter.value),
  };

  await BetterGitHub.save(settings);
  render(settings);
  flash('Saved');
});

document.getElementById('reset').addEventListener('click', async () => {
  await BetterGitHub.save(BetterGitHub.DEFAULTS);
  render(BetterGitHub.DEFAULTS);
  flash('Reset');
});
