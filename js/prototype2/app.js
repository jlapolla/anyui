'use strict';

alert('anyui app');

this.app = (function(root) {

  var module = {};

  var anyui = root.anyui;

  (function() {
    var be = new anyui.BatchEvent();
    be.addCallback((function() {alert("batch callback");}));
  }());

  root.alert("synchronous");

  return module;
}(this));
