# solidjs-emotion-tailwind

Example webpack project using Solid.js with Emotion + Tailwind.

[1. About](#about)  
[2. Dev/Build](#dev-build)  
[2. Installed NPM Pakcages](#installed-npm-packages)  
[4. LICENSE](#license)  

![screenshot](screenshot.png "Screenshot")

[View Demo](http://tokyo800.jp/minagawah/solidjs-emotion-tailwind/)


<a id="about"></a>
## 1. About

A simple Solid.js project example.

Features:
- Webpack (split chunks, license extraction, etc.)
- Store provider (resize event, Local Storage, etc.)
- Route provider (includes switching sub pages by query params)
- Async examples (lazy load, Suspense, Show, etc.)
- Emotion + Tailwind
- ESLint + Prettier
- Jest

Extra Feature:
- Fun with Canvas animations (Native Canvas + PIXI.js)


<a id="dev-build"></a>
## 2. Dev/Build

### Dev

Starting `webpack-dev-server`:

```bash
yarn start
```

ESLint:

```bash
yarn lint
```

Test (Jest):

```bash
yarn test
```

### Build

Build bundles to `build` directory:

```bash
yarn build
```


<a id="installed-npm-packages"></a>
## 3. Installed NPM Packages


### prod

- solid-js
- ramda
- pixi.js
- pixi.js-legacy

```bash
yarn add solid-js ramda pixi.js pixi.js-legacy
```


### dev

For Babel:
- @babel/core
- @babel/preset-env
- babel-preset-solid

For ESLint:
- babel-eslint
- eslint
- eslint-loader

For Webpack:
- webpack
- webpack-cli
- webpack-dev-server
- webpack-merge
- html-webpack-plugin
- clean-webpack-plugin
- babel-loader
- file-loader

For Webpack (Other Goodies):
- license-webpack-plugin
- copy-webpack-plugin (Not installed)

For CSS:

Although `autoprefixer` and `normalize` are already in `tailwindcss`, we need `autoprefixer` when PostCSS loads CSS in Webpack process.

- css-loader
- style-loader
- postcss-loader
- autoprefixer
- mini-css-extract-plugin

For CSS (emotion + tailwindcss):

- emotion
- babel-plugin-macros
- tailwind.macro@next

For Jest:

- jest
- jest-emotion

```bash
yarn add --dev @babel/core @babel/preset-env @babel/plugin-transform-runtime babel-preset-solid babel-eslint eslint eslint-loader webpack webpack-cli webpack-dev-server webpack-merge html-webpack-plugin clean-webpack-plugin babel-loader file-loader license-webpack-plugin css-loader style-loader postcss-loader autoprefixer mini-css-extract-plugin emotion babel-plugin-macros tailwind.macro@next jest jest-emotion
```



<a id="license"></a>
## 4. License

Dual-licensed under either of the followings.  
Choose at your option.

- The UNLICENSE ([LICENSE.UNLICENSE](LICENSE.UNLICENSE))
- MIT license ([LICENSE.MIT](LICENSE.MIT))
