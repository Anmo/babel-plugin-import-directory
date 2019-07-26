import '@babel/register'
import * as babel from '@babel/core'
import test from 'ava'
import plugin from '../src'

const transform = (code, opts = {}) =>
  babel.transform(code, {
    babelrc: false,
    plugins: [[plugin, opts]]
  }).code

test('importing a module shouldn\'t do nothing', (t) => {
  const orig = `import x from 'fake-module';`

  t.is(transform(orig), orig)
})

test('importing a existing file shouldn\'t do nothing', (t) => {
  const orig = `import x from './src/index.js';`

  t.is(transform(orig), orig)
})

test('importing a existing directory with an index file shouldn\'t do nothing', (t) => {
  const orig = `import x from './src';`

  t.is(transform(orig), orig)
})

test('importing a existing directory without javascript files shouldn\'t do nothing', (t) => {
  const orig = `import x from './test/fixtures/d';`

  t.is(transform(orig), orig)
})

test('importing a existing directory without index file', (t) => {
  const orig = `import x from './test/fixtures';`

  t.is(transform(orig), `const _dirImport = {};
import * as _fakeModuleB from "./test/fixtures/fake-module-b";
import * as _fakeModuleA from "./test/fixtures/fake.module.a";
_dirImport.fakeModuleA = _fakeModuleA
_dirImport.fakeModuleB = _fakeModuleB
const x = _dirImport;`)
})

test('importing a existing directory without index file', (t) => {
  const orig = `import x from './test/fixtures';`

  t.is(transform(orig, {snakeCase: true}), `const _dirImport = {};
import * as _fakeModuleB from "./test/fixtures/fake-module-b";
import * as _fakeModuleA from "./test/fixtures/fake.module.a";
_dirImport.fake_module_a = _fakeModuleA
_dirImport.fake_module_b = _fakeModuleB
const x = _dirImport;`)
})

test('importing a existing directory without index file', (t) => {
  const orig = `import x from './test/fixtures/*';`

  t.is(transform(orig), `const _dirImport = {};
import * as _fakeModuleB from "./test/fixtures/fake-module-b";
import * as _fakeModuleA from "./test/fixtures/fake.module.a";

for (let key in _fakeModuleA) {
  _dirImport[key === 'default' ? "fakeModuleA" : key] = _fakeModuleA[key];
}

for (let key in _fakeModuleB) {
  _dirImport[key === 'default' ? "fakeModuleB" : key] = _fakeModuleB[key];
}

const x = _dirImport;`)
})

test('importing a existing directory without index file', (t) => {
  const orig = `import x from './test/fixtures/**';`

  t.is(transform(orig), `const _dirImport = {};
import * as _fakeModuleD from "./test/fixtures/c/fakeModuleD";
import * as _fakeModuleB from "./test/fixtures/fake-module-b";
import * as _fakeModuleA from "./test/fixtures/fake.module.a";
_dirImport.fakeModuleA = _fakeModuleA
_dirImport.fakeModuleB = _fakeModuleB
_dirImport.fakeModuleD = _fakeModuleD
const x = _dirImport;`)
})

test('importing a existing directory without index file along with extension', (t) => {
  const orig = `import x from './test/fixtures/**';`

  t.is(transform(orig,{addExtWithFilename: true}), `const _dirImport = {};
import * as _fakeModuleDJs from "./test/fixtures/c/fakeModuleD.js";
import * as _fakeModuleBJs from "./test/fixtures/fake-module-b.js";
import * as _fakeModuleAJs from "./test/fixtures/fake.module.a.js";
_dirImport.fakeModuleAJs = _fakeModuleAJs
_dirImport.fakeModuleBJs = _fakeModuleBJs
_dirImport.fakeModuleDJs = _fakeModuleDJs
const x = _dirImport;`)
})


test('importing a existing directory without index file', (t) => {
  const orig = `import x from './test/fixtures/**/*';`

  t.is(transform(orig), `const _dirImport = {};
import * as _fakeModuleD from "./test/fixtures/c/fakeModuleD";
import * as _fakeModuleB from "./test/fixtures/fake-module-b";
import * as _fakeModuleA from "./test/fixtures/fake.module.a";

for (let key in _fakeModuleA) {
  _dirImport[key === 'default' ? "fakeModuleA" : key] = _fakeModuleA[key];
}

for (let key in _fakeModuleB) {
  _dirImport[key === 'default' ? "fakeModuleB" : key] = _fakeModuleB[key];
}

for (let key in _fakeModuleD) {
  _dirImport[key === 'default' ? "fakeModuleD" : key] = _fakeModuleD[key];
}

const x = _dirImport;`)
})

test('importing a existing directory without index file', (t) => {
  const orig = `import { fakeModuleA } from './test/fixtures/*';`

  t.is(transform(orig), `const _dirImport = {};
import * as _fakeModuleB from "./test/fixtures/fake-module-b";
import * as _fakeModuleA from "./test/fixtures/fake.module.a";

for (let key in _fakeModuleA) {
  _dirImport[key === 'default' ? "fakeModuleA" : key] = _fakeModuleA[key];
}

for (let key in _fakeModuleB) {
  _dirImport[key === 'default' ? "fakeModuleB" : key] = _fakeModuleB[key];
}

const fakeModuleA = _dirImport.fakeModuleA;`)
})

test('importing a existing directory without index file', (t) => {
  const orig = `import { fakeModuleA as methodA, someMethodThatReallyDontExists } from './test/fixtures/*';`

  t.is(transform(orig), `const _dirImport = {};
import * as _fakeModuleB from "./test/fixtures/fake-module-b";
import * as _fakeModuleA from "./test/fixtures/fake.module.a";

for (let key in _fakeModuleA) {
  _dirImport[key === 'default' ? "fakeModuleA" : key] = _fakeModuleA[key];
}

for (let key in _fakeModuleB) {
  _dirImport[key === 'default' ? "fakeModuleB" : key] = _fakeModuleB[key];
}

const methodA = _dirImport.fakeModuleA;
const someMethodThatReallyDontExists = _dirImport.someMethodThatReallyDontExists;`)
})
