"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var events = require("events");
var util = require("./util");

var MidiPortIndex = 0;

var MIDIDevice = function (_events$EventEmitter) {
  _inherits(MIDIDevice, _events$EventEmitter);

  function MIDIDevice(opts) {
    _classCallCheck(this, MIDIDevice);

    opts = opts || {};

    var numberOfInputs = util.defaults(opts.numberOfInputs, 1);
    var numberOfOutputs = util.defaults(opts.numberOfOutputs, 1);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MIDIDevice).call(this));

    _this._manufacturer = util.defaults(opts.manufacturer, "");
    _this._name = util.defaults(opts.name, "Web MIDI Test API");
    _this._version = util.defaults(opts.version, "");
    _this._inputs = Array.from({ length: numberOfInputs }, function () {
      return new MIDIDevice.MessageChannel(_this);
    });
    _this._outputs = Array.from({ length: numberOfOutputs }, function () {
      return new MIDIDevice.MessageChannel(_this);
    });
    _this._state = "connected";
    return _this;
  }

  _createClass(MIDIDevice, [{
    key: "connect",
    value: function connect() {
      if (this._state === "disconnected") {
        this._state = "connected";
        this._inputs.concat(this._outputs).forEach(function (channel) {
          channel.emit("connected");
        });
        this.emit("connected");
      }
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this._state === "connected") {
        this._state = "disconnected";
        this._inputs.concat(this._outputs).forEach(function (channel) {
          channel.emit("disconnected");
        });
        this.emit("disconnected");
      }
    }
  }, {
    key: "manufacturer",
    get: function get() {
      return this._manufacturer;
    }
  }, {
    key: "name",
    get: function get() {
      return this._name;
    }
  }, {
    key: "version",
    get: function get() {
      return this._version;
    }
  }, {
    key: "state",
    get: function get() {
      return this._state;
    }
  }, {
    key: "numberOfInputs",
    get: function get() {
      return this._inputs.length;
    }
  }, {
    key: "numberOfOutputs",
    get: function get() {
      return this._outputs.length;
    }
  }, {
    key: "inputs",
    get: function get() {
      return this._inputs.map(function (port) {
        return port.input;
      });
    }
  }, {
    key: "outputs",
    get: function get() {
      return this._outputs.map(function (port) {
        return port.output;
      });
    }
  }]);

  return MIDIDevice;
}(events.EventEmitter);

MIDIDevice.MessageChannel = function (_events$EventEmitter2) {
  _inherits(MIDIDeviceMessageChannel, _events$EventEmitter2);

  function MIDIDeviceMessageChannel(device) {
    _classCallCheck(this, MIDIDeviceMessageChannel);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(MIDIDeviceMessageChannel).call(this));

    _this2.device = device;
    _this2.id = "" + MidiPortIndex++;
    _this2.manufacturer = _this2.device.manufacturer;
    _this2.name = util.makeChannelName(device.name);
    _this2.version = _this2.device.version;
    _this2.input = new MIDIDevice.MessagePort(_this2, "input");
    _this2.output = new MIDIDevice.MessagePort(_this2, "output");

    _this2.input.target = _this2.output;
    _this2.output.target = _this2.input;

    _this2.on("connected", function () {
      _this2.input.emit("connected");
      _this2.output.emit("connected");
    });
    _this2.on("disconnected", function () {
      _this2.input.emit("disconnected");
      _this2.output.emit("disconnected");
    });
    return _this2;
  }

  _createClass(MIDIDeviceMessageChannel, [{
    key: "state",
    get: function get() {
      return this.device.state;
    }
  }]);

  return MIDIDeviceMessageChannel;
}(events.EventEmitter);

MIDIDevice.MessagePort = function (_events$EventEmitter3) {
  _inherits(MIDIDeviceMessagePort, _events$EventEmitter3);

  function MIDIDeviceMessagePort(channel, type) {
    _classCallCheck(this, MIDIDeviceMessagePort);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(MIDIDeviceMessagePort).call(this));

    _this3.channel = channel;
    _this3.target = null;
    _this3._type = type;
    _this3._onmidimessage = null;

    _this3.on("midimessage", function (e) {
      if (_this3._onmidimessage !== null) {
        _this3._onmidimessage.call(_this3, e);
      }
    });
    return _this3;
  }

  _createClass(MIDIDeviceMessagePort, [{
    key: "send",
    value: function send(data, timestamp) {
      if (!util.validateMidiMessage(data)) {
        throw new TypeError("Invalid MIDI message: " + util.convertMIDIMessageToString(data));
      }
      if (this.target !== null && this.state === "connected") {
        this.target.emit("midimessage", {
          receivedTime: util.defaults(timestamp, Date.now()),
          data: new Uint8Array(data)
        });
      }
    }
  }, {
    key: "clear",
    value: function clear() {}
  }, {
    key: "id",
    get: function get() {
      return this.channel.id;
    }
  }, {
    key: "manufacturer",
    get: function get() {
      return this.channel.manufacturer;
    }
  }, {
    key: "name",
    get: function get() {
      return this.channel.name;
    }
  }, {
    key: "type",
    get: function get() {
      return this._type;
    }
  }, {
    key: "version",
    get: function get() {
      return this.channel.version;
    }
  }, {
    key: "state",
    get: function get() {
      return this.channel.state;
    }
  }, {
    key: "onmidimessage",
    get: function get() {
      return this._onmidimessage;
    },
    set: function set(callback) {
      if (callback === null || typeof callback === "function") {
        this._onmidimessage = callback;
      }
    }
  }]);

  return MIDIDeviceMessagePort;
}(events.EventEmitter);

module.exports = MIDIDevice;