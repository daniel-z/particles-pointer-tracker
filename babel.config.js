const presets = [
  [
    "@babel/env", {
      useBuiltIns: "usage",
      "corejs": "3.0.0"
    }
  ]
];

const plugins = ["@babel/plugin-proposal-class-properties"];

module.exports = {
  presets,
  plugins
};