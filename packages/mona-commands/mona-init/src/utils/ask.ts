import fs from 'fs';
import inquirer from 'inquirer';

async function askTypescript(prompts: Record<string, unknown>[], defaultUseTs?: boolean) {
  if (typeof defaultUseTs !== 'boolean') {
    prompts.push({
      type: 'confirm',
      name: 'useTypescript',
      message: '是否使用Typescript',
      default: true,
    });
  }
}

const templates = [
  // {
  //   name: 'pc（适用于桌面端应用和Web应用）',
  //   value: 'pc',
  // },
  {
    name: 'plugin（适用于商家应用插件开发）',
    value: 'plugin',
  },
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

async function askTemplate(prompts: Record<string, unknown>[], defaultTemplate?: string) {
  if (!defaultTemplate || !templates.find(t => t.value === defaultTemplate)) {
    prompts.push({
      type: 'list',
      name: 'templateType',
      message: '请选择模板',
      choices: templates,
    });
  }
}

const styleProcessors = [
  { name: 'less', value: 'less' },
  { name: 'css', value: 'css' },
];
async function askStyleProcessor(prompts: Record<string, unknown>[], defaultStyle?: string) {
  if (!defaultStyle || !styleProcessors.find(s => s.value === defaultStyle))
  prompts.push({
    type: 'list',
    name: 'styleProcessor',
    message: '请选择样式预处理器',
    choices: styleProcessors,
  });
}

async function askProjectName(prompts: Record<string, unknown>[], defaultProjectName?: string) {
  if (!defaultProjectName) {
    prompts.push({
    type: 'input',
    name: 'projectName',
    message: '请输入应用名称！',
    validate(input: string) {
      if (!input) {
        return '应用名称不能为空！';
      }
      if (fs.existsSync(input)) {
        return '当前目录已存在同名文件夹，请更换应用名称！';
      }
      return true;
    },
  });
  }
}

export type TemplateType = 'pc' | 'mobile' | 'plugin' | 'monorepo';

export interface Answer {
  projectName: string;
  templateType: TemplateType;
  useTypescript: boolean;
  styleProcessor: 'less' | 'css';
}

interface AskOpts {
  projectName?: string;
  templateType?: string;
  useTypescript?: boolean;
  styleProcessor?: string;
}

export async function ask(opts: AskOpts) {
  const prompts: Record<string, unknown>[] = [];
  askProjectName(prompts, opts.projectName);
  askTemplate(prompts, opts.templateType);
  askTypescript(prompts, opts.useTypescript);
  askStyleProcessor(prompts, opts.styleProcessor);
  const answer: Answer = await inquirer.prompt(prompts);
  return Object.assign({}, opts, answer);
}
