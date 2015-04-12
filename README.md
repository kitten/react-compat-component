# React Compatibility Component

> The missing link!

**Wrapper class, which adds a compatibility layer to React 0.13's ES6 Component
class, to make it easier to use ES6 goodness without changing much code.**

Do you want to use ES6 classes via React 0.13's Component class?

Do you want to be able to keep your mixins?

Do you miss autobinding `this` to your methods?

*This is perfect for you!*

`react-compat-component` allows you to use the new ES6 class structure for your
components without changing much code. And it allows you to continue to use mixins
without any special modifications. You don't need to code differently because of ES6.

## Installation

```
npm install --save react-compat-component
```

## Example

A modified example from the [React Docs](https://facebook.github.io/react/docs/reusable-components.html):

```javascript
import React from "react";
import { CompatComponent } from "react-compat-component";

export class HelloMessage extends CompatComponent {
  constructor(props) {
    this.mixins = [
      SetIntervalMixin
    ];
    super(props);

    // ...
  }

  getInitialState: function() {
    return {
      seconds: 0
    };
  }

  render() {
    // ...
  }
}
```

## Differences from createClass

Originally React ditched three major features for ES6 classes:

  - Autobinding
  - Mixins
  - getInitialState()

`react-compat-component` restores all three features.

## Difference to react-mixin

`react-mixin` implements a function to modify *arbitrary objects* to "import"
mixins. It is an unnecessary hack and just doesn't feel as elegant as mixins
were. It was a quick fix, but `react-compat-component` is the real deal.

```javascript
reactMixin(Foo.prototype, someMixin);
```

## Contribute

Feel free to contribute!

Open fork, open pull requests and issues and help out. Any feedback
is greatly appreciated.

### Building

You need to let Babel do its job to get a compiled version of this:

```
npm build
```
