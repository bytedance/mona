import { PluginObj } from '@babel/core';
import type * as BabelCoreNamespace from '@babel/core';
import path from 'path';
import fs from 'fs';

type Babel = typeof BabelCoreNamespace;

const aliasReg = /([^/]*)/;

function exist(filename: string) {
  return fs.existsSync(filename) || fs.existsSync(`${filename}.js`) || fs.existsSync(`${filename}.ts`) || fs.existsSync(`${filename}.jsx`) || fs.existsSync(`${filename}.tsx`) || fs.existsSync(`${filename}.json`)
}

function isDir(rawFilename: string) {
  return fs.lstatSync(rawFilename).isDirectory()
}

export function getRawFileName(context: string, sourceFilename: string, alias: {[key: string]: string} = {}) {
  const regResult = sourceFilename.match(aliasReg);
  const aliasValue = regResult ? alias[regResult[0] as string] : null;
  if (aliasValue) {
    sourceFilename = sourceFilename.replace(aliasReg, aliasValue);
  }

  let rawFilename = path.isAbsolute(sourceFilename) ? sourceFilename : path.join(context, '..', sourceFilename);
  if (!exist(rawFilename)) {
    return null
  }
  if (isDir(rawFilename)) {
    rawFilename += '/index';
  }
  return rawFilename
}

export function appendTargetSuffix(rawFilename: string, target: string): string {
  let dotIndex = rawFilename.lastIndexOf('.')
  dotIndex = dotIndex === -1 ? rawFilename.length : dotIndex;

  const filename = rawFilename.substring(0, dotIndex) + `.${target}` + rawFilename.substring(dotIndex);
  return filename;
}

export function generateNewFileName(context: string, sourceFilename: string, target: string, alias: {[key: string]: string} = {}) {
  let rawFilename = getRawFileName(context, sourceFilename, alias);
  if(rawFilename) {
    let filename = appendTargetSuffix(rawFilename, target);

    if (exist(filename)) {
      const relativePath = path.relative(path.join(context, '..'), filename);
      return /^\./.test(relativePath) ? relativePath : `./${relativePath}`
    }
  }
  return null
}

export type Options = { target: string, context: string, alias?: {[key: string]: string} };

export default function BabelPluginMultiTarget({ types }: Babel): PluginObj<{ opts: Options }> {
  return {
    visitor: {
      ImportDeclaration(nodePath, { opts = {} }) {
        const { target = 'web', context: ctx, alias } = opts;
        const { node } = nodePath;
        // do nothing if no target or node
        if (!node || !target || (nodePath as any).handled) {
          return
        }

        const context = (this as any).file.opts.filename || '';
        if (/node_modules/.test(context) || context.indexOf(ctx) === -1) {
          return
        }

        const { source, specifiers } = node;
        
        const filename = generateNewFileName(context, source.value, target, alias);
        if (!filename) {
          return;
        }
        const declaration = types.importDeclaration(specifiers, types.stringLiteral(filename));
        nodePath.replaceWith(declaration);
        (nodePath as any).handled = true;
      }
    }
  }
}