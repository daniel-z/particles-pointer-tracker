const presets = [
  [
    "@babel/env", {
      useBuiltIns: "usage",
      "corejs": "3.0.0"
    }
  ]
];

const plugins = [
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-transform-runtime",
  [
    "transform-es2015-modules-commonjs", {
      loose: true
    }
  ]
];

module.exports = {
  presets,
  plugins
};