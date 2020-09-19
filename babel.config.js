/** @prettier */

module.exports = {
  "presets": [
    [
      '@babel/preset-env',
      {
        "useBuiltIns": "entry",
        "corejs": 3,
        "targets": {
          "esmodules": true,
        },
      },
    ],
    "solid",
  ],
  "plugins": [
    "macros",
    [
      "emotion",
      {
        "autoLabel": true,
      },
    ],
  ],
};
