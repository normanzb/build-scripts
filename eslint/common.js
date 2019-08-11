module.exports = {
    "extends": [
        "eslint:recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 9,
        "sourceType": "module"
    },
    "env": {
        "es6": true,
        "node": true,
        "commonjs": true,
        "browser": true
    },
    "rules": {
        "no-console": "off",
        "indent": ["error", 4]
    }
};