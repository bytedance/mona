import commandLineUsage from 'command-line-usage';

export const commandUsage = () => {
  const sections = [
    {
      header: '描述',
      content: '初始化一个商家应用/商家应用插件项目',
    },
    {
      header: '可选项',
      optionList: [
        { name: 'help', description: '输出帮助信息', alias: 'h', type: Boolean },
      ],
    }
  ];
  return commandLineUsage(sections);
};