import commandLineUsage from 'command-line-usage';

export const commandUsage = () => {
  const sections = [
    {
      header: '描述',
      content: '压缩打包后的产物，以便在开放平台发布',
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