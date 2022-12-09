import { IPlugin } from '../../Service';
import chalk from 'chalk';
import { requestBeforeCheck } from '../common';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { upload } from './utils';
import { compressDir } from '../compress/utils';
import { generateRequestFromOpen } from '../common';

const publish: IPlugin = ctx => {
  ctx.registerCommand(
    'publish',
    {
      description: '发布新版本代码到开放平台',
      options: [{ name: 'help', description: '输出帮助信息', alias: 'h' }],
      usage: 'mona-service publish',
    },
    async (args, configHelper) => {
      try {
        // get appId from project config, at the same time it is compatible with old usag
        // console.log('targetContext?.builder.configHelper.projectConfig', configHelper);
        const { user, appId } = await requestBeforeCheck(ctx, args);

        const request = generateRequestFromOpen(args, user.cookie);

        // compress
        const output = await compressDir(process.cwd(), [configHelper.projectConfig.output]);

        // version detail
        const appDetail: any = await request<any>('/captain/appManage/getAppDetail', {
          method: 'GET',
          params: { appId },
        });
        const latestVersion = appDetail.appBase.latestVersion;
        const latestVersionStatus = appDetail.appBase.latestVersionStatus;
        const isLightApp = appDetail.appBase.deployType === 4;

        console.log(chalk.cyan(`当前应用：${appDetail.appBase.AppName} 最新版本：${latestVersion || '无'}`));

        if (isLightApp) {
          // ask desc
          const answer = await inquirer.prompt([
            {
              type: 'input',
              name: 'version',
              message: '请输入版本号，例如1.0.0',
              validate(input: string) {
                if (!input) {
                  return '版本号不能为空';
                } else if (!/^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(input)) {
                  return '无效的版本号，请输入三位的版本号，如1.0.0';
                } else {
                  return true;
                }
              },
            },
            {
              type: 'input',
              name: 'desc',
              message: '请输入版本描述',
              validate(input: string) {
                if (!input) {
                  return '版本描述不能为空';
                } else if (input.length > 200) {
                  return '版本描述长度应小于200';
                } else {
                  return true;
                }
              },
            },
          ]);

          // upload
          const { fileId, fileName } = await upload(output, user.userId, args);

          // params
          const params = { version: answer.version, versionType: 1, appId, desc: answer.desc || '', fileId, fileName };

          console.log(chalk.cyan(`即将创建新版本`));
          // create new version
          await request('/captain/app/version/create', {
            method: 'POST',
            data: params,
          });
        } else {
          const shouldEdit = latestVersionStatus && [2, 3, 5, 7].indexOf(latestVersionStatus) !== -1;
          const isOldApp = appDetail?.appExtend?.frameworkType !== 1;
          // judge whether is mixed
          const entry = ctx.configHelper.entryPath;
          const ext = path.extname(entry);
          const targetTTMLFile = entry.replace(ext, '') + '.ttml';
          const isMixed = fs.existsSync(targetTTMLFile);
          console.log(chalk.green(isMixed ? '当前为混排组件版本' : '当前为非混排组件版本'));
          // ask desc
          const answer = await inquirer.prompt([
            {
              type: 'input',
              name: 'desc',
              message: '请输入版本描述',
              validate(input: string) {
                if (!input) {
                  return '版本描述不能为空';
                } else if (input.length > 200) {
                  return '版本描述长度应小于200';
                } else {
                  return true;
                }
              },
            },
          ].filter(i => !!i));

          // upload
          const { fileId, fileName } = await upload(output, user.userId, args);
          const frameworkType = isOldApp ? (isMixed ? 1 : 0) : undefined;

          // params
          const params = { version: latestVersion, appId, desc: answer.desc || '', fileId, fileName, frameworkType };

          if (shouldEdit) {
            console.log(chalk.cyan(`即将修改版本 ${latestVersion}`));
            // edit version
            await request('/captain/app/version/update', {
              method: 'POST',
              data: params,
            });
          } else {
            console.log(chalk.cyan(`即将创建新版本`));
            // create new version
            await request('/captain/app/version/create', {
              method: 'POST',
              data: {...params, version: undefined },
            });
          }
        }

        // 删除临时文件
        fs.unlinkSync(output);
        console.log(chalk.green('发布成功!'));
      } catch (err: any) {
        console.log(chalk.red(`发布失败，${err.message}`));
      }
    },
  );
};

module.exports = publish;
