"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MIDIPort = require("./MIDIPort");

// interface MIDIInput : MIDIPort {
//   attribute EventHandler onmidimessage;
// };

var MIDIInput = function (_MIDIPort) {
  _inherits(MIDIInput, _MIDIPort);

  function MIDIInput(access, port) {
    _classCallCheck(this, MIDIInput);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MIDIInput).call(this, access, port));

    port.on("midimessage", function (e) {
      if (_this._onmidimessage !== null && _this.connection === "open") {
        _this._onmidimessage.call(_this, e);
      }
    });
    return _this;
  }

  _createClass(MIDIInput, [{
    key: "onmidimessage",
    get: function get() {
      return this._onmidimessage;
    },
    set: function set(callback) {
      if (callback === null || typeof callback === "function") {
        this._onmidimessage = callback;
        if (callback && this.connection !== "open") {
          this._implicitOpen();
        }
      }
    }
  }]);

  return MIDIInput;
}(MIDIPort);

module.exports = MIDIInput;