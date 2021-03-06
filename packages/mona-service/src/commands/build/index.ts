import { IPlugin } from '../../Service';

const build: IPlugin = ctx => {
  
  ctx.registerCommand(
    'build',
    {
      description: '对项目进行打包',
      options: [
        { name: 'help', description: '输出帮助信息', alias: 'h' },
        { name: 'target', description: '指定打包类型', alias: 't' },
      ],
    },
    (args, _, targetContext) => {
      process.env.NODE_ENV = 'production';
      if (targetContext?.buildFn) {
        targetContext?.buildFn(args);
      }
    },
  );
};

module.exports = build;
