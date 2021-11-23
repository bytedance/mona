import { CommandInfo } from '../cmds';
export declare const commandUsage: (cmds: CommandInfo[]) => any;
export declare function hasYarn(): boolean;
export declare function getGlobalInstallPkgMan(): string;
export declare function isGlobaInstalled(): boolean;
export declare function joinCmdPath(cmd: CommandInfo): string;
export declare function dispatchCommand(cliPath: string): void;
