module.exports = {
  extends: ["stylelint-config-prettier"],
  plugins: ["stylelint-no-unsupported-browser-features"],
  rules: { "plugin/no-unsupported-browser-features": true },
  defaultSeverity: "warning"
};
