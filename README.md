Idle-Watcher
================


Detects when a user stops interacting with the page for a specified amount of time (for the purpose of disconnecting them).

Check out `3stack:idle-watcher-ui` at https://github.com/3stack-software/meteor-idle-watcher-ui for an example UI.

Usage
---------------

`IdleWatcher.configure(options)`

Supported options:

  * 'detectorMs', How often we should check to see if the user has performed any actions (default 60000ms / 60s)
  * 'idleThreshold', If idleThreshold x detectorMs intervals elapse without any user interaction, the state will transistion to idle. (default: 5 x detectorMs = 5 x 60s = 5m)
  * 'inactiveThreshold', Same as idle, except they will be considered "inactive". (default 20 x detectorMs = 20 x 60s = 5m)
  * 'disconnectInactive', true|false, if true, will automatically call `Meteor.disconnect` if the user becomes inactive


`IdleWatcher.getStatus`

Reactive context, 0 = Active, 1 = Idle, 2 = Inactive


`IdleWatcher.isActive`

Reactive context, true|false

`IdleWatcher.isIdle`

Reactive context, true|false

`IdleWatcher.isInactive`

Reactive context, true|false
