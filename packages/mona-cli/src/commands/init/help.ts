import commandLineUsage from 'command-line-usage';

export const commandUsage = () => {
  const sections = [
    {
      header: '描述',
      content: '初始化一个商家应用/商家应用插件项目',
    },
    {
      header: '使用方式',
      content: 'mona init <projectName>'
    },
    {
      header: '可选项',
      optionList: [
        { name: 'help', description: '输出帮助信息', alias: 'h', type: Boolean },
        { name: 'use-typescript', description: '是否使用typescript', alias: 'u', type: Boolean },
        { name: 'style', description: '指定样式处理器', alias: 's', type: String },
        { name: 'template', description: '指定模板', alias: 't', type: String },
      ],
    },
    {
      header: '举例',
      content: 'mona init demo -t plugin'
    },
  ];
  return commandLineUsage(sections);
};