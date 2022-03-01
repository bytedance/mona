// move schema json file to dist directory
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = class MvJsonPlugin {
	apply(compiler) {
		compiler.hooks.afterEmit.tap('AfterBuild', () => {
			const configPath = path.resolve(process.cwd(), './src/schema.json');
			const targetPath = path.resolve(process.cwd(), './dist/schema.json');
			const targetDir = path.resolve(process.cwd(), './dist');

			if(!fs.existsSync(targetDir)) {
				fs.mkdirSync(targetDir);
			}

			if(!fs.existsSync(targetPath)) {
				fs.writeFileSync(targetPath, "{}");
			}

			if (fs.existsSync(configPath) && fs.existsSync(targetPath)) {
				fs.copyFileSync(configPath, targetPath);
				console.log(chalk.green('复制schema.json成功'));
			}
		})
	}
}
