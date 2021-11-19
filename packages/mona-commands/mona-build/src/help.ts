import commandLineUsage from 'command-line-usage';

export const startCommandUsage = () => {
  const sections = [
    {
      header: '描述',
      content: '启动本地开发服务器',
    },
    {
      header: '使用方式',
      content: 'mona start'
    },
    {
      header: '可选项',
      optionList: [
        { name: 'help', description: '输出帮助信息', alias: 'h', type: Boolean },
        { name: 'target', description: '指定打包类型', alias: 't', type: String },
        { name: 'port', description: '指定本地服务器端口', alias: 'p', type: Number },
      ],
    },
    {
      header: '举例',
      content: 'mona start -p 9999'
    },
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
      header: '使用方式',
      content: 'mona build'
    },
    {
      header: '可选项',
      optionList: [
        { name: 'help', description: '输出帮助信息', alias: 'h', type: Boolean },
        { name: 'target', description: '指定打包类型', alias: 't', type: String },
      ],
    },
    {
      header: '举例',
      content: 'mona build'
    },
  ];
  return commandLineUsage(sections);
};