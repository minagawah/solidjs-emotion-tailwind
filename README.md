# solidjs-emotion-tailwind

Example project for Solid.js with Emotion + Tailwind.

[1. About](#about)  
[2. Dev/Build](#dev-build)  
[2. Installed NPM Pakcages](#installed-npm-packages)  
[4. LICENSE](#license)  


<a id="about"></a>
## 1. About

A simple webpack project to demonstrate the use of Solid.js + Emotion + Tailwind.


<a id="dev-build"></a>
## 2. Dev/Build

### Dev

Starting `webpack-dev-server`:

```bash
yarn run start
```

ESLint:

```bash
yarn run lint
```

### Build

Build bundles under `build/`:

```bash
yarn run build
```


<a id="installed-npm-packages"></a>
## 3. Installed NPM Packages


### prod

- solid-js
- ramda

```bash
yarn add solid-js ramda
```


### dev

For Babel:
- @babel/core
- @babel/preset-env
- @babel/plugin-syntax-dynamic-import  
&nbsp; For asynchronous module import.  
- @babel/plugin-transform-runtime  
&nbsp; For the runtime Webpack builds (you may use `babel-polyfill` alternatively).  
- babel-preset-solid  
&nbsp; For Solid JS.

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

```bash
yarn add --dev @babel/core @babel/preset-env @babel/plugin-syntax-dynamic-import @babel/plugin-transform-runtime babel-preset-solid babel-eslint eslint eslint-loader webpack webpack-cli webpack-dev-server webpack-merge html-webpack-plugin clean-webpack-plugin babel-loader file-loader license-webpack-plugin css-loader style-loader postcss-loader autoprefixer mini-css-extract-plugin emotion babel-plugin-macros tailwind.macro@next
```



<a id="license"></a>
## 4. License

Dual-licensed under either of the followings.  
Choose at your option.

- The UNLICENSE ([LICENSE.UNLICENSE](LICENSE.UNLICENSE))
- MIT license ([LICENSE.MIT](LICENSE.MIT))
