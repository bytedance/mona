// @ts-ignore
import { ttmlToNg, transformNgToReact, transformNgCss } from '@bytedance/mona-speedy';
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import tagToComponents from './tagToComponents';
import md5 from './utils/md5';
import ConfigHelper from '../../ConfigHelper';
import { parse } from '@babel/parser';	
import traverse from '@babel/traverse';	
import { transformFromAstSync } from '@babel/core';
import * as t from '@babel/types';
// import { createUniqueId } from '../utils/utils';

const REG_RUNTIME_CMP = /^@bytedance\/mona-runtime\+\+(.+)/;
const REG_RUNTIME = /^@bytedance\/mona-runtime$/;
const RPX_VALUE_REG = /rpx$/
const ROOT_FONT_SIZE_PX = 100;
const scopeId = ''

const transformRpxToRem = (origin: string) => {
  if (RPX_VALUE_REG.test(origin)) {
    const num = Number(origin.replace(RPX_VALUE_REG, ''));
    if (!Number.isNaN(num)) {
      return `${num / ROOT_FONT_SIZE_PX / 2}rem`;
    }
  }
  return origin;
}
// 适配windows
const getSlash = () => {
  return process.platform === 'win32' ? '\\' : '/';
}

const isValidObject = (obj: any): obj is Object => {
  return typeof obj === 'object' && !Array.isArray(obj);
}
const isRelative = (pathname: string) => /^\.{1,2}\//.test(pathname);
const getPureFilePath = (filePath: string) => path.join(path.dirname(filePath), extractPureFilename(filePath));
const cookedFilepath = (pathname: string, base: string) => {
  if (path.isAbsolute(pathname)) {
    // absolute path
    return getPureFilePath(pathname)
  } else if (REG_RUNTIME_CMP.test(pathname)) {
    return pathname
  } else if (isRelative(pathname)) {
    // relative path
    return getPureFilePath(path.join(base, pathname));
  } else {
    // node_modules
    return getPureFilePath(require.resolve(pathname));
  }
}

// 获取文件名，并去除后缀
const extractPureFilename = (filename: string) => path.basename(filename).replace(/\.[^/.]+$/, "")

const safelyParseJson = (rawJSON: string) => {
  try {
    const res = JSON.parse(rawJSON);
    return isValidObject(res) ? res : {};
  } catch(err) {
    return {}
  }
}

// replace some import in jsx file	
// eg. import Image from '@bytedance/mona-service++Image' => import { Image } from '@bytedance/mona-service';
const transformJSXFile = (codeFile: string) => {	
  const sourceCode = fs.readFileSync(codeFile).toString();	
  const ast = parse(sourceCode, { plugins: ['jsx'], sourceType: 'module' });	
  const specifers: string[] = [];
  let defaultSpecifer = '';
  traverse(ast, {	
    ImportDeclaration: (path) => {	
      const { node } = path;
      // if find inner components, remove the import declartion and store the compoent value to import all later on the top of code.
      if (REG_RUNTIME_CMP.test(node.source.value)) {
        const componentName = REG_RUNTIME_CMP.exec(node.source.value)?.[1];
        if (componentName) {
          specifers.push(componentName)
        }
        path.remove();
      } else if (REG_RUNTIME.test(node.source.value)) {
        // extract all import from @bytedance/mona-runtime
        node.specifiers.forEach(s => {
          if (t.isImportDefaultSpecifier(s)) {
            defaultSpecifer = (s as t.ImportDefaultSpecifier).local.name;
          } else if (t.isImportSpecifier(s)) {
            specifers.push((s as t.ImportSpecifier).local.name)
          }
        })
        path.remove();
      }
    }	
  })

  const res = transformFromAstSync(ast)	
  if (res?.code) {
    const s1 = defaultSpecifer ? defaultSpecifer : '';
    const s2 = specifers.length > 0 ? `{${specifers.join(', ')}}` : '';
    const s3 = [s1, s2].filter(v => !!v).join(' , ');
    const code = (s3 ? `import ${s3} from '@bytedance/mona-runtime';\n` : '') + res?.code ?? '';
    fs.writeFileSync(codeFile, code);	
  }	
}

interface ComponentInfo {
  entry: string;
  isTTML: boolean;
  target: string;
}

type IMap = { [key: string]: string };
function mapComponentToMaxRuntime(obj: IMap) {
  const result: IMap = {};
  Object.keys(obj).forEach(key => {
    result[key] = `@bytedance/mona-runtime++${obj[key]}`
  })

  return result;
}

const innerComponents = mapComponentToMaxRuntime(tagToComponents)

const handleAllComponents = ({ entry, tempDir, componentMap }: { entry: string; tempDir: string; componentMap: Map<string, ComponentInfo> }) => {
  const filename = extractPureFilename(entry);
  const jsonPath = path.resolve(entry, `../${filename}.json`)
  const ttmlPath= path.resolve(entry, `../${filename}.ttml`)
  const isTTML = fs.existsSync(ttmlPath);
  const sourceInfo: ComponentInfo = { entry, isTTML, target: entry };
  if (isTTML && fs.existsSync(jsonPath)) {
    // copy ttml dir to tmp
    const sourceDir = path.dirname(entry)
    const t = sourceDir.split(getSlash())
    const componentName = `${t[t.length - 1]}-${md5(sourceDir)}`;
    const distDir = path.join(tempDir, componentName);
    if (!fse.existsSync(distDir)) {
      fse.mkdirSync(distDir)
    }
    fse.copySync(sourceDir, distDir);

    const tmpJsonPath = path.join(distDir, `${filename}.json`);
    sourceInfo.target = `../${componentName}/${filename}`;

    // modify json to append innerComponents
    const rawJSON = fs.readFileSync(tmpJsonPath).toString();
    const json = safelyParseJson(rawJSON);
    let usingComponents = json.usingComponents;
    if (isValidObject(usingComponents)) {
      usingComponents = {...usingComponents, ...innerComponents}
    } else {
      usingComponents = {...innerComponents}
    }
    json.usingComponents = {};

    // recursive search and store
    Object.keys(usingComponents).forEach(key => {
      const rawFilePath = usingComponents[key];
      // absolut path or relative path or node_modules
      const filePath = cookedFilepath(rawFilePath, path.dirname(entry));
      const componentSourceInfo = handleAllComponents({ entry: filePath, tempDir, componentMap });
      if (componentSourceInfo.isTTML) {
        // modify json to rewrite json
        json.usingComponents[key] = componentSourceInfo.target;
      } else {
        json.usingComponents[key] = componentSourceInfo.entry
      }
    })

    // rewrite json
    fs.writeFileSync(tmpJsonPath, JSON.stringify(json))
  }
  componentMap.set(sourceInfo.target, sourceInfo)
  return sourceInfo;
}


function replaceImport(code: string) {
  return code.replace(/@byted-lynx\/react-components(\/lib\/[^"]+)?/g, '@bytedance/mona-speedy-components');
}

const appendWebSuffix = (pathname: string, suffix: string) => `${pathname.replace(suffix, '')}.web${suffix}`
const transformWebCode = (codeFile: string, targetPathes: string[] = []) => {	
  // find the components of current file
  let componentPathes = targetPathes;
  const ttmlJsonPath = codeFile.replace('.maxTmpReact', '.maxTmpTtml').replace(/\.web\.jsx$/, '.json');
  if (fs.existsSync(ttmlJsonPath)) {
    const rawJSON = fs.readFileSync(ttmlJsonPath).toString()
    const json = safelyParseJson(rawJSON);
    let usingComponents = {};
    if (isValidObject(json)) {
      usingComponents = json.usingComponents;
    }
    componentPathes = [...componentPathes, ...Object.values(usingComponents) as string[]];
  }

  const sourceCode = fs.readFileSync(codeFile).toString();	
  const ast = parse(sourceCode, { plugins: ['jsx'], sourceType: 'module' });	
  traverse(ast, {	
    ImportDeclaration: (_path) => {	
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
    CallExpression: (_path) => {
      const { node } = _path;
      if (t.isMemberExpression(node.callee)) {
        if (t.isIdentifier(node.callee.object) && t.isIdentifier(node.callee.property) && t.isIdentifier(node.arguments[0]) && t.isObjectExpression(node.arguments[1])) {
          const isReactComponent = node.callee.object.name === 'React' && node.callee.property.name === 'createElement';
          const isInnerComponentReactCall = isReactComponent && Object.values(tagToComponents).includes(node.arguments[0].name)
          if (isReactComponent) {
            const args = node.arguments[1].properties;
            args.forEach((arg) => {
              if (t.isObjectProperty(arg) && t.isIdentifier(arg.key)) {
                if (arg.key.name === 'style') {
                  if (isInnerComponentReactCall) {
                    arg.key.name = 'customStyle'
                  }
                  // transform rpx to rem
                  if (t.isObjectExpression(arg.value)) {
                    arg.value.properties.forEach((s) => {
                      if (t.isObjectProperty(s) && t.isStringLiteral(s.value)) {
                        s.value.value = transformRpxToRem(s.value.value)
                      }
                    })
                  }
                } else if (arg.key.name === 'className') {
                  if (isInnerComponentReactCall) {
                    arg.key.name = 'customClass'
                  }
                }
              }
            })
          }
        }
      }
    }
  })

  const res = transformFromAstSync(ast)	
  const code = res?.code ?? '';
  if (code) {
    fs.writeFileSync(codeFile, code);	
  }	
}

export function transformToWeb(sourceDir: string, rawFilename: string, targetPathes: string[] = []) {
  const filename = rawFilename.replace(path.extname(rawFilename), '');

  // code
  const entry = path.join(sourceDir, `${filename}.jsx`);
  if (fs.existsSync(entry)) {
    const sourceCode = fs.readFileSync(entry).toString();
    const code = transformNgToReact(sourceCode, {}, scopeId);
    const targetFilePath = path.join(sourceDir, `${filename}.web.jsx`);
    fs.writeFileSync(targetFilePath, replaceImport(code));
    transformWebCode(targetFilePath, targetPathes);
  }

  // style
  const styleEntry = path.join(sourceDir, `${filename}.less`);
  if (fs.existsSync(styleEntry)) {
    const styleCode = fs.readFileSync(styleEntry).toString();
    const code = transformNgCss(styleCode, {}, scopeId);
    const targetStyleFilePath = path.join(sourceDir, `${filename}.web.less`);
    fs.writeFileSync(targetStyleFilePath, code)
  }
}

const transformTtmlDir = (sourceDir: string, filename: string, distDir: string) => {
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
  const ttssSrcFilePath = path.resolve(sourceDir, `index.ttss`);
  const ttssDistDirFilePath = path.resolve(distDir, `${filename}.less`);
  if (fs.existsSync(ttssSrcFilePath)) {
    fs.copyFileSync(ttssSrcFilePath, ttssDistDirFilePath);
  }

  // replace some runtime in reactLynx	
  const codeFile = path.join(distDir, `${filename}.jsx`);	
  transformJSXFile(codeFile)
};

export const ttmlToReactLynx = (tempReactLynxDir: string, configHelper: ConfigHelper) => {
  // create ttml tmp dir
  const tempTTMLDir = path.join(tempReactLynxDir, '../.maxTmpTtml');
  if (fse.existsSync(tempReactLynxDir)) {
    fse.removeSync(tempReactLynxDir);
  }
  if (fse.existsSync(tempTTMLDir)) {
    fse.removeSync(tempTTMLDir);
  }
  fse.mkdirSync(tempReactLynxDir)
  fse.mkdirSync(tempTTMLDir)

  const componentMap = new Map<string, ComponentInfo>();
  // handle all ttml components
  const entryInfo = handleAllComponents({ entry: configHelper.entryPath, tempDir: tempTTMLDir, componentMap: componentMap });

  // iterate all components
  componentMap.forEach(v => {
    if (v.isTTML) {
      const absolutePath = path.join(tempTTMLDir, 'foo', v.target);
      const sourceDir = path.dirname(absolutePath);
      const distDir = path.join(tempReactLynxDir, 'foo', v.target, '..');
      const filename = path.basename(absolutePath);
      transformTtmlDir(sourceDir, filename, distDir);
      transformToWeb(distDir, filename);
    }
  })

  // transform ../ to ./
  const entry = entryInfo.target.replace(/^\./, '');
  // write entry

  return `${entry}`;
};

