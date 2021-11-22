import fs from 'fs';
import inquirer, { DistinctQuestion } from 'inquirer';

const templates = [
  // {
  //   name: 'pc（适用于桌面端应用和Web应用）',
  //   value: 'pc',
  // },
  {
    name: 'plugin（适用于商家应用插件开发）',
    value: 'plugin'
  }
  // {
  //   name: 'mobile（适用于小程序和移动端web应用）',
  //   value: 'mobile',
  //   disabled: true,
  // },
  // {
  //   name: 'monorepo（同时包含以上三种方式，使用monorepo方式进行管理）',
  //   value: 'monorepo',
  //   disabled: true,
  // },
];

export type TemplateType = 'pc' | 'mobile' | 'plugin' | 'monorepo';

export interface Answer {
  projectName: string;
  templateType: TemplateType;
  useTypescript: boolean;
  styleProcessor: 'less' | 'css';
}

export interface AskOpts {
  projectName: string;
  templateType: TemplateType;
  useTypescript: boolean;
  styleProcessor: Answer['styleProcessor'];
}

export async function ask(opts: AskOpts) {
  const prompts: inquirer.DistinctQuestion<Answer>[] = [];

  Object.keys(opts).map(type => {
    const defaultValue = opts[type as keyof AskOpts];
    const itemInst = askConfig[type as keyof AskOpts];
    if (itemInst && (itemInst?.checkAsk?.(defaultValue) || typeof itemInst?.checkAsk !== 'function')) {
      itemInst['checkAsk'] = undefined;
      prompts.push(itemInst);
    }
  });
  const answer: Answer = await inquirer.prompt(prompts);
  return Object.assign({}, opts, answer);
}

const styleProcessors = [
  { name: 'less', value: 'less' },
  { name: 'css', value: 'css' }
];

type AskItem = DistinctQuestion & { checkAsk?: (defaultValue?: any) => boolean };
const askConfig: Record<keyof AskOpts, AskItem> = {
  projectName: {
    type: 'input',
    name: 'projectName',
    message: '请输入应用名称！',
    checkAsk: (defaultValue?: string) => !defaultValue,
    validate(input: string) {
      if (!input) {
        return '应用名称不能为空！';
      }
      if (fs.existsSync(input)) {
        return '当前目录已存在同名文件夹，请更换应用名称！';
      }
      return true;
    }
  },
  useTypescript: {
    type: 'confirm',
    name: 'useTypescript',
    message: '是否使用Typescript',
    default: true,
    checkAsk: (defaultValue?: boolean) => typeof defaultValue !== 'boolean'
  },
  styleProcessor: {
    type: 'list',
    name: 'styleProcessor',
    message: '请选择样式预处理器',
    choices: styleProcessors,
    checkAsk: (defaultValue?: string) => !defaultValue || !styleProcessors.find(s => s.value === defaultValue)
  },
  templateType: {
    type: 'list',
    name: 'templateType',
    message: '请选择模板',
    choices: templates,
    checkAsk: (defaultValue?: string) => !defaultValue || !templates.find(t => t.value === defaultValue)
  }
};
