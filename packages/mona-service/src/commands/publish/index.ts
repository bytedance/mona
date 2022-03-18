import { IPlugin } from '../../Service';
import chalk from 'chalk';
import { readUser } from './utils';
import inquirer from 'inquirer';
import fs from 'fs';

import { generateRequestFromOpen, upload } from './utils';
import { compressDir } from '../compress/utils';


const publish: IPlugin = (ctx) => {
  ctx.registerCommand('publish', {
    description: '发布新版本代码到开放平台',
    options: [
        { name: 'help', description: '输出帮助信息', alias: 'h' },
        { name: 'appid', description: '开放平台应用id', alias: 'a' },
      ],
    usage: 'mona-service publish',
  }, async (args) => {
    try {
      console.log(args)
      console.log(JSON.parse(args.header))
      console.log(chalk.cyan(`请确保在项目根目录使用该命令`));
      // ensure login
      const user = readUser();
      if (!user) {
        throw new Error('未登录，请使用 mona login 进行登录')
      }
      console.log(chalk.cyan(`当前用户：${user.nickName}`));
      const appId = args.appid;
      if (typeof appId !== 'string') {
        throw new Error('appId应该为字符串')
      }
      if (!appId) {
        throw Error('未指定 appId')
      }
      
      const request = generateRequestFromOpen(args, user.cookie);

      // compress
      const output = await compressDir(process.cwd(), ['dist']);
      
      // version detail
      const appDetail = await request('/captain/appManage/getAppDetail', {
        method: 'GET',
        params: { appId }
      })
      const latestVersion = appDetail.appBase.latestVersion;
      const latestVersionStatus = appDetail.appBase.latestVersionStatus;
      const shouldEdit = latestVersionStatus && [4, 1, 6].indexOf(latestVersionStatus) === -1;
      
      // ask desc
      const answer = await inquirer.prompt([{
        type: 'input',
        name: 'desc',
        message: '请输入版本描述',
        validate(input: string) {
          if (!input) {
            return '版本描述不能为空'
          } else {
            return true;
          }
        }
      }])

      // upload
      const { fileId, fileName } = await upload(output, user.userId, args);

      // params
      const params = { version: latestVersion, appId, desc: answer.desc || '', fileId, fileName }

      if (shouldEdit) {
        console.log(chalk.cyan(`即将修改版本 ${latestVersion}`))
        // edit version
        await request('/captain/app/version/update', {
          method: 'POST',
          data: params
        })
      } else {
        console.log(chalk.cyan(`即将创建新版本`))
        // create new version
        await request('/captain/app/version/create', {
          method: 'POST',
          data: params
        })
      }

      // 删除临时文件
      fs.unlinkSync(output);
      console.log(chalk.green('发布成功!'));
    } catch (err: any) {
      console.log(chalk.red(`发布失败，${(err.message)}`));
    }
  })
}

module.exports = publish;