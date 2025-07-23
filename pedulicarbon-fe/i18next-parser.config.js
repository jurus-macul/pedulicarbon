module.exports = {
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
    // Exclude test files and node_modules
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!node_modules/**',
  ],
  output: './src/locales/{{lng}}/{{ns}}.json',
  locales: ['en', 'id'],
  defaultLocale: 'en',
  keepRemoved: true,
  sort: true,
  createOldCatalogs: false,
  failOnWarnings: false,
  useKeysAsDefaultValue: true,
  keySeparator: '.',
  namespaceSeparator: ':',
  contextSeparator: '_',
  pluralSeparator: '_',
  createOldCatalogs: false,
  defaultValue: '',
  resource: {
    loadPath: 'src/locales/{{lng}}/{{ns}}.json',
    savePath: 'src/locales/{{lng}}/{{ns}}.json',
    jsonIndent: 2,
    lineEnding: '\n'
  },
  context: {
    list: ['male', 'female', 'male_plural', 'female_plural']
  },
  interpolation: {
    prefix: '{{',
    suffix: '}}'
  }
}; 