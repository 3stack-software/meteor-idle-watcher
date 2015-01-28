Package.describe({
  name: '3stack:idle-watcher',
  version: '0.1.1',
  summary: 'Watches DOM events for activity, and automatically marks users as idle / inactive after a timeout.',
  git: 'https://github.com/3stack-software/meteor-idle-watcher',
  documentation: 'README.md'
});

Package.onUse(function(api){

  api.versionsFrom("METEOR@0.9.2");

  api.export('IdleWatcher', 'client');

  api.use([
    'tracker',
    'underscore',
    'jquery'
  ], 'client');

  api.addFiles([
    'idle-watcher.js'
  ], 'client')
});
