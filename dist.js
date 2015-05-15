"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactLibInvariant = require("react/lib/invariant");

var _reactLibInvariant2 = _interopRequireDefault(_reactLibInvariant);

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

// Helper to mirror keys as values
function keyMirror(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = key;
    }
  }
  return obj;
}

// React lifecycle methods that can be defined multiple times
var multiFunctions = keyMirror({
  componentWillReceiveProps: null,
  componentWillMount: null,
  componentDidMount: null,
  componentWillUpdate: null,
  componentDidUpdate: null,
  componentWillUnmount: null
});

var CompatComponent = (function (_React$Component) {
  function CompatComponent() {
    var _this = this;

    for (var _len = arguments.length, arrs = Array(_len), _key = 0; _key < _len; _key++) {
      arrs[_key] = arguments[_key];
    }

    _classCallCheck(this, CompatComponent);

    _get(Object.getPrototypeOf(CompatComponent.prototype), "constructor", this).apply(this, arrs);

    // Make sure the mixins array is assigned
    if (!this.mixins) {
      this.mixins = [];
    }

    // Importing mixins from the getMixins method
    if (typeof this.getMixins === "function") {
      var _getMixins = this.getMixins();
      if (this.mixins.length > 0) {
        this.mixins = this.mixins.concat(_getMixins);
      } else {
        this.mixins = _getMixins;
      }
    }

    if (!this.propTypes) {
      this.propTypes = {};
    }

    // Importing propTypes from the getPropTypes method
    if (typeof this.getPropTypes === "function") {
      var _getPropTypes = this.getPropTypes();
      for (var key in _getPropTypes) {
        this.propTypes[key] = _getPropTypes[key];
      }
    }

    if (!this.defaultProps) {
      this.defaultProps = {};
    }

    if (typeof this.getDefaultProps === "function") {
      var _getDefaultProps = this.getDefaultProps();
      for (var key in _getDefaultProps) {
        this.defaultProps[key] = _getDefaultProps[key];
      }
    }

    this._mixinImports = {};
    // Overwrite the method to call all methods in the "holding" array
    for (var _key3 in multiFunctions) {
      if (multiFunctions.hasOwnProperty(_key3)) {
        (function () {
          var property = multiFunctions[_key3];
          _this._mixinImports[property] = [];
          _this[property] = function () {
            for (var _len2 = arguments.length, arrs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              arrs[_key2] = arguments[_key2];
            }

            if (_this._mixinImports[property] && _this._mixinImports[property].length) _this._mixinImports[property].forEach(function (func) {
              func.apply(undefined, arrs);
            });
          };
        })();
      }
    }

    this._mixinImports["componentWillUpdate"].unshift(function () {
      _this._processProps();
    });

    this._processProps();
    this._prePropsMixinFunctions();

    // Reintroduce getInitialState() method
    var state = {};
    if (typeof this.getInitialState === "function") {
      state = this.getInitialState();
    }

    // Merge state with the mixins' getInitialState() output
    var arr = this.mixins.map(function (mixin) {
      if (typeof mixin.getInitialState === "function") {
        return mixin.getInitialState();
      } else {
        return {};
      }
    });
    this.state = _objectAssign2["default"].apply(undefined, _toConsumableArray(arr).concat([state]));

    this._bindFunctions();
  }

  _inherits(CompatComponent, _React$Component);

  _createClass(CompatComponent, [{
    key: "_bindFunctions",

    // Reintroduce autobinding
    value: function _bindFunctions() {
      var _this2 = this;

      var childFunc = Object.getOwnPropertyNames(this.constructor.prototype);
      childFunc.forEach(function (func) {
        if (typeof _this2[func] === "function") {
          _this2[func] = _this2[func].bind(_this2);
        }
      });
    }
  }, {
    key: "_processProps",

    // Process props to comply to propTypes and defaultProps
    value: function _processProps() {
      for (var key in this.defaultProps) {
        if (this.defaultProps.hasOwnProperty(key) && !this.props.hasOwnProperty(key)) {
          this.props[key] = this.defaultProps[key];
        }
      }

      for (var key in this.propTypes) {
        if (this.propTypes.hasOwnProperty(key)) {
          var res = this.propTypes[key](this.props, key, this.constructor.name || "");
          if (res) {
            console.warn("Warning: " + res.message);
          }
        }
      }
    }
  }, {
    key: "_prePropsMixinFunctions",

    // Import the mixins' properties
    value: function _prePropsMixinFunctions() {
      var _this3 = this;

      this.mixins.reverse().forEach(function (mixin) {
        Object.keys(mixin).forEach(function (property) {
          if (property === "propTypes") {
            _this3.propTypes = (0, _objectAssign2["default"])(mixin.propTypes || {}, _this3.propTypes || {});
          } else if (property === "getDefaultProps" && typeof mixin.getDefaultProps === "function") {
            _this3.defaultProps = (0, _objectAssign2["default"])(mixin.getDefaultProps.call(_this3), _this3.defaultProps || {});
          } else if (property === "statics") {
            _this3.statics = (0, _objectAssign2["default"])(mixin.statics, _this3.statics || {});
          } else if (property === "getInitialState") {} else if (typeof mixin[property] === "function") {
            if (multiFunctions[property]) {
              if (!_this3._mixinImports.hasOwnProperty(property)) {
                _this3._mixinImports[property] = [];

                // Save the existing method in the parent class to the
                // "holding" array
                if (typeof _this3[property] === "function") {
                  _this3._mixinImports[property].push(_this3[property].bind(_this3));
                }
              }

              // Push the mixin's method into the "holding" array
              _this3._mixinImports[property].push(mixin[property].bind(_this3));
            } else {
              // Check whether methods here can be imported, as they're supposed
              // to only be defined once
              (0, _reactLibInvariant2["default"])(!_this3.hasOwnProperty(property), "You are attempting to redefine '" + property + "' on your component. " + "This conflict may be due to a mixin.");
              _this3[property] = mixin[property];
            }
          }
        });
      });
    }
  }]);

  return CompatComponent;
})(_react2["default"].Component);

exports.CompatComponent = CompatComponent;

// This gets handled after the super call in the constructor
// method to make props usable in f.e. getInitialState()
