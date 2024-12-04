import fs from 'fs';
import inquirer, { DistinctQuestion } from 'inquirer';
import { checkChinese } from './common';

const templates = [
  {
    name: 'light（适用于微应用、飞鸽插件开发）',
    value: 'light',
  },
  {
    name: 'max（适用于店铺装修模块开发）',
    value: 'max',
  },
  {
    name: 'app（适用于商家应用开发支持小程序和h5）',
    value: 'app',
  },
  {
    name: 'mini（适用于商家应用小程序开发）',
    value: 'mini',
  },
  {
    name: 'h5（适用于移动端应用开发）',
    value: 'h5',
  },
  {
    name: 'mobile（适用于移动端微应用开发）',
    value: 'mobile',
  },
];

const maxTemplateTypes = [
  {
    name: 'component（店铺装修组件开发）',
    value: 'max',
  },
  {
    name: 'template（店铺装修模板开发）',
    value: 'max-template',
  },
];

type AskKey = keyof Omit<Answer, 'appId'>;

export type TemplateType = 'app' | 'plugin' | 'mini' | 'max' | 'light';

export interface Answer {
  projectName: string;
  templateType: TemplateType;
  useTypescript: boolean;
  styleProcessor: 'less' | 'css';
  appId?: string;
}

export async function ask(opts: Partial<Answer>) {
  const prompts: inquirer.DistinctQuestion<Answer>[] = [];

  Object.keys(askConfig).map(type => {
    const defaultValue = opts[type as AskKey];
    const itemInst = askConfig[type as AskKey];
    if (itemInst && (itemInst?.checkAsk?.(defaultValue) || typeof itemInst?.checkAsk !== 'function')) {
      itemInst['checkAsk'] = undefined;
      prompts.push(itemInst);
    }
  });
  const answer: Answer = await inquirer.prompt(prompts);

  if (answer.templateType === 'max') {
    const { subTemplateType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'subTemplateType',
        message: '选择店铺装修类型',
        choices: maxTemplateTypes,
        default: maxTemplateTypes[0].value,
        checkAsk: (defaultValue?: string) => !defaultValue || !maxTemplateTypes.find(t => t.value === defaultValue),
      },
    ]);

    answer.templateType = subTemplateType;
  }

  const { appId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'appId',
      message: '请输入appId',
      default: 'tempAppId',
      validate(input: string) {
        if (!input) {
          return 'appId不能为空！请在抖店开放平台应用详情页查看APP_Key';
        }
        if (input === 'tempAppId') {
          return true;
        }
        if (!/^[0-9]{19,19}$/.test(input)) {
          return '无效的appId！请在抖店开放平台应用详情页查看APP_Key';
        }
        return true;
      },
    },
  ]);
  answer.appId = appId;

  return Object.assign({}, opts, answer);
}

const styleProcessors = [
  { name: 'less', value: 'less' },
  { name: 'css', value: 'css' },
];

type AskItem = DistinctQuestion & { checkAsk?: (defaultValue?: any) => boolean; testDefault?: any };
export const askConfig: Record<AskKey, AskItem> = {
  projectName: {
    type: 'input',
    name: 'projectName',
    message: '请输入应用名称！',
    checkAsk: (defaultValue?: string) => !defaultValue,
    validate(input: string) {
      if (!input) {
        return '应用名称不能为空！';
      }
      if (checkChinese(input)) {
        return '项目名称不能含有中文';
      }
      if (fs.existsSync(input)) {
        return '当前目录已存在同名文件夹，请更换应用名称！';
      }
      return true;
    },
    // 用于测试
    testDefault: 'mona',
  },
  useTypescript: {
    type: 'confirm',
    name: 'useTypescript',
    message: '是否使用Typescript',
    default: true,
    checkAsk: (defaultValue?: boolean) => typeof defaultValue !== 'boolean',
  },
  styleProcessor: {
    type: 'list',
    name: 'styleProcessor',
    message: '请选择样式预处理器',
    choices: styleProcessors,
    default: styleProcessors[0].value,
    checkAsk: (defaultValue?: string) => !defaultValue || !styleProcessors.find(s => s.value === defaultValue),
  },
  templateType: {
    type: 'list',
    name: 'templateType',
    message: '请选择模板',
    choices: templates,
    default: templates[0].value,
    checkAsk: (defaultValue?: string) => !defaultValue || !templates.find(t => t.value === defaultValue),
  },
};
