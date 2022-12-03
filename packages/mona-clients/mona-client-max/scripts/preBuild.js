const fs = require('fs');
const path = require('path');
const { transformNgToReact } = require('@bytedance/mona-speedy');

const IGNORE_COMPONENT_NAMES = [];

function replaceImport(rawCode) {
 let code = rawCode.replace(/@byted-lynx\/react-components(\/lib\/[^"]+)?/g, '@bytedance/mona-speedy-components');
 code = `import { cssToReactStyle } from '../utils';\n` + code;
 code = code.replace(/style: customStyle/g, 'style: cssToReactStyle(customStyle)');
 return code;
}

function downgradeComponents(ignore_names) {
  const entry = path.join(__dirname, '../src/components');
  const files = fs.readdirSync(entry);
  for(let i = 0; i < files.length; i++) {
    const file = files[i];
    const dirPath = path.join(entry, file)
    if (fs.statSync(dirPath).isDirectory() || ignore_names.includes(file)) {
      const componentFilePath = path.join(dirPath, 'index.tsx');
      const sourceCode = fs.readFileSync(componentFilePath);
      const scopeId = '111';

      const code = transformNgToReact(sourceCode, {}, scopeId);
      
      const targetFilePath = path.join(dirPath, 'index.web.jsx');
      fs.writeFileSync(targetFilePath, replaceImport(code));
    }
  }
}

function writeComponentsExportsForWeb() {
   const entry = path.join(__dirname, '../src/components/index.ts');
   const sourceCode = fs.readFileSync(entry).toString();

   const code = sourceCode.replace(/from '([^']+)'/g, "from '$1/index.web'");
   const target = path.join(entry, '../index.web.ts');
   fs.writeFileSync(target, code);
}


function main() {
  // downgrade components to web
  downgradeComponents(IGNORE_COMPONENT_NAMES)
  // write components index
  writeComponentsExportsForWeb();
}

main()