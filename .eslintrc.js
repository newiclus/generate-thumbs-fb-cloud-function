module.exports = {
    "extends": [
      "airbnb-base"
    ],
    "env": {
        "browser": false,
        "node": true,
        "es6": true,
        "mocha": true
    },
    "plugins": [
        "import"
    ],
    "rules": {
        "max-len": "off",
        "arrow-body-style": "off",
        "no-underscore-dangle": "off",
        "consistent-return": "off",
        "no-restricted-syntax": "off",
        "class-methods-use-this": "off",
        "no-param-reassign": "off",
        "no-use-before-define": "off",
        "no-unused-expressions": "off",
        "prefer-destructuring": ["error", {
            "AssignmentExpression": {
              "array": false,
              "object": false
            }
          }],
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "functions": "never"
        }]
    }
};