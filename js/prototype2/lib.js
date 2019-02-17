'use strict';

alert('anyui lib');

this.anyui = (function(root) {

  var module = {};

  var Math = root.Math;
  var Object = root.Object;
  var Set = root.Set;
  var JSON = root.JSON;
  var undefined = (function() {}());

  var is = Object.is;

  var BatchEvent = (function() {

    var callFunction = function(callback) {
      callback();
    };

    ///
    /// Private methods
    ///

    var _dequeue = function() {
      this._is_enqueued = false;
      this.runCallbacks();
    }

    ///
    /// Constructor
    ///

    function BatchEvent() {
      this._callbacks = [];
      this._is_enqueued = false;
      this._timeout_id = null;
      this._dequeue_callback = _dequeue.bind(this);
    };

    ///
    /// Public methods
    ///

    BatchEvent.prototype = {};

    BatchEvent.prototype.addCallback = function(callback) {
      this._callbacks.push(callback)
      this.enqueue()
    };

    BatchEvent.prototype.runCallbacks = function() {
      this._callbacks.forEach(callFunction);
      this.cancel();
    };

    BatchEvent.prototype.enqueue = function() {
      if (!this._is_enqueued) {
        this._timeout_id = root.setTimeout(this._dequeue_callback, 0);
        this._is_enqueued = true;
      }
    };

    BatchEvent.prototype.cancel = function() {
      if (this._is_enqueued) {
        root.clearTimeout(this._timeout_id);
        this._is_enqueued = false;
      }
      this._callbacks = [];
    };

    return BatchEvent;
  }());
  module.BatchEvent = BatchEvent;

  return module;
}(this));
