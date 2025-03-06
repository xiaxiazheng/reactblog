module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "plugin:react/recommended",
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  "rules": {
    // 关闭检测未使用的变量
    'no-unused-vars': 'off',
    // 暂时关闭掉ts对未使用到的变量的warn，到时可以用脚本批量去注释掉
    '@typescript-eslint/no-unused-vars': ['off'],
    "react/prop-types": "off"
  }
};
