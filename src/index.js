import template from '@babel/template'
import _path from 'path'
import _fs from 'fs'

const wildcardRegex = /\/\*$/
const recursiveRegex = /\/\*\*$/
const buildRequire = template(`for (let key in IMPORTED) {
  DIR_IMPORT[key === 'default' ? IMPORTED_NAME : key] = IMPORTED[key]
}`)

const toCamelCase = (name) =>
  name.replace(/([-_.]\w)/g, (_, $1) => $1[1].toUpperCase())

const toSnakeCase = (name) =>
  name.replace(/([-.A-Z])/g, (_, $1) => '_' + ($1 === '.' || $1 === '-' ? '' : $1.toLowerCase()))

const getFiles = (parent, exts = ['.js', '.es6', '.es', '.jsx'], files = [], recursive = false, path = []) => {
  let r = _fs.readdirSync(parent)

  for (let i = 0, l = r.length; i < l; i++) {
    let child = r[i]

    const {name, ext} = _path.parse(child)
    const file = path.concat(name)

    // Check extension is of one of the aboves
    if (exts.includes(ext)) {
      files.push(file)
    } else if (recursive && _fs.statSync(_path.join(parent, child)).isDirectory()) {
      getFiles(_path.join(parent, name), exts, files, recursive, file)
    }
  }

  return files
}

export default function dir (babel) {
  const { types: t } = babel

  return {
    visitor: {
      ImportDeclaration (path, state) {
        const {node} = path
        let src = node.source.value

        if (src[0] !== '.' && src[0] !== '/') { return }
        const pathPrefix = src.split('/')[0] + '/';

        const isExplicitWildcard = wildcardRegex.test(src)
        let cleanedPath = src.replace(wildcardRegex, '')

        const isRecursive = recursiveRegex.test(cleanedPath)
        cleanedPath = cleanedPath.replace(recursiveRegex, '')

        const sourcePath = this.file.opts.parserOpts.sourceFileName || this.file.opts.parserOpts.filename || ''
        const checkPath = _path.resolve(_path.join(_path.dirname(sourcePath), cleanedPath))

        try {
          require.resolve(checkPath)

          return
        } catch (e) {}

        try {
          if (!_fs.statSync(checkPath).isDirectory()) { return }
        } catch (e) { return }

        const nameTransform = state.opts.snakeCase ? toSnakeCase : toCamelCase

        const _files = getFiles(checkPath, state.opts.exts, [], isRecursive)
        const files = _files.map((file) =>
          [file, nameTransform(file[file.length - 1]), path.scope.generateUidIdentifier(file[file.length - 1])]
        )

        if (!files.length) { return }

        const imports = files.map(([file, fileName, fileUid]) =>
          t.importDeclaration(
            [t.importNamespaceSpecifier(fileUid)],
            t.stringLiteral(pathPrefix + _path.join(cleanedPath, ...file))
          )
        )

        let dirVar = path.scope.generateUidIdentifier('dirImport')
        path.insertBefore(t.variableDeclaration(
          'const', [
            t.variableDeclarator(dirVar, t.objectExpression([]))
          ]
        ))

        for (let i = node.specifiers.length - 1; i >= 0; i--) {
          let dec = node.specifiers[i]

          if (t.isImportNamespaceSpecifier(dec) || t.isImportDefaultSpecifier(dec)) {
            path.insertAfter(t.variableDeclaration(
              'const', [
                t.variableDeclarator(
                  t.identifier(dec.local.name),
                  dirVar
                )
              ]
            ))
          }

          if (t.isImportSpecifier(dec)) {
            path.insertAfter(t.variableDeclaration(
              'const', [
                t.variableDeclarator(
                  t.identifier(dec.local.name),
                  t.memberExpression(
                    dirVar,
                    t.identifier(dec.imported.name)
                  )
                )
              ]
            ))
          }
        }

        if (isExplicitWildcard) {
          files.forEach(([file, fileName, fileUid]) =>
            path.insertAfter(buildRequire({
              IMPORTED_NAME: t.stringLiteral(fileName),
              DIR_IMPORT: dirVar,
              IMPORTED: fileUid
            }))
          )
        } else {
          files.forEach(([file, fileName, fileUid]) =>
            path.insertAfter(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  dirVar,
                  t.identifier(fileName)
                ),
                fileUid
              )
            )
          )
        }

        path.replaceWithMultiple(imports)
      }
    }
  }
}
