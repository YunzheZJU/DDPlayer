module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'commonjs': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:vue/essential'
    ],
    'parserOptions': {
        'ecmaVersion': 2015,
        'sourceType': 'module'
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'comma-dangle': [
            'error',
            'always-multiline'
        ],
        'no-undef': 0,
        'no-console': 0,
        'no-extra-parens': 1,
        'block-scoped-var': 1,
        'curly': 1,
        'eqeqeq': 1,
        'no-global-assign': 1,
        'no-implicit-globals': 1,
        'no-labels': 1,
        'no-multi-str': 1,
        'comma-spacing': 1,
        'comma-style': 1,
        'func-call-spacing': 1,
        'keyword-spacing': 1,
        'lines-around-comment': 1,
        'no-multiple-empty-lines': 1,
        'space-infix-ops': 1,
        'arrow-spacing': 1,
        'no-var': 0,
        'prefer-const': 1,
        'no-unsafe-negation': 1,
        'array-callback-return': 1,
        'dot-location': 1,
        'dot-notation': 1,
        'no-eval': 1,
        'no-extend-native': 1,
        'no-extra-label': 1,
        'space-before-blocks': 1,
        'space-in-parens': 1,
        'space-unary-ops': 1,
        'spaced-comment': 1,
        'arrow-body-style': 1,
        'no-restricted-imports': 1,
        'no-duplicate-imports': 1,
        'no-useless-computed-key': 1,
        'no-useless-rename': 1,
        'rest-spread-spacing': 1,
        'no-trailing-spaces': 1,
    }
};