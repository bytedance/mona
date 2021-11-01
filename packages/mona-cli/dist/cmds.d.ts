export interface CommandInfo {
    name: string;
    cli: string;
    package: string;
    description: string;
}
declare const cmds: CommandInfo[];
export default cmds;
