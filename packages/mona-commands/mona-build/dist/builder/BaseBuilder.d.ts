import { ConfigHelper } from "../configHelper";
import { Compiler } from "webpack";
export default abstract class BaseBuilder {
    configHelper: ConfigHelper;
    compiler: Compiler;
    constructor(configHelper: ConfigHelper);
    abstract build(): void;
    abstract start(): void;
}
