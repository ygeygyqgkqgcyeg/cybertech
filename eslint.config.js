const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');

// The native resolver used by eslint-plugin-import fails to load on this
// Windows machine, and tsc already checks imports, so the import/* rules are off.
const importRulesOff = {};
for (const config of expo) {
  for (const rule of Object.keys(config.rules ?? {})) {
    if (rule.startsWith('import/')) importRulesOff[rule] = 'off';
  }
}

module.exports = defineConfig([expo, { ignores: ['dist/*', 'src/generated/*'] }, { rules: importRulesOff }]);
