const ESLINT = {
  ERROR: 2,
  WARN: 1,
  IGNORE: 0,
};

module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'eslint-config-airbnb-typescript',
    'eslint-config-airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.js', 'craco.config.js'],
  plugins: ['react', '@typescript-eslint', 'prettier'],
  overrides: [
    // '*' is missing in props validation
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
  rules: {
    'react/require-default-props': 'off',
    // * should be listed in the project's dependencies, not devDependencies
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    // Visible, non-interactive elements with click handlers must have at least one keyboard listener
    'jsx-a11y/click-events-have-key-events': ESLINT.IGNORE,
    // A control must be associated with a text label
    'jsx-a11y/control-has-associated-label': ESLINT.IGNORE,
    // Elements with the 'button' interactive role must be focusable
    'jsx-a11y/interactive-supports-focus': ESLINT.IGNORE,
    // Media elements such as <audio> and <video> must have a <track> for captions
    'jsx-a11y/media-has-caption': ESLINT.IGNORE,
    // Expected linebreaks to be 'CRLF' but found 'LF'
    'linebreak-style': 'off',
    // Unexpected console statement  no-console
    'no-console': 'warn',
    // Assignment to function parameter '*'
    'no-param-reassign': ESLINT.IGNORE,
    // Arrow function should not return assignment.
    'no-return-assign': ESLINT.IGNORE,
    // Runs Prettier as an ESLint rule and reports differences as individual ESLint issues.
    'prettier/prettier': 'error',
    // Prop spreading is forbidden
    'react/jsx-props-no-spreading': [ESLINT.ERROR, { custom: 'ignore' }],
  },
};
