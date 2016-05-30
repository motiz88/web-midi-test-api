"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MIDIPort = require("./MIDIPort");
var util = require("./util");

// interface MIDIOutput : MIDIPort {
//   void send(sequence<octet> data, optional double timestamp);
//   void clear();
// };

var MIDIOutput = function (_MIDIPort) {
  _inherits(MIDIOutput, _MIDIPort);

  function MIDIOutput() {
    _classCallCheck(this, MIDIOutput);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MIDIOutput).apply(this, arguments));
  }

  _createClass(MIDIOutput, [{
    key: "send",
    value: function send(data, timestamp) {
      if (!util.validateMidiMessage(data)) {
        throw new TypeError("Invalid MIDI message: " + util.convertMIDIMessageToString(data));
      }
      if ((data[0] & 0xf0) === 0xf0 && !this.$access.sysexEnabled) {
        throw new Error("System exclusive message is not allowed");
      }
      if (this.connection !== "open") this._implicitOpen();
      if (this.connection === "open") {
        this.$port.send(data, timestamp);
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.$port.clear();
    }
  }]);

  return MIDIOutput;
}(MIDIPort);

module.exports = MIDIOutput;