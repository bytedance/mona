// import { IPlugin } from '@bytedance/mona-service';
// import chalk from 'chalk';
// // import fs from 'fs';
// // import { compressToZipFromDir, readDest } from '../compress';
// import { readUser } from '../login';

// const publish: IPlugin = (ctx) => {
//   ctx.registerCommand('publish', {
//     description: '发布新版本代码',
//     options: [
//         { name: 'help', description: '输出帮助信息', alias: 'h' }
//       ],
//     usage: 'mona publish',
//   }, async () => {
//     try {
//       // const destPath = readDest();
//       // if (!fs.existsSync(destPath)) {
//       //   throw new Error(`请先使用 ${chalk.cyan('mona build')} 进行打包`);
//       // }
//       // const zipPath = await compressToZipFromDir(destPath);
//       // console.log(zipPath);
//       // get user info
//       const user = readUser();
//       if (user) {
//         // get appid and plugin name
//         // compress
//         // upload
//       }
//     } catch (err: any) {
//       console.log(chalk.red(err.message));
//     }
//   })
// }

// module.exports = publish;