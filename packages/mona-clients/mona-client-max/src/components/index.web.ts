// 定义的组件需在此文件中进行导出，同时同步index.web.ts
// 组件如需在编译时由小写标签转换组件，请在mona-service/src/target/max/tagToComponents.ts中加入映射
export { default as Image } from './MaxImage/index.web';
export { default as Video } from './MaxVideo/index.web';
export { default as Swiper } from './MaxSwiper/index.web';
export { default as Canvas } from './MaxCanvas/index.web';