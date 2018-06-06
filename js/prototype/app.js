'use strict';

alert('anyui app');

this.app = (function(root) {

  var module = {};

  var anyui = root.anyui;

  var Set = root.Set;

  var ActionRecord = (function() {

    function ActionRecord() {
      this._next_action_index = 0;
      this._actions = [];
    };

    ActionRecord.prototype = {};

    ActionRecord.prototype.appendAction = function(action) {
      // assert(this._next_action_index == this._actions.length)
      action.do();
      this._actions.push(action);
      this._next_action_index += 1;
    };

    ActionRecord.prototype.stepForward = function() {
      // assert(this._next_action_index >= 0)
      // assert(this._next_action_index < this._actions.length)
      this._actions[this._next_action_index].do();
      this._next_action_index += 1;
    };

    ActionRecord.prototype.stepBack = function() {
      // assert(this._next_action_index > 0)
      // assert(this._next_action_index <= this._actions.length)
      this._next_action_index -= 1;
      this._actions[this._next_action_index].undo();
    };

    ActionRecord.prototype.isAtEnd = function() {
      return this._next_action_index == this._actions.length
    };

    ActionRecord.prototype.length = function() {
      return this._actions.length;
    };

    return ActionRecord;
  }());

  var CallbackAction = (function() {

    function CallbackAction(do_callback, undo_callback) {

      this._do_callback = do_callback;
      this._undo_callback = undo_callback;
      this._memento = {};
    };

    CallbackAction.prototype = {};

    CallbackAction.prototype.do = function() {
      this._do_callback(this._memento);
    };

    CallbackAction.prototype.undo = function() {
      this._undo_callback(this._memento);
    };

    return CallbackAction;
  }());

  var DigraphVertex = (function() {

    var doEnter = function(memento) {

      memento.on_stack = this._state_props.on_stack;
      memento.visited = this._state_props.visited;

      this._state_props.on_stack = true;
      this._state_props.visited = true;

      this.notifyObservers();
    };

    var undoEnter = function(memento) {

      this._state_props.on_stack = memento.on_stack;
      this._state_props.visited = memento.visited;

      this.notifyObservers();
    };

    function DigraphVertex() {
      this._adjacent_nodes = [];

      this._state_props = {};
      this._state_props.on_stack = false;
      this._state_props.visited = false;
    };

    DigraphVertex.prototype = {};
    anyui.applyMixin(DigraphVertex, anyui.ObservableMixin);

    DigraphVertex.prototype.addAdjacentVertex = function(digraph_vertex) {
      this._adjacent_nodes.push(digraph_vertex);
      this.notifyObservers();
    };

    DigraphVertex.prototype.getAdjacentVertices = function() {
      return this._adjacent_nodes;
    };

    DigraphVertex.prototype.signalEntered = function() {
      // TODO: implement this as a recorded action.
    };

    DigraphVertex.prototype.signalExited = function() {
      this._state_props.on_stack = false;
      this.notifyObservers();
    };

    return DigraphVertex;
  }());

  var DirectedDepthFirstTraversal = (function() {

    function DirectedDepthFirstTraversal(digraph_vertex) {

      this._visited = new Set();
      this._visit(digraph_vertex);
    }

    DirectedDepthFirstTraversal.prototype = {};

    DirectedDepthFirstTraversal.prototype._visit = function(digraph_vertex) {
      digraph_vertex.enter();
      digraph_vertex.exit();
    };
  }());

  var doDepthFirstTraversal = function(node, node_stack) {
    node.enter();
    for (var i = 0; i < node.outEdges.length; ++i) {
      doDepthFirstTraversal(node.outEdges[i]);
    }
    node.exit();
  };

  var DepthFirstSearch = (function() {

    function DepthFirstSearch() {
    }

    return DepthFirstSearch;
  }());

  return module;
}(this));
