import { ProjectConfig } from "@bytedance/mona";

export default function createPxtransformConfig(platform: 'web' | 'mini', projectConfig: ProjectConfig) {
  const { postcss } = projectConfig;

    const pxtransformConfig = postcss?.pxtransform;
    const enabled = typeof pxtransformConfig?.enable === 'boolean' ? pxtransformConfig.enable : true;
    const designWidth = pxtransformConfig?.designWidth || 750;
    //@ts-ignore
    const deviceRatio = pxtransformConfig?.deviceRatio || {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2
    };
    const pxtransformOptions = { propList: ['*'], ...(pxtransformConfig?.config || {}) };
    
    return {
      enabled,
      platform,
      designWidth,
      deviceRatio,
      ...pxtransformOptions
    }
}