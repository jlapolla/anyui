'use strict';

alert('anyui lib');

this.anyui = (function(root) {

  var module = {};

  var Math = root.Math;
  var Object = root.Object;
  var Set = root.Set;
  var JSON = root.JSON;
  var undefined = (function() {}());

  ///
  /// Functions
  ///

  var is = Object.is;

  var callFunction = function(callback) {
    callback();
  };

  var applyMixinTo = function(target_class) {
    for (var name in this.prototype) {
      if (is(name, 'constructor')) {
        continue;
      }
      target_class.prototype[name] = this.prototype[name];
    }
  };

  var makeMixin = function(mixin_class) {
    mixin_class.applyMixinTo = applyMixinTo.bind(mixin_class);
  }

  ///
  /// Classes
  ///

  var BatchEvent = (function() {

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

  var Observable = (function() {

    ///
    /// Constructor
    ///

    function Observable() {
      this._callbacks = new Set();
    };

    makeMixin(Observable);

    ///
    /// Public methods
    ///

    Observable.prototype.addCallback = function(callback) {
      this._callbacks.add(callback);
    };

    Observable.prototype.removeCallback = function(callback) {
      this._callbacks.delete(callback);
    };

    Observable.prototype.runCallbacks = function() {
      this._callbacks.forEach(callFunction);
    };

    return Observable;
  }());
  module.Observable = Observable;

  var Global = (function() {

    ///
    /// Constructor
    ///

    function Global() {
      this._batch_event = null;
    };

    ///
    /// Public methods
    ///

    Global.prototype.getBatchEvent = function() {
      return this._batch_event;
    };

    Global.prototype.setBatchEvent = function(value) {
      this._batch_event = value;
    };

    return Global;
  }());
  module.Global = Global;

  ///
  /// Set up globals
  ///

  module.globals = new Global();
  module.globals.setBatchEvent(new BatchEvent());

  return module;
}(this));
