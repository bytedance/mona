type Icon = 'success' | 'loading' | 'none' | 'fail';

export enum ToastType {
  loading = 'loading',
  toast = 'toast'
}

export function getToastIconConfig(type: Icon) {
  return {
    success: {
      url: 'https://p3-ecom-fe.byteimg.com/tos-cn-i-w59vco1lho/d9f398e6945e654614fe5b8ec34a9bf3.png~tplv-w59vco1lho-png.png',
      className: 'success',
    },
    loading: {
      url: 'https://p3-ecom-fe.byteimg.com/tos-cn-i-w59vco1lho/b50762fd953a2a322cf066fbf6d046ce.png~tplv-w59vco1lho-png.png',
      className: 'loading',
    },
    none: {
      url: '',
      className: 'none',
    },
    fail: {
      url: 'https://p3-ecom-fe.byteimg.com/tos-cn-i-w59vco1lho/6f72c5eafc14e700d18cdd91f26b79b5.png~tplv-w59vco1lho-png.png',
      className: 'none',
    },
  }[type];
}
