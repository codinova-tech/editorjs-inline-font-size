![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Font Size tool
Font size inline tool for the [Editor.js](https://editorjs.io).

## Installation

### Install via NPM or Yarn

Get the package

```shell
npm i --save-dev editorjs-inline-font-size-tool
```
or
```shell
yarn add editorjs-inline-font-size-tool --dev
```

Include module in your application

```javascript
const FontSizeTool = require('editorjs-inline-font-size-tool');
```

### Upload to your project's source dir
1. Download folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

## Usage
Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...
  
  tools: {
    ...
    fontSize: FontSizeTool
  }
  ...
});
```




