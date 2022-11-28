Component({
  properties: {
    src: {
      type: String,
      value: '', // "circle" | 'square'
    },
    mode: {
      type: String,
      value: 'scaleToFill', // "scaleToFill" | 'aspectFit' | 'aspectFill' | 'center'
    },
    placeholder: {
      type: String,
      value: '',
    },
    blurRadius: {
      type: String,
      value: '',
    },
    imageConfig: {
      type: String,
      value: 'ARGB_8888' // "ARGB_8888" | 'RGB_565'
    },
    capInsets: {
      type: String,
      value: null,
    },
    loopCount: {
      type: Number,
      value: 0,
    },
    prefetchWidth: {
      type: String,
      value: ''
    },
    prefetchHeight: {
      type: String,
      value: ''
    },
    skipRedirection: {
      type: Boolean,
      value: false,
    },
    imageTransitionStyle: {
      type: String,
      value: 'none', // "fadeIn" | 'none'
    },
    preventLoadingOnListScroll: {
      type: Boolean,
      value: false,
    },
    downsampling: {
      type: Boolean,
      value: true,
    },
    implicitAnimation: {
      type: Boolean,
      value: true,
    },
    clipRadius: {
      type: Boolean,
      value: true,
    },
    customStyle: {
      type: String,
      value: '',
    },
    customClass: {
      type: String,
      value: '',
    }
  },
  data: {
    name: 'shop_image',
    loaded: false,
    hasError: false,
  },
  methods: {
    onImageError: function (...args: any[]) {
      this.setData({ hasError: true, loaded: true });
      this.triggerEvent('error', ...(args as any[]));
    },
    onImageLoad: function () {
      this.setData({ loaded: true });
    },
  },
});
