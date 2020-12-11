import { parse } from '@babel/parser'
import generate from '@babel/generator'
import traverse, { NodePath } from '@babel/traverse'
import {
  jsxAttribute,
  jsxIdentifier,
  stringLiteral
} from '@babel/types'

const doJSXIdentifierName = (name) => {
  if (name.name.endsWith('Fragment')) {
    return { stop: true }
  }
  return { stop: false }
}

const doJSXMemberExpressionName = (name) => {
  return doJSXIdentifierName(name.property)
}

const doJSXNamespacedNameName = (name) => {
  return doJSXIdentifierName(name.name)
}

const doJSXPathName = (name) => {
  const dealMap = {
    JSXIdentifier: doJSXIdentifierName,
    JSXMemberExpression: doJSXMemberExpressionName,
    JSXNamespacedName: doJSXNamespacedNameName,
  }

  return dealMap[name.type](name)
}

const doJSXOpeningElement = (node, option) => {
  const { stop } = doJSXPathName(node.name)
  if (stop) return { stop }

  const { relativePath } = option

  // 写入组件所在的相对路径
  const relativePathAttr = jsxAttribute(
    jsxIdentifier('data-inspector-relative-path'),
    stringLiteral(relativePath),
  )

  // 在元素上增加这几个属性
  node.attributes.push(relativePathAttr)

  return { result: node }
}

export function addOpenLoader(
  this,
  source
) {
  const { rootContext: rootPath, resourcePath: filePath } = this;

  const relativePath = filePath.slice(rootPath.length + 1)

  const ast = parse(source);

  traverse(ast, {
    enter(path) {
      if (path.type === "JSXOpeningElement") {
        doJSXOpeningElement(path.node, { relativePath });
      }
    },
  });

  const { code } = generate(ast);

  return code
}

module.exports = addOpenLoader