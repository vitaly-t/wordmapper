var logging = require('logging');

var Events = function(options) {
  options = options || {};
};
Events.prototype.on = function(event, fn) {
  var _this = this;
  _this._events = _this._events || {};
  _this._events[event] = this._events[event] || [];
  _this._events[event].push(fn);
};
Events.prototype.off = function(event, fn) {
  var _this = this;
  _this._events = _this._events || {};
  if (event in _this._events === false) {
    return;
  }
  _this._events[event].splice(_this._events[event].indexOf(fn), 1);
};
Events.prototype.trigger = function(event) {
  var _this = this;
  _this._events = _this._events || {};
  if (event in _this._events === false) {
    return;
  }
  logging.debug("Events.trigger()", event, arguments);
  for(var i = 0; i < _this._events[event].length; i++) {
    _this._events[event][i].apply(_this, Array.prototype.slice.call(arguments, 1));
  }
};
Events.mixin = function(dest) {
  ['on','off','trigger'].forEach(function(method) {
    if (typeof dest === 'function') {
      dest.prototype[method] = Events.prototype[method]; 
    } else {
      dest[method] = Events.prototype[method];
    }
  });
};

module.exports.Events = Events;

module.exports.hub = new Events();

// This defines the list of events intended to be used with the
// global event "hub".
module.exports.EVT = {
  ALIGN: 'align',
  CLEAR_HIGHLIGHTS: 'clear_highlights',
  DELETE_ALIGNMENTS: 'delete_alignments',
  BUILD_INDEX: 'build_index',
  EXPORT: 'export',
  LOGIN: 'login',
  LOADING: 'loading',
  ERROR: 'error',
  NOTIFICATION: 'notification'
};