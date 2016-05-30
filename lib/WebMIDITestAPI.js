"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var events = require("events");
var MIDIAccess = require("./MIDIAccess");
var MIDIDevice = require("../src/MIDIDevice");

// partial interface Navigator {
//   Promise<MIDIAccess> requestMIDIAccess(optional MIDIOptions options);
// };

var WebMIDITestAPI = function (_events$EventEmitter) {
  _inherits(WebMIDITestAPI, _events$EventEmitter);

  function WebMIDITestAPI() {
    _classCallCheck(this, WebMIDITestAPI);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WebMIDITestAPI).call(this));

    _this.requestMIDIAccess = _this.requestMIDIAccess.bind(_this);

    _this._devices = [];
    return _this;
  }

  _createClass(WebMIDITestAPI, [{
    key: "createMIDIDevice",
    value: function createMIDIDevice(opts) {
      var device = new MIDIDevice(opts);

      this._devices.push(device);

      this.emit('statechange');

      return device;
    }
  }, {
    key: "requestMIDIAccess",
    value: function requestMIDIAccess(opts) {
      return Promise.resolve(new MIDIAccess(this, opts));
    }
  }, {
    key: "devices",
    get: function get() {
      return this._devices.slice();
    }
  }, {
    key: "inputs",
    get: function get() {
      return this._devices.reduce(function (a, b) {
        return a.concat(b.inputs);
      }, []);
    }
  }, {
    key: "outputs",
    get: function get() {
      return this._devices.reduce(function (a, b) {
        return a.concat(b.outputs);
      }, []);
    }
  }]);

  return WebMIDITestAPI;
}(events.EventEmitter);

module.exports = WebMIDITestAPI;