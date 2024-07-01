module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        "eqeqeq": "error",  // Require the use of === and !== instead of == and !=
        "curly": "error",  // Require all multi-line blocks to use braces
        "no-eval": "error",  // Prohibit the use of the eval() function
        "no-unused-vars": "warn",  // Warn about variables that are declared but not used
        "indent": ["error", 4],  // Require indentation of 4 spaces
        "quotes": ["error", "single"],  // Require the use of single quotes
        "semi": ["error", "always"],  // Require the use of semicolons
        "no-var": "error",  // Require the use of let or const instead of var
        "prefer-const": "error"  // Suggest using const for variables that are never reassigned after declaration
    }
};
