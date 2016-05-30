"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var events = require("events");
var MIDIInput = require("./MIDIInput");
var MIDIOutput = require("./MIDIOutput");

// interface MIDIAccess : EventTarget {
//   readonly  attribute MIDIInputMap  inputs;
//   readonly  attribute MIDIOutputMap outputs;
//             attribute EventHandler  onstatechange;
//   readonly  attribute boolean       sysexEnabled;
// };

var MIDIAccess = function (_events$EventEmitter) {
  _inherits(MIDIAccess, _events$EventEmitter);

  function MIDIAccess(api, opts) {
    _classCallCheck(this, MIDIAccess);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MIDIAccess).call(this));

    _this.$api = api;
    _this._sysexEnabled = !!(opts && opts.sysex);
    _this._onstatechange = null;

    _this.on("statechange", function (e) {
      if (_this._onstatechange !== null) {
        _this._onstatechange.call(_this, e);
      }
    });
    _this.$api.on("statechange", function (e) {
      return _this.emit("statechange", e);
    });
    return _this;
  }

  _createClass(MIDIAccess, [{
    key: "inputs",
    get: function get() {
      var _this2 = this;

      return new Map(this.$api.outputs.map(function (port) {
        return [port.id, new MIDIInput(_this2, port.target)];
      }));
    }
  }, {
    key: "outputs",
    get: function get() {
      var _this3 = this;

      return new Map(this.$api.inputs.map(function (port) {
        return [port.id, new MIDIOutput(_this3, port.target)];
      }));
    }
  }, {
    key: "onstatechange",
    get: function get() {
      return this._onstatechange;
    },
    set: function set(callback) {
      if (callback === null || typeof callback === "function") {
        this._onstatechange = callback;
      }
    }
  }, {
    key: "sysexEnabled",
    get: function get() {
      return this._sysexEnabled;
    }
  }]);

  return MIDIAccess;
}(events.EventEmitter);

module.exports = MIDIAccess;