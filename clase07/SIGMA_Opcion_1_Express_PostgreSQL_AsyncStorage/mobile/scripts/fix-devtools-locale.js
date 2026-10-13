const fs = require("fs");
const path = require("path");

const localesDir = path.join(
  path.dirname(require.resolve("@react-native/debugger-frontend/package.json")),
  "dist/third-party/front_end/core/i18n/locales",
);
const source = path.join(localesDir, "en-US.json");
const target = path.join(localesDir, "es-419.json");

// React Native 0.86.3 omits this Chrome-requested locale from its package.
if (!fs.existsSync(target)) {
  fs.copyFileSync(source, target);
}
