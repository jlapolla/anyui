'use strict';

alert('anyui app');

this.app = (function(root) {

  var module = {};

  var anyui = root.anyui;

  ///
  /// Functions
  ///

  var is = Object.is;

  (function() {
    var be = new anyui.BatchEvent();
    be.addCallback((function() {alert('batch callback');}));
  }());

  root.alert('synchronous');

  var Text = (function() {

    function Text() {
      anyui.Observable.call(this);
      this._value = '';
    };
    anyui.makeClass(Text);
    Text.mixinClass(anyui.Observable);

    Text.prototype.getValue = function() {
      return this._value;
    };

    Text.prototype.setValue = function(value) {
      this._value = value;
      this.runCallbacks();
    };

    return Text;
  }());

  var TextAlerter = (function() {

    function TextAlerter() {
      this._text = null;
      this._on_text_changed_callback = this.alertText.bind(this);
    };
    anyui.makeClass(TextAlerter);

    TextAlerter.prototype.getText = function() {
      return this._text;
    };

    TextAlerter.prototype.setText = function(value) {
      if (!is(this._text, null)) {
        this._text.removeCallback(this._on_text_changed_callback);
        this._text = null;
      }
      if (!is(value, null)) {
        value.addCallback(this._on_text_changed_callback);
        this._text = value;
      }
    };

    TextAlerter.prototype.alertText = function() {
      if (!is(this._text, null)) {
        root.alert(this._text.getValue());
      }
      else {
        root.alert('null');
      }
    };

    return TextAlerter;
  }());

  var textA = new Text();
  var textB = new Text();
  var alerter = new TextAlerter();

  textA.setValue('A0');
  textB.setValue('B0');

  alerter.setText(textA);

  textA.setValue('A1');
  textB.setValue('B1');

  alerter.setText(textB);

  textA.setValue('A2');
  textB.setValue('B2');

  alerter.setText(null);

  textA.setValue('A3');
  textB.setValue('B3');

  return module;
}(this));
