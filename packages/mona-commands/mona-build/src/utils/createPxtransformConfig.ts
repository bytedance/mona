import { ProjectConfig } from "@bytedance/mona";

export default function createPxtransformConfig(platform: 'h5' | 'weapp', projectConfig: ProjectConfig) {
  const { postcss } = projectConfig;
  const defaultPxtransformOptions = {
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    }

    const pxtransformConfig = postcss?.pxtransform;
    const enabled = typeof pxtransformConfig?.enable === 'boolean' ? pxtransformConfig.enable : true;
    const designWidth = pxtransformConfig?.designWidth || 750;
    const pxtransformOptions = { ...defaultPxtransformOptions, ...(pxtransformConfig?.config || {}) };
    
    return {
      enabled,
      platform,
      designWidth,
      ...pxtransformOptions
    }
}