import { IPlugin } from '@bytedance/mona-manager';

const start: IPlugin = ctx => {
 
  ctx.registerCommand(
    'start',
    {
      description: '启动本地开发服务器',
      options: [
        { name: 'help', description: '输出帮助信息', alias: 'h' },
        { name: 'target', description: '指定打包类型', alias: 't' },
        { name: 'port', description: '指定启动端口', alias: 'p' },
      ],
    },
    (args, _, targetContext) => {
      process.env.NODE_ENV = 'development';

      if (args.coverage && args.target === 'light') {
        process.env.COVERAGE = '1';
      }
      if (targetContext?.startFn) {
        targetContext?.startFn(args);
      }
    },
  );
};

module.exports = start;
