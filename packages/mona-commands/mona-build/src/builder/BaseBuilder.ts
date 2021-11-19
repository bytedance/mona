import { ConfigHelper } from "@/configHelper";
import webpack, { Compiler } from "webpack";

export default abstract class BaseBuilder {
  configHelper: ConfigHelper;
  compiler: Compiler;

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;

    // generate webpack config
    const webpackConfig = this.configHelper.generate();

    // generate complier
    this.compiler = webpack(webpackConfig);
  }

  abstract build(): void
  abstract start(): void
}