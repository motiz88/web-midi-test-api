"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var events = require("events");

// interface MIDIPort : EventTarget {
//   readonly  attribute DOMString               id;
//   readonly  attribute DOMString?              manufacturer;
//   readonly  attribute DOMString?              name;
//   readonly  attribute MIDIPortType            type;
//   readonly  attribute DOMString?              version;
//   readonly  attribute MIDIPortDeviceState     state;
//   readonly  attribute MIDIPortConnectionState connection;
//             attribute EventHandler            onstatechange;
//   Promise<MIDIPort> open();
//   Promise<MIDIPort> close();
// };

var MIDIPort = function (_events$EventEmitter) {
  _inherits(MIDIPort, _events$EventEmitter);

  function MIDIPort(access, port) {
    _classCallCheck(this, MIDIPort);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MIDIPort).call(this));

    _this.$access = access;
    _this.$port = port;

    _this._connection = "closed";
    _this._onstatechange = null;

    _this.on("statechange", function (e) {
      if (_this._onstatechange !== null) {
        _this._onstatechange.call(_this, e);
      }
    });
    port.on("connected", function () {
      if (_this.connection === "pending") {
        _this._open().then(function () {
          _this._connection = "open";

          var event = { port: _this };

          _this.$access.emit("statechange", event);
          _this.emit("statechange", event);
        });
      }
    });
    port.on("disconnected", function () {
      if (_this.connection !== "closed") {
        _this._close().then(function () {
          _this._connection = "closed";

          var event = { port: _this };

          _this.$access.emit("statechange", event);
          _this.emit("statechange", event);
        });
      }
    });
    return _this;
  }

  _createClass(MIDIPort, [{
    key: "open",
    value: function open() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        try {
          _this2._implicitOpen();
          resolve(_this2);
        } catch (e) {
          reject(e);
        }
      });
    }
  }, {
    key: "close",
    value: function close() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        if (_this3.connection === "closed") {
          return resolve(_this3);
        }

        return _this3._close().then(function () {
          _this3._connection = "closed";

          var event = { port: _this3 };

          _this3.$access.emit("statechange", event);
          _this3.emit("statechange", event);

          resolve(_this3);
        }, reject);
      });
    }
  }, {
    key: "_open",
    value: function _open() {
      return Promise.resolve(this);
    }
  }, {
    key: "_close",
    value: function _close() {
      return Promise.resolve(this);
    }
  }, {
    key: "_implicitOpen",
    value: function _implicitOpen() {
      if (this.connection === "open" || this.connection === "pending") {
        return;
      }

      if (this.state === "disconnected") {
        this._connection = "pending";

        var _event = { port: this };

        this.$access.emit("statechange", _event);
        this.emit("statechange", _event);

        return;
      }

      this._connection = "open";

      var event = { port: this };

      this.$access.emit("statechange", event);
      this.emit("statechange", event);
    }
  }, {
    key: "id",
    get: function get() {
      return this.$port.id;
    }
  }, {
    key: "manufacturer",
    get: function get() {
      return this.$port.manufacturer;
    }
  }, {
    key: "name",
    get: function get() {
      return this.$port.name;
    }
  }, {
    key: "type",
    get: function get() {
      return this.$port.type;
    }
  }, {
    key: "version",
    get: function get() {
      return this.$port.version;
    }
  }, {
    key: "state",
    get: function get() {
      return this.$port.state;
    }
  }, {
    key: "connection",
    get: function get() {
      return this._connection;
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
  }]);

  return MIDIPort;
}(events.EventEmitter);

module.exports = MIDIPort;