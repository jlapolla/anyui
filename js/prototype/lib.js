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

  var hasOwnProperty = (function() {
    var fn = Object.prototype.hasOwnProperty;
    return function(obj, prop) {
      return fn.call(obj, prop);
    };
  }());

  var deepCopy = function(obj) {
    // https://stackoverflow.com/a/5344074/6815417
    return JSON.parse(JSON.stringify(obj));
  };

  var applyMixin = function(target_class, mixin_class) {

    for (var name in mixin_class.prototype) {
      if (name !== 'constructor') {
        target_class.prototype[name] = mixin_class.prototype[name];
      }
    }
  };
  module.applyMixin = applyMixin;

  var createGetter = function(prop) {
    return function() {
      return this[prop];
    };
  };

  var createSetter = function(prop) {
    return function(val) {
      this[prop] = val;
    };
  };

  var createAccessor = function(prop) {
    var getFnName = 'get' + prop;
    var setFnName = 'set' + prop;
    return function(val) {
      if (is(val, undefined)) {
        return this[getFnName]();
      }
      else {
        this[setFnName](val)
      }
    };
  };

  var ObservableMixin = (function() {

    var callOnObservedUpdated = function(observer) {
      observer.onObservedUpdated();
    };

    function ObservableMixin() {

      this._observers = new Set();
    };

    ObservableMixin.prototype = {};

    ObservableMixin.prototype.notifyObservers = function() {
      this._observers.forEach(callOnObservedUpdated);
    };

    ObservableMixin.prototype.attachObserver = function(observer) {
      this._observers.add(observer);
    };

    ObservableMixin.prototype.detachObserver = function(observer) {
      this._observers.delete(observer);
    };

    return ObservableMixin;
  }());
  module.ObservableMixin = ObservableMixin;

  var Point = (function(){

    function Point(coord_x, coord_y) {

      ObservableMixin.call(this);

      this._coord_x = coord_x;
      this._coord_y = coord_y;
    };

    Point.prototype = {};
    applyMixin(Point, ObservableMixin);

    Point.prototype.getCoordX = function() {
      return this._coord_x;
    };

    Point.prototype.setCoordX = function(val) {
      this._coord_x = val;
      this.notifyObservers();
    };

    Point.prototype.coordX = function(val) {
      if (is(val, undefined)) {
        return this.getCoordX();
      }
      else {
        this.setCoordX(val);
      }
    };

    Point.prototype.getCoordY = function() {
      return this._coord_y;
    };

    Point.prototype.setCoordY = function(val) {
      this._coord_y = val;
      this.notifyObservers();
    };

    Point.prototype.coordY = function(val) {
      if (is(val, undefined)) {
        return this.getCoordY();
      }
      else {
        this.setCoordY(val);
      }
    };

    return Point;
  }());
  module.Point = Point;

  var Rectangle = (function(){

    function Rectangle(pt_a, pt_b) {

      ObservableMixin.call(this);

      this._pt_a = pt_a;
      this._pt_b = pt_b;
    };

    Rectangle.prototype = {};
    applyMixin(Rectangle, ObservableMixin);

    Rectangle.prototype.getPtA = function() {
      return this._pt_a;
    };

    Rectangle.prototype.setPtA = function(val) {
      this._pt_a = val;
      this.notifyObservers();
    };

    Rectangle.prototype.ptA = function(val) {
      if (is(val, undefined)) {
        return this.getPtA();
      }
      else {
        this.setPtA(val);
      }
    };

    Rectangle.prototype.getPtB = function() {
      return this._pt_b;
    };

    Rectangle.prototype.setPtB = function(val) {
      this._pt_b = val;
      this.notifyObservers();
    };

    Rectangle.prototype.ptB = function(val) {
      if (is(val, undefined)) {
        return this.getPtB();
      }
      else {
        this.setPtB(val);
      }
    };

    Rectangle.prototype.getWidth = function() {
      var x_a = this.ptA().coordX();
      var x_b = this.ptB().coordX();
      return Math.max(x_a, x_b) - Math.min(x_a, x_b);
    };

    Rectangle.prototype.getHeight = function() {
      var y_a = this.ptA().coordY();
      var y_b = this.ptB().coordY();
      return Math.max(y_a, y_b) - Math.min(y_a, y_b);
    };

    return Rectangle;
  }());
  module.Rectangle = Rectangle;

  var AsyncUpdateScheduler = (function() {

    var callUpdate = function(updatable) {
      updatable.update();
    };

    function AsyncUpdateScheduler() {

      this._timeout_id = null;
      this._update_subjects = new Set();
    };

    AsyncUpdateScheduler.prototype = {};

    AsyncUpdateScheduler.prototype.schedule = function(updatable) {
      this._update_subjects.add(updatable);
      if (is(this._timeout_id, null)) {
        this._timeout_id = root.setTimeout(this._update.bind(this), 0);
      }
    };

    AsyncUpdateScheduler.prototype._update = function() {
      this._update_subjects.forEach(callUpdate);
      this._update_subjects.clear();
      this._timeout_id = null;
    };

    return AsyncUpdateScheduler;
  }());
  module.AsyncUpdateScheduler = AsyncUpdateScheduler;

  return module;
}(this));
