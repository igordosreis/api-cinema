module.exports = {
    '*.{js,ts,jsx,tsx}': ['eslint --fix'],
    '**/*.ts?(x)': () => 'npm run check-types',
  }