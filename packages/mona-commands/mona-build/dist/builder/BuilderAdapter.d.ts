import { Compiler } from 'webpack';
import { Options } from "../index";
import { ConfigHelper } from "../configHelper";
import BaseBuilder from "./BaseBuilder";
declare class BuilderAdapter implements BaseBuilder {
    configHelper: ConfigHelper;
    compiler: Compiler;
    builder: BaseBuilder;
    constructor(options: Options);
    build(): void;
    start(): void;
}
export default BuilderAdapter;
