# babel-plugin-import-directory
Are you sick and tired of writing an `index.js` file, just to import/export all the other files in a directory?

Don't seek more :)

Just use `babel-plugin-import-directory` for that!

## Installation

```sh
$ npm i babel-plugin-import-directory
```
or with `yarn`
```sh
$ yarn babel-plugin-import-directory
```

Don't forget to save it in your project (use `--save-dev` or `-D` flag)

```sh
$ npm i -D babel-plugin-import-directory
```
or with `yarn`
```sh
$ yarn add -D babel-plugin-import-directory
```

## Example

With the following folder structure:

```
|- index.js
|- actions
    |- action.a.js
    |- action_b.js
    |- sub_dir
        |- actionC.js
```

and with the following JS:

```javascript
import actions from './actions';
```

will be compiled to:

```javascript
const _dirImport = {};
import * as _actionA from "./actions/action.a";
import * as _actionB from "./actions/action_b";
_dirImport.actionA = _actionA;
_dirImport.actionB = _actionB;
const actions = _dirImport;
```

---

You can also import files recursively using double `asterisk` like this:
```javascript
import actions from './actions/**';
```
will be compiled to:

```javascript
const _dirImport = {};
import * as _actionA from "./actions/action.a";
import * as _actionB from "./actions/action_b";
import * as _actionC from "./actions/sub_dir/actionC";
_dirImport.actionA = _actionA;
_dirImport.actionB = _actionB;
_dirImport.actionC = _actionC;
const actions = _dirImport;
```

---

You can also import all the methods directly, using a single `asterisk`.

the following JS:

```javascript
import actions from './actions/*';
```

will be compiled to:

```javascript
const _dirImport = {};
import * as _actionA from "./actions/action.a";
import * as _actionB from "./actions/action_b";
for (let key in _actionA) {
  _dirImport[key === 'default' ? 'actionA' : key] = _actionA[key];
}

for (let key in _actionB) {
  _dirImport[key === 'default' ? 'actionB' : key] = _actionB[key];
}
const actions = _dirImport;
```

---

And you can use both, double and single `asterisk`, like this:
```javascript
import actions from './actions/**/*';
```

will be compiled to:

```javascript
const _dirImport = {};
import * as _actionA from "./actions/action.a";
import * as _actionB from "./actions/action_b";
import * as _actionC from "./actions/sub_dir/actionC";
for (let key in _actionA) {
  _dirImport[key === 'default' ? 'actionA' : key] = _actionA[key];
}

for (let key in _actionB) {
  _dirImport[key === 'default' ? 'actionB' : key] = _actionB[key];
}

for (let key in _actionC) {
  _dirImport[key === 'default' ? 'actionC' : key] = _actionC[key];
}
const actions = _dirImport;
```

## Usage

Just add it to your **.babelrc** file

```json
{
  "plugins": ["import-directory"]
}
```

And don't write the `index.js` ;)

### Options

### `exts`
By default, the files with the following extensions: `["js", "es6", "es", "jsx"]`, will be imported. You can change this using:

```json
{
    "plugins": [
        ["wildcard", {
            "exts": ["js", "es6", "es", "jsx", "javascript"]
        }]
    ]
}
```

### `snakeCase`
By default, the variables name would be in camelCase. You can change this using:

```json
{
    "plugins": [
        ["wildcard", {
            "snakeCase": true
        }]
    ]
}
```
** result: `action_a`, `action_b` and `action_c` **
