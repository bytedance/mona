import { IPlugin } from '@bytedance/mona-manager';
import chalk from 'chalk';
import { AppSceneTypeEnum, requestBeforeCheck } from '../common';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { upload } from './utils';
import { compressDir } from '../compress/utils';
import { generateRequestFromOpen } from '../common';
export enum AppSupportEndEnum {
  PC = 1,
  MOBILE = 2,
}
const getSceneRoute = async (request: any) => {
  const { data } = await request('/captain/app/version/searchScene?pageNo=1&pageSize=1000');

  const choices = data?.reduce((prev: any[], cur: { sceneName: any }) => {
    prev.push(cur.sceneName);
    return prev;
  }, []);

  const { sceneName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'sceneName',
      message: '请选择投放场景',
      choices,
    },
  ]);

  const sceneId = data.filter((v: { sceneName: any }) => v.sceneName === sceneName)[0].sceneId;

  return [{ sceneId, enterRoute: '' }];
};

const publish: IPlugin = ctx => {
  ctx.registerCommand(
    'publish',
    {
      description: '发布新版本代码到开放平台',
      options: [
        { name: 'help', description: '输出帮助信息', alias: 'h' },
        { name: 'target', description: '上传端，当为微应用时需指定上传pc端还是移动端，默认为light', alias: 't' },
      ],
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

        console.log(chalk.cyan(`当前应用：${appDetail.appBase.AppName} 最新版本：${latestVersion || '无'}`));

        // 微应用
        if (appDetail.appSceneType === AppSceneTypeEnum.LIGHT_APP) {
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
          let sceneRoute: { sceneId: any; enterRoute: string }[] = [];
          try {
            sceneRoute = await getSceneRoute(request);
          } catch (err) {}

          // params
          const params = {
            version: answer.version,
            versionType: 1,
            appId,
            desc: answer.desc || '',
            fileId,
            fileName,
            sceneRoute,
            endType: args.t === 'mobile' ? AppSupportEndEnum.MOBILE : AppSupportEndEnum.PC,
            supportEnd: args.t === 'mobile' ? AppSupportEndEnum.MOBILE : AppSupportEndEnum.PC,
          };

          console.log(chalk.cyan(`即将创建新版本`));
          // create new version
          await request('/captain/app/version/create', {
            method: 'POST',
            data: params,
          });
        } else {
          const shouldEdit = latestVersionStatus && [2, 3, 5, 7].indexOf(latestVersionStatus) !== -1;
          const isTemplate = appDetail.appSceneType === AppSceneTypeEnum.DESIGN_CENTER_TEMPLATE;
          const isOldApp = appDetail?.appExtend?.frameworkType !== 1;
          // judge whether is mixed
          let isMixed = !isOldApp;
          if (isTemplate) {
            console.log(chalk.green(isMixed ? '当前为混排模板版本' : '当前为非混排模板版本'));
          } else {
            const entry = ctx.configHelper.entryPath;
            const ext = path.extname(entry);
            const targetTTMLFile = entry.replace(ext, '') + '.ttml';
            isMixed = fs.existsSync(targetTTMLFile);
            console.log(chalk.green(isMixed ? '当前为混排组件版本' : '当前为非混排组件版本'));
          }

          // ask desc
          const answer = await inquirer.prompt(
            [
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
            ].filter(i => !!i),
          );

          // upload
          const { fileId, fileName } = await upload(output, user.userId, args);
          const frameworkType = isOldApp && !isTemplate ? (isMixed ? 1 : 0) : undefined;

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
              data: { ...params, version: undefined },
            });
          }
        }

        // 删除临时文件
        fs.unlinkSync(output);
        console.log(chalk.green('发布成功!'));
        console.log(chalk.green(`请前往 https://op.jinritemai.com/app-back/${appId}/version-manage 查看最新状态!`));
      } catch (err: any) {
        console.log(chalk.red(`发布失败，${err.message}`));
      }
    },
  );
};

module.exports = publish;
