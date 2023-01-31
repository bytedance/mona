// @ts-ignore
import { ttmlToNg, transformNgToReact, transformNgCss } from '@bytedance/mona-speedy';
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import tagToComponents from './tagToComponents';
import { ConfigHelper } from '@bytedance/mona-manager';
import { parse, parseExpression } from '@babel/parser';
import traverse from '@babel/traverse';
import { transformFromAstSync } from '@babel/core';
import * as t from '@babel/types';
const { uniqueHash } = require('./utils/constants');

const REG_RUNTIME_CMP = /^@bytedance\/mona-runtime\+\+(.+)/;
const REG_RUNTIME = /^@bytedance\/mona-runtime$/;
const scopeId = '';

const mkDir = (dirpath: string) => {
  if (!fse.existsSync(dirpath)) {
    fse.mkdirSync(dirpath);
  }
};
const deleteFile = (filepath: string) => {
  if (fse.existsSync(filepath)) {
    fse.unlink(filepath);
  }
};

const isValidObject = (obj: any): obj is Object => {
  return typeof obj === 'object' && !Array.isArray(obj);
};
const isRelative = (pathname: string) => /^\.{1,2}\//.test(pathname);
const getPureFilePath = (filePath: string) => path.join(path.dirname(filePath), extractPureFilename(filePath));
const cookedFilepath = (pathname: string, base: string) => {
  if (path.isAbsolute(pathname)) {
    // absolute path
    return getPureFilePath(pathname);
  } else if (REG_RUNTIME_CMP.test(pathname)) {
    return pathname;
  } else if (isRelative(pathname)) {
    // relative path
    return getPureFilePath(path.join(base, pathname));
  } else {
    // node_modules
    return getPureFilePath(require.resolve(pathname));
  }
};

// 获取文件名，并去除后缀
const extractPureFilename = (filename: string) => path.basename(filename).replace(/\.[^/.]+$/, '');

const safelyParseJson = (rawJSON: string) => {
  try {
    const res = JSON.parse(rawJSON);
    return isValidObject(res) ? res : {};
  } catch (err) {
    return {};
  }
};

const getLifeCycleCodeAST = () => {
  const code = `
    if (typeof this.getJSModule === 'function') {
      const __mona_module_key = this.props.__mona_module_key;
      this.getJSModule('GlobalEventEmitter').addListener(
        '__ed_viewer_event__',
        (e) => {
          const { key, isFirst, type } = e || {};

          if (__mona_module_key !== key) {
            return;
          }

          if (type === 'appear' && typeof this.visible === 'function') {
            this.visible({ isFirst })
          }
          if (type === 'disappear' && typeof this.invisible === 'function') {
            this.invisible({ isFirst })
          }
        },
      );
    }
   `;
  const tree = parse(code, { sourceType: 'module' });
  return tree.program.body;
};

const createInnerComponentDetaultStyleNode = () => {
  // style="overflow: visible";
  const ast = parseExpression(`<div style={{overflow: 'visible'}} />`, { plugins: ['jsx'], sourceType: 'module' });
  const node =
    t.isJSXElement(ast) &&
    t.isJSXOpeningElement(ast.openingElement) &&
    t.isJSXAttribute(ast.openingElement.attributes[0])
      ? ast.openingElement.attributes[0]
      : null;
  return node;
};

// replace some import in jsx file
// eg. import Image from '@bytedance/mona-service++Image' => import { Image } from '@bytedance/mona-service';
const transformJSXFile = (codeFile: string, addLifeCycle = false) => {
  const sourceCode = fs.readFileSync(codeFile).toString();
  const ast = parse(sourceCode, { plugins: ['jsx'], sourceType: 'module' });
  const specifers: string[] = [];
  let defaultSpecifer = '';
  traverse(ast, {
    ImportDeclaration: path => {
      const { node } = path;
      // if find inner components, remove the import declartion and store the compoent value to import all later on the top of code.
      if (REG_RUNTIME_CMP.test(node.source.value)) {
        const componentName = REG_RUNTIME_CMP.exec(node.source.value)?.[1];
        if (componentName) {
          specifers.push(componentName);
        }
        path.remove();
      } else if (REG_RUNTIME.test(node.source.value)) {
        // extract all import from @bytedance/mona-runtime
        node.specifiers.forEach(s => {
          if (t.isImportDefaultSpecifier(s)) {
            defaultSpecifer = (s as t.ImportDefaultSpecifier).local.name;
          } else if (t.isImportSpecifier(s)) {
            specifers.push((s as t.ImportSpecifier).local.name);
          }
        });
        path.remove();
      }
    },
    // transform style => customStyle, className => customClassName
    JSXElement: path => {
      const { node } = path;
      if (
        t.isJSXElement(node) &&
        t.isJSXOpeningElement(node.openingElement) &&
        t.isJSXIdentifier(node.openingElement.name)
      ) {
        const name = node.openingElement.name.name;
        const attrs = node.openingElement.attributes;
        const isInnerComponentReactCall = Object.values(tagToComponents).includes(name);

        attrs.forEach(attr => {
          if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
            const attrName = attr.name.name;
            if (attrName === 'key') {
              // process key->lynxKey
              attr.name.name = 'lynxKey';
            }
          }
        });
        if (isInnerComponentReactCall) {
          attrs.forEach(attr => {
            if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
              const attrName = attr.name.name;
              if (attrName === 'style') {
                attr.name.name = 'customStyle';
              } else if (attrName === 'className') {
                attr.name.name = 'customClass';
              }
            }
          });
          const commonNode = createInnerComponentDetaultStyleNode();
          if (commonNode) {
            attrs.push(commonNode);
          }
        }
      }
    },
    ClassMethod: path => {
      if (addLifeCycle) {
        const { node } = path;
        if (t.isIdentifier(node.key) && node.key.name === 'componentDidMount') {
          const astList = getLifeCycleCodeAST();
          node.body.body.push(...astList);
        }
      }
    },
  });

  const res = transformFromAstSync(ast);
  if (res?.code) {
    const s1 = defaultSpecifer ? defaultSpecifer : '';
    const s2 = specifers.length > 0 ? `{${specifers.join(', ')}}` : '';
    const s3 = [s1, s2].filter(v => !!v).join(' , ');
    const code = (s3 ? `import ${s3} from '@bytedance/mona-runtime';\n` : '') + res?.code ?? '';
    fs.writeFileSync(codeFile, code);
  }
};

interface ComponentInfo {
  entry: string;
  isTTML: boolean;
  isEntryComponent: boolean;
}

type IMap = { [key: string]: string };
function mapComponentToMaxRuntime(obj: IMap) {
  const result: IMap = {};
  Object.keys(obj).forEach(key => {
    result[key] = `@bytedance/mona-runtime++${obj[key]}`;
  });

  return result;
}

const innerComponents = mapComponentToMaxRuntime(tagToComponents);

const handleAllComponents = ({
  entry,
  componentMap,
  isEntryComponent = false,
}: {
  entry: string;
  componentMap: Map<string, ComponentInfo>;
  isEntryComponent?: boolean;
}) => {
  if (componentMap.has(entry)) {
    return componentMap.get(entry) as ComponentInfo;
  }
  const filename = extractPureFilename(entry);
  const jsonPath = path.resolve(entry, `../${filename}.json`);
  const ttmlPath = path.resolve(entry, `../${filename}.ttml`);
  const isTTML = fs.existsSync(ttmlPath);
  const sourceInfo: ComponentInfo = { entry, isTTML, isEntryComponent };
  componentMap.set(entry, sourceInfo);

  if (isTTML && fs.existsSync(jsonPath)) {
    // copy ttml dir to tmp
    // const sourceDir = path.dirname(entry)
    // const t = sourceDir.split(getSlash())
    // const componentName = `${t[t.length - 1]}-${md5(sourceDir)}`;
    // const distDir = path.join(tempDir, componentName);
    // mkDir(distDir)
    // fse.copySync(sourceDir, distDir);

    // const tmpJsonPath = path.join(distDir, `${filename}.json`);
    // sourceInfo.target = `../${componentName}/${filename}`;

    // modify json to append innerComponents
    const rawJSON = fs.readFileSync(jsonPath).toString();
    const json = safelyParseJson(rawJSON);
    let usingComponents = json.usingComponents;
    if (isValidObject(usingComponents)) {
      usingComponents = { ...usingComponents, ...innerComponents };
    } else {
      usingComponents = { ...innerComponents };
    }
    json.usingComponents = {};

    // recursive search and store
    Object.keys(usingComponents).forEach(key => {
      const rawFilePath = usingComponents[key];
      // absolut path or relative path or node_modules
      const filePath = cookedFilepath(rawFilePath, path.dirname(entry));
      handleAllComponents({ entry: filePath, componentMap });
      json.usingComponents[key] = rawFilePath;
    });

    // rewrite json
    fs.writeFileSync(jsonPath, JSON.stringify(json));
  }
  return sourceInfo;
};

function replaceImport(code: string) {
  return code.replace(/@byted-lynx\/react-components(\/lib\/[^"]+)?/g, '@bytedance/mona-speedy-components');
}

const appendWebSuffix = (pathname: string, suffix: string) => `${pathname.replace(suffix, '')}.web${suffix}`;
const transformWebCode = (codeFile: string, targetPathes: string[] = [], isEntryComponent: boolean) => {
  // find the components of current file
  let componentPathes = targetPathes;
  const ttmlJsonPath = codeFile.replace(/\.web\.jsx$/, '.json');
  if (fs.existsSync(ttmlJsonPath)) {
    const rawJSON = fs.readFileSync(ttmlJsonPath).toString();
    const json = safelyParseJson(rawJSON);
    let usingComponents = {};
    if (isValidObject(json)) {
      usingComponents = json.usingComponents;
    }
    componentPathes = [...componentPathes, ...(Object.values(usingComponents) as string[])];
  }

  const sourceCode = fs.readFileSync(codeFile).toString();
  const ast = parse(sourceCode, { plugins: ['jsx'], sourceType: 'module' });
  traverse(ast, {
    ImportDeclaration: _path => {
      const { node } = _path;
      // 如果是相对路径，并且是组件路径或less文件则加入.web后缀
      const sourcePath = node.source.value;
      const suffix = path.extname(sourcePath);
      if (isRelative(sourcePath) && (componentPathes.includes(sourcePath) || suffix === '.less')) {
        node.source.value = appendWebSuffix(sourcePath, suffix);
      }
    },
    // replace inner component' style/class => customStyle/customClass
    // and transform inline style rpx to rem
    CallExpression: _path => {
      const { node } = _path;
      if (t.isMemberExpression(node.callee)) {
        if (
          t.isIdentifier(node.callee.object) &&
          t.isIdentifier(node.callee.property) &&
          t.isIdentifier(node.arguments[0]) &&
          t.isObjectExpression(node.arguments[1])
        ) {
          const isReactComponent = node.callee.object.name === 'React' && node.callee.property.name === 'createElement';

          const isInnerComponentReactCall =
            isReactComponent && Object.values(tagToComponents).includes(node.arguments[0].name);
          if (isReactComponent) {
            const args = node.arguments[1].properties;
            for (let i = 0; i < args.length; i++) {
              const arg = args[i];
              if (t.isObjectProperty(arg) && t.isIdentifier(arg.key)) {
                // lynxKey->key
                if (
                  arg.key.name === 'monaMaxModule' &&
                  t.isStringLiteral(arg.value) &&
                  arg.value.value === 'mona-max-outer-view'
                ) {
                  break;
                } else if (arg.key.name === 'lynxKey') {
                  arg.key.name = 'key';
                } else if (
                  (isInnerComponentReactCall && arg.key.name === 'customClass') ||
                  arg.key.name === 'className'
                ) {
                  // className/customClass->with hash class
                  const _source = sourceCode.slice(arg.value.start ?? 0, arg.value.end ?? 0);
                  const _code = `_transformWebClass(${_source},"${uniqueHash}")`;
                  const result = parseExpression(_code);
                  arg.value = t.isCallExpression(result) ? result : arg.value;
                }
                // process style
                else if (
                  t.isObjectExpression(arg.value) &&
                  ((isInnerComponentReactCall && arg.key.name === 'customStyle') || arg.key.name === 'style')
                ) {
                  const _source = sourceCode.slice(arg.value.start ?? 0, arg.value.end ?? 0);
                  const _code = `_transformWebStyle(${_source})`;
                  const result = parseExpression(_code);
                  arg.value = t.isCallExpression(result) ? result : arg.value;
                }
              }
            }
          }
        }
      }
    },
    ClassMethod: _path => {
      const { node } = _path;
      if (
        t.isIdentifier(node.key) &&
        (node.key.name === '_lynxComponentCreated' || node.key.name === '_lynxComponentAttached')
      ) {
        const startCode1 = 'const oldSetState=this.setState;';
        const startCode2 = 'this.setState=(state,callback)=>{Object.assign(this.state,state);callback&&callback()}';
        const endCode = 'this.setState=oldSetState';
        node.body.body.unshift(
          parse(startCode1) as unknown as t.VariableDeclaration,
          parseExpression(startCode2) as unknown as t.ExpressionStatement,
        );
        const endCodeExpression = parseExpression(endCode) as unknown as t.ExpressionStatement;
        const bodyLength = node.body.body.length;
        if (t.isReturnStatement(node.body.body[bodyLength - 1])) {
          node.body.body.splice(bodyLength - 1, 0, endCodeExpression);
        } else {
          node.body.body.push(endCodeExpression);
        }
      } else if (t.isIdentifier(node.key) && node.key.name === 'render') {
        node.body.body.forEach(item => {
          if (t.isReturnStatement(item)) {
            let newExpression;
            if (isEntryComponent) {
              newExpression = parseExpression(
                `React.createElement(View, {
                    monaMaxModule: "mona-max-outer-view",
                    className: _transformWebClass(this.props.className,"${uniqueHash}"),
                    style: {...{overflow:"hidden"},..._transformWebStyle(this.props.style)}               
              })`,
              ) as t.CallExpression;
            } else {
              newExpression = parseExpression(
                `React.createElement(View, {
                    monaMaxModule: "mona-max-outer-view",
                    className: this.props.className,
                    style: {...{overflow:"hidden"},...this.props.style}               
              })`,
              ) as t.CallExpression;
            }
            newExpression.arguments.push(item.argument as t.CallExpression);
            item.argument = newExpression;
          }
        });
      }
    },
  });

  const res = transformFromAstSync(ast);
  let code = res?.code ?? '';
  if (code) {
    let importViewReg = /import\s*\{\s*View\s*\}\s*from\s*"@bytedance\/mona-speedy-components"\s*;?/;
    const hasImportView = importViewReg.test(code);
    // transform style rpx to rem
    if (hasImportView) {
      code = `import { _transformWebStyle,_transformWebClass } from '@bytedance/mona-shared';\n` + code;
    } else {
      code =
        `import { _transformWebStyle,_transformWebClass } from '@bytedance/mona-shared';\nimport { View } from "@bytedance/mona-speedy-components";\n` +
        code;
    }
    fs.writeFileSync(codeFile, code);
  }
};

export function transformToWeb(
  sourceDir: string,
  rawFilename: string,
  targetPathes: string[] = [],
  isEntryComponent: boolean,
) {
  const filename = rawFilename.replace(path.extname(rawFilename), '');

  // code
  const entry = path.join(sourceDir, `${filename}.jsx`);
  if (fs.existsSync(entry)) {
    const sourceCode = fs.readFileSync(entry).toString();
    const code = transformNgToReact(sourceCode, {}, scopeId);
    const targetFilePath = path.join(sourceDir, `${filename}.web.jsx`);
    fs.writeFileSync(targetFilePath, replaceImport(code));
    transformWebCode(targetFilePath, targetPathes, isEntryComponent);
  }

  // style
  const styleEntry = path.join(sourceDir, `${filename}.less`);
  if (fs.existsSync(styleEntry)) {
    const styleCode = fs.readFileSync(styleEntry).toString();
    const code = transformNgCss(styleCode, {}, scopeId);
    const targetStyleFilePath = path.join(sourceDir, `${filename}.web.less`);
    fs.writeFileSync(targetStyleFilePath, code);
  }
}

const transformTtmlDir = (sourceDir: string, filename: string, distDir: string, addLifeCycle = false) => {
  ttmlToNg.transformFile(
    {
      baseDir: sourceDir,
      filename,
      //   componentName: `arco-${name}`,
      distDir: distDir,
      distName: `${filename}.jsx`,
      options: {
        inlineLepus: true,
        reactRuntimeImportDeclaration: 'import ReactLynx, { Component } from "@bytedance/mona-speedy-runtime"',
        importCssPath: `./${filename}.less`,
        // componentPathRewrite(name: string, path: string) {
        //   // arco-icon @byted-lynx/ui/components/icon/icon
        //   console.log('name---', name, path)
        //   return path;
        // },
      },
    },
    true,
  );

  //复制ttss->scss
  const ttssSrcFilePath = path.resolve(sourceDir, `${filename}.ttss`);
  const ttssDistDirFilePath = path.resolve(distDir, `${filename}.less`);
  if (fs.existsSync(ttssSrcFilePath)) {
    fs.copyFileSync(ttssSrcFilePath, ttssDistDirFilePath);
  }

  // replace some runtime in reactLynx
  const codeFile = path.join(distDir, `${filename}.jsx`);
  transformJSXFile(codeFile, addLifeCycle);
};

export const ttmlToReactLynx = (tempTTMLDir: string, configHelper: ConfigHelper) => {
  // create ttml tmp dir
  // TODO this is some bug in windows, fix this later
  // if (fse.existsSync(tempReactLynxDir)) {
  //   fse.removeSync(tempReactLynxDir);
  // }
  // if (fse.existsSync(tempTTMLDir)) {
  //   fse.removeSync(tempTTMLDir);
  // }
  // mkDir(tempReactLynxDir);
  mkDir(tempTTMLDir);

  // copy all html to temp dir
  const originSourcePath = path.join(process.cwd(), 'src');
  fse.copySync(originSourcePath, tempTTMLDir);
  const tempEntryPath = configHelper.entryPath.replace(originSourcePath, tempTTMLDir).replace(/\.[^/.]+$/, '');

  const componentMap = new Map<string, ComponentInfo>();
  // handle all ttml components
  const entryInfo = handleAllComponents({ entry: tempEntryPath, componentMap: componentMap, isEntryComponent: true });
  // iterate all components
  componentMap.forEach(v => {
    if (v.isTTML) {
      const absolutePath = v.entry;
      const sourceDir = path.dirname(absolutePath);
      const filename = extractPureFilename(absolutePath);
      // add lifeCycle for entry component
      transformTtmlDir(sourceDir, filename, sourceDir, entryInfo.isEntryComponent);
      transformToWeb(sourceDir, filename, [], v.isEntryComponent);
      // delete all origin file
      deleteFile(path.join(sourceDir, `${filename}.js`));
      deleteFile(path.join(sourceDir, `${filename}.ttml`));
      deleteFile(path.join(sourceDir, `${filename}.ttss`));
    }
  });
  const entry = `./${path.relative(tempTTMLDir, entryInfo.entry)}`.replace(/\.js$/, '').replace(/\\/g, '/');
  return entry;
};
