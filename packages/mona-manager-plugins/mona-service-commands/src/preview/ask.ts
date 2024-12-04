import inquirer, { DistinctQuestion } from 'inquirer';

type AskKey = keyof Answer;

type PreviewPageType = 'default' | 'category';

export interface Answer {
  previewPage: PreviewPageType;
}

const previewPageTypes = [
  {
    name: 'default（推荐页）',
    value: 'default',
  },
  {
    name: 'category（分类页）',
    value: 'category',
  }
];

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

  return Object.assign({}, opts, answer);
}

type AskItem = DistinctQuestion & { checkAsk?: (defaultValue?: any) => boolean; testDefault?: any };
export const askConfig: Record<AskKey, AskItem> = {
  previewPage: {
    type: 'list',
    name: 'previewPage',
    message: '请选择需要预览的页面',
    choices: previewPageTypes,
    default: previewPageTypes[0].value,
    checkAsk: (defaultValue?: string) => !defaultValue || !previewPageTypes.find(s => s.value === defaultValue),
  }
};
