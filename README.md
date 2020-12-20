# babel-plugin-import-directory

What's new on this fork ?
=> Include typescript files (.ts) automatically

![npm](https://img.shields.io/npm/v/babel-plugin-import-directory.svg) ![license](https://img.shields.io/npm/l/babel-plugin-import-directory.svg) ![github-issues](https://img.shields.io/github/issues/Anmo/babel-plugin-import-directory.svg)

Are you sick and tired of writing an `index.js` file, just to import/export all the other files in a directory?

Don't seek more :)

Just use `babel-plugin-import-directory` for that!

![nodei.co](https://nodei.co/npm/babel-plugin-import-directory.png?downloads=true&downloadRank=true&stars=true)

![travis-status](https://img.shields.io/travis/Anmo/babel-plugin-import-directory.svg)
![stars](https://img.shields.io/github/stars/Anmo/babel-plugin-import-directory.svg)
![forks](https://img.shields.io/github/forks/Anmo/babel-plugin-import-directory.svg)

![](https://david-dm.org/Anmo/babel-plugin-import-directory/status.svg)
![](https://david-dm.org/Anmo/babel-plugin-import-directory/dev-status.svg)

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


## Scripts

 - **npm run readme** : `node-readme`
 - **npm run test** : `nyc ava`
 - **npm run test:watch** : `yarn test -- --watch`
 - **npm run report** : `nyc report --reporter=html`
 - **npm run build** : `babel -d ./lib ./src`
 - **npm run prepublish** : `babel -d ./lib ./src --minified`

## Dependencies

Package | Version | Dev
--- |:---:|:---:
[babel-template](https://www.npmjs.com/package/babel-template) | ^6.26.0 | ✖
[ava](https://www.npmjs.com/package/ava) | ^0.22.0 | ✔
[babel](https://www.npmjs.com/package/babel) | ^6.5.2 | ✔
[babel-cli](https://www.npmjs.com/package/babel-cli) | ^6.18.0 | ✔
[babel-preset-es2015](https://www.npmjs.com/package/babel-preset-es2015) | ^6.18.0 | ✔
[node-readme](https://www.npmjs.com/package/node-readme) | ^0.1.9 | ✔
[nyc](https://www.npmjs.com/package/nyc) | ^11.2.1 | ✔


## Contributing

Contributions welcome; Please submit all pull requests the against master branch. If your pull request contains JavaScript patches or features, you should include relevant unit tests. Please check the [Contributing Guidelines](contributng.md) for more details. Thanks!

## Author

Anmo <btavares26@gmail.com>

## License

 - **MIT** : http://opensource.org/licenses/MIT
