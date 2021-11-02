import commandLineUsage from 'command-line-usage';

export const startCommandUsage = () => {
  const sections = [
    {
      header: '描述',
      content: '启动本地开发服务器',
    },
    {
      header: '可选项',
      optionList: [
        { name: 'help', description: '输出帮助信息', alias: 'h', type: Boolean },
        { name: 'port', description: '输出当前CLI版本', alias: 'p', type: Boolean },
      ],
    }
  ];
  return commandLineUsage(sections);
};

export const buildCommandUsage = () => {
  const sections = [
    {
      header: '描述',
      content: '对项目进行打包',
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