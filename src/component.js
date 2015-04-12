import React from "react";
import invariant from "react/lib/invariant";
import assign from "object-assign";

// Helper to mirror keys as values
function keyMirror(obj) {
  for(var key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = key;
    }
  }
  return obj;
}

// React lifecycle methods that can be defined multiple times
const multiFunctions = keyMirror({
  componentWillReceiveProps: null,
  componentWillMount: null,
  componentDidMount: null,
  componentWillUpdate: null,
  componentDidUpdate: null,
  componentWillUnmount: null
});

export class CompatComponent extends React.Component {
  constructor(props) {
    super(props);

    // Make sure the mixins array is assigned
    if (!this.mixins) {
      this.mixins = [];
    }

    // Importing mixins from the getMixins method
    if (typeof this.getMixins === "function") {
      const _getMixins = this.getMixins();
      if (this.mixins.length > 0) {
        this.mixins = this.mixins.concat(_getMixins);
      } else {
        this.mixins = _getMixins;
      }
    }

    this._mixinImports = {};
    this._prePropsMixinFunctions();

    // Reintroduce getInitialState() method
    let state = {};
    if (typeof this.getInitialState === "function") {
      state = this.getInitialState();
    }

    // Merge state with the mixins' getInitialState() output
    const arr = this.mixins.map(mixin => {
      if (typeof mixin.getInitialState === "function") {
        return mixin.getInitialState();
      } else {
        return {};
      }
    });
    this.state = assign(...arr, state);

    this._bindFunctions();
  }

  // Reintroduce autobinding
  _bindFunctions() {
    const childFunc = Object.getOwnPropertyNames(this.constructor.prototype);
    childFunc.forEach(func => {
      if (typeof this[func] === "function") {
        this[func] = this[func].bind(this);
      }
    });
  }

  // Import the mixins' properties
  _prePropsMixinFunctions() {
    this.mixins.reverse().forEach(mixin => {
      Object.keys(mixin).forEach(property => {
        if (
          property === "propTypes"
        ) {
          this.propTypes = assign(
            mixin.propTypes || {},
            this.propTypes || {}
          );
        } else if (
          property === "getDefaultProps" &&
          typeof mixin.getDefaultProps === "function"
        ) {
          this.defaultProps = assign(
            mixin.getDefaultProps.call(this),
            this.defaultProps || {}
          );
        } else if (
          property === "statics"
        ) {
          this.statics = assign(
            mixin.statics,
            this.statics || {}
          );
        } else if (
          property === "getInitialState"
        ) {
          // This gets handled after the super call in the constructor
          // method to make props usable in f.e. getInitialState()
        } else if (
          typeof mixin[property] === "function"
        ) {
          if (multiFunctions[property]) {
            if (!this._mixinImports.hasOwnProperty(property)) {
              this._mixinImports[property] = [];

              // Save the existing method in the parent class to the
              // "holding" array
              if (typeof this[property] === "function") {
                this._mixinImports[property].push(
                  this[property].bind(this)
                );
              }

              // Overwrite the method to call all methods in the "holding" array
              this[property] = function() {
                this._mixinImports[property].forEach(func => {
                  func.call(this);
                });
              };
            }

            // Push the mixin's method into the "holding" array
            this._mixinImports[property].push(mixin[property].bind(this));
          } else {
            // Check whether methods here can be imported, as they're supposed
            // to only be defined once
            invariant(
              !!(this[property]),
              "You are attempting to redefine '$(property)' on your component. " +
                "This conflict may be due to a mixin."
            );
            this[property] = mixin[property];
          }
        }
      });
    });
  }
}
