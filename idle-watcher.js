ClientIdleWatcher.STATUS_ACTIVE = 0;

ClientIdleWatcher.STATUS_IDLE = 1;

ClientIdleWatcher.STATUS_INACTIVE = 2;

ClientIdleWatcher.EVENTS = "mousemove keydown wheel mousedown touchstart ";

ClientIdleWatcher.EVENT_NAMESPACE = 'idleTimer';

ClientIdleWatcher.EVENTS_NS = ClientIdleWatcher.EVENTS.split(' ').join("." + ClientIdleWatcher.EVENT_NAMESPACE + " ");

ClientIdleWatcher.EVENT_VISIBILTY = "visibilitychange." + ClientIdleWatcher.EVENT_NAMESPACE;

ClientIdleWatcher.ONE_EVENT_NAMESPACE = 'idleTimerOne';

ClientIdleWatcher.EVENTS_ONE_NS = ClientIdleWatcher.EVENTS.split(' ').join("." + ClientIdleWatcher.ONE_EVENT_NAMESPACE + " ");

ClientIdleWatcher.DETECTOR_INTERVAL_MS = 60 * 1000;

ClientIdleWatcher.IDLE_THRESHOLD = 5;

ClientIdleWatcher.INACTIVE_THRESHOLD = 20;

function ClientIdleWatcher() {
  this.onInterval = _.bind(this.onInterval, this);
  this.status = ClientIdleWatcher.STATUS_ACTIVE;
  this.statusDep = new Tracker.Dependency();
  this.detectorTimer = null;
  this.detectorMs = ClientIdleWatcher.DETECTOR_INTERVAL_MS;
  this.detectorCount = 0;
  this.idleThreshold = ClientIdleWatcher.IDLE_THRESHOLD;
  this.inactiveThreshold = ClientIdleWatcher.INACTIVE_THRESHOLD;
  this.disconnectInactive = true;
  this.running = false;
}

_.extend(ClientIdleWatcher.prototype, {

  configure: function (options) {
    var wasRunning;
    wasRunning = this.running;
    if (wasRunning) {
      this.stop();
    }
    _.extend(this, _.pick(options, 'detectorMs', 'idleThreshold', 'inactiveThreshold', 'disconnectInactive'));
    if (wasRunning) {
      this.start();
    }
  },

  start: function () {
    this.running = true;
    this.bindEvents();
    this.startDetector();
  },

  stop: function () {
    this.running = false;
    this.unbindEvents();
    this.stopDetector();
    this.setStatus(ClientIdleWatcher.STATUS_ACTIVE);
  },

  bindEvents: function () {
    var self = this;
    $(document).on(ClientIdleWatcher.EVENTS_NS, function () {
        self.detectorCount = 0;
    });
    $(document).on(ClientIdleWatcher.EVENT_VISIBILTY, function(){
      // When the document is hidden, push the user to `idle` state.
      if (document.hidden && self.detectorCount < self.idleThreshold){
        self.detectorCount = self.idleThreshold;
      }
    })
  },

  unbindEvents: function () {
    $(document).off("." + ClientIdleWatcher.EVENT_NAMESPACE);
    $(document).off("." + ClientIdleWatcher.ONE_EVENT_NAMESPACE);
  },

  onInterval: function () {
    var bindOnceEvents, _ref;
    this.detectorCount += 1;
    bindOnceEvents = false;
    if ((this.idleThreshold <= (_ref = this.detectorCount) && _ref < this.inactiveThreshold) && this.status !== ClientIdleWatcher.STATUS_IDLE) {
      bindOnceEvents = true;
      this.setStatus(ClientIdleWatcher.STATUS_IDLE);
    } else if (this.inactiveThreshold <= this.detectorCount && this.status !== ClientIdleWatcher.STATUS_INACTIVE) {
      if (this.status === ClientIdleWatcher.STATUS_IDLE) {
        bindOnceEvents = true;
      }
      this.setStatus(ClientIdleWatcher.STATUS_INACTIVE);
      this.stopDetector();
      if (this.disconnectInactive) {
        Meteor.disconnect();
      }
    }
    if (bindOnceEvents) {
      $(document).one(ClientIdleWatcher.EVENTS_ONE_NS, (function (_this) {
        return function () {
          $(document).off("." + ClientIdleWatcher.ONE_EVENT_NAMESPACE);
          _this.detectorCount = 0;
          _this.setStatus(ClientIdleWatcher.STATUS_ACTIVE);
          _this.startDetector();
        };
      })(this));
    }
  },

  startDetector: function () {
    if (this.detectorTimer == null) {
      this.detectorTimer = Meteor.setInterval(this.onInterval, this.detectorMs);
    }
  },

  stopDetector: function () {
    Meteor.clearInterval(this.detectorTimer);
    this.detectorTimer = null;
  },

  setStatus: function (status) {
    this.status = status;
    this.statusDep.changed();
  },

  getStatus: function () {
    if (Tracker.active) {
      this.statusDep.depend();
    }
    return this.status;
  },

  isActive: function () {
    return this.getStatus() === ClientIdleWatcher.STATUS_ACTIVE;
  },

  isIdle: function () {
    return this.getStatus() === ClientIdleWatcher.STATUS_IDLE;
  },

  isInactive: function () {
    return this.getStatus() === ClientIdleWatcher.STATUS_INACTIVE;
  }
});

IdleWatcher = new ClientIdleWatcher();

Meteor.startup(function() {
  IdleWatcher.start();
});
