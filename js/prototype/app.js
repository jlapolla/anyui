'use strict';

alert('anyui app');

this.app = (function(root) {

  var module = {};

  var anyui = root.anyui;

  var Math = root.Math;
  var Object = root.Object;
  var Set = root.Set;
  var undefined = (function() {}());

  var is = Object.is;

  var hasOwnProperty = (function() {
    var fn = Object.prototype.hasOwnProperty;
    return function(obj, prop) {
      return fn.call(obj, prop);
    };
  }());

  var arrayShallowCopy = function(arr) {
    // https://stackoverflow.com/a/20547803/6815417
    return arr.slice();
  };

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
    };

    CallbackAction.prototype = {};

    CallbackAction.prototype.do = function() {
      this._memento = {};
      this._do_callback(this._memento);
    };

    CallbackAction.prototype.undo = function() {
      this._undo_callback(this._memento);
      delete this._memento;
    };

    return CallbackAction;
  }());

  var DigraphVertex = (function() {

    var doAddAdjacentVertex = function(digraph_vertex, memento) {

      memento.adjacent_nodes = arrayShallowCopy(this._adjacent_vertices);

      this._adjacent_vertices.push(digraph_vertex);

      this.notifyObservers();
    };

    var undoAddAdjacentVertex = function(memento) {

      this._adjacent_vertices = memento.adjacent_nodes;

      this.notifyObservers();
    };

    var doSignalEntered = function(memento) {

      memento.on_stack = this.state.on_stack;
      memento.visited = this.state.visited;

      this.state.on_stack = true;
      this.state.visited = true;

      this.notifyObservers();
    };

    var undoSignalEntered = function(memento) {

      this.state.on_stack = memento.on_stack;
      this.state.visited = memento.visited;

      this.notifyObservers();
    };

    function DigraphVertex(simulation_context) {
      this._adjacent_vertices = [];

      this._context = simulation_context;

      this.state = {};
      this.state.on_stack = false;
      this.state.visited = false;
    };

    DigraphVertex.prototype = {};
    anyui.applyMixin(DigraphVertex, anyui.ObservableMixin);

    DigraphVertex.prototype.addAdjacentVertex = function(digraph_vertex) {
      this._context.action_record.appendAction(CallbackAction(
        doAddAdjacentVertex.bind(this, digraph_vertex),
        undoAddAdjacentVertex.bind(this)
      ));
    };

    DigraphVertex.prototype.getAdjacentVertices = function() {
      return this._adjacent_vertices;
    };

    DigraphVertex.prototype.signalEntered = function() {
      this._context.action_record.appendAction(CallbackAction(
        doSignalEntered.bind(this),
        undoSignalEntered.bind(this)
      ));
    };

    DigraphVertex.prototype.signalExited = function() {
      this.state.on_stack = false;
      this.notifyObservers();
    };

    return DigraphVertex;
  }());

  var Digraph = (function() {

    function Digraph(num_vertices, simulation_context) {

      this._vertex_map = Digraph.createVertexMap(num_vertices, simulation_context);
      this._adjacency_list = 

      this._context = simulation_context;
    };

    Digraph.createVertexMap = function(num_vertices, simulation_context) {
      // assert(num_vertices >= 0)
      map = [];
      while (num_vertices > 0) {
        map.push(new DigraphVertex(simulation_context));
        --num_vertices;
      }
      return map;
    };

    Digraph.createAdjacencyList = function(num_vertices) {
      // assert(num_vertices >= 0)
      adj = [];
      while (num_vertices > 0) {
        adj.push([]);
      }
    };

    Digraph.prototype = {};

    return Digraph;
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
