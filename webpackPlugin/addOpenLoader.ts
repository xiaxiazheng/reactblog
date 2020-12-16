// import { getOptions } from 'loader-utils'
const { parse } = require('@babel/parser')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const {
  jsxAttribute,
  jsxIdentifier,
  stringLiteral,
  // Node,
  // JSXOpeningElement,
  // JSXIdentifier,
  // JSXMemberExpression,
  // JSXNamespacedName,
  // JSXAttribute,
} = require('@babel/types')

const doJSXIdentifierName = (name) => {
  if (name.name.endsWith("Fragment")) {
    return { stop: true };
  }
  return { stop: false };
};

const doJSXMemberExpressionName = (name) => {
  return doJSXIdentifierName(name.property);
};

const doJSXNamespacedNameName = (name) => {
  return doJSXIdentifierName(name.name);
};

const doJSXPathName = (name) => {
  const dealMap = {
    JSXIdentifier: doJSXIdentifierName,
    JSXMemberExpression: doJSXMemberExpressionName,
    JSXNamespacedName: doJSXNamespacedNameName,
  };

  return dealMap[name.type](name);
};

const doJSXOpeningElement = (node, option) => {
  const { stop } = doJSXPathName(node.name);
  if (stop) return { stop };

  const { relativePath } = option;

  // 写入组件所在的相对路径
  const relativePathAttr = jsxAttribute(
    jsxIdentifier("data-inspector-relative-path"),
    stringLiteral(relativePath)
  );

  // 在元素上增加这几个属性
  node.attributes.push(relativePathAttr);

  return { result: node };
};

// 自定义 loader
function addOpenLoader(codes) {
  const { rootContext: rootPath, resourcePath: filePath } = this;

  const relativePath = filePath.slice(rootPath.length + 1);

  // 将字符串代码生成为 AST
  const ast = parse(codes, {
    sourceType: 'module',
    allowUndeclaredExports: true,
    allowImportExportEverywhere: true,
    plugins: [
      'typescript',
      'jsx',
      'decorators-legacy',
      'classProperties'
    ]
  })

  // 遍历 AST 执行操作
  traverse(ast, {
    enter(path) {
      if (path.type === "JSXOpeningElement") {
        doJSXOpeningElement(path.node, { relativePath });
      }
    },
  });

  // 将 AST 生成回字符串代码
  const { code } = generate(ast, {
    decoratorsBeforeExport: true
  });

  return code;
}

module.exports = addOpenLoader
