Component({
  properties: {
    customStyle: {
      type: String,
      value: '',
    },
    customClass: {
      type: String,
      value: '',
    },
    indicatorDots: {
      type: Boolean,
      value: false,
    },
    indicatorColor: {
      type: String,
      value: 'rgba(0, 0, 0, .3)',
    },
    indicatorActiveColor: {
      type: String,
      value: '#000000'
    },
    circular: {
      type: Boolean,
      value: false,
    },
    autoplay: {
      type: Boolean,
      value: false
    },
    duration: {
      type: Number,
      value: 500
    },
    interval: {
      type: Number,
      value: 5000
    },
    current: {
      type: Number,
      value: 0
    },
    vertical: {
      type: Boolean,
      value: false
    },
    previousMargin: {
      type: String,
      value: '0px'
    },
    nextMargin: {
      type: String,
      value: '0px'
    },
    pageMargin: {
      type: String,
      value: '0px'
    },
    disableTouch: {
      type: Boolean,
      value: false
    }
  },
  data: {
    name: 'shop-swiper',
    hasError: false,
  },
  methods: {
    onChange(e) {
      this.triggerEvent('change', e.detail);
    },
    onTransition(e) {
      this.triggerEvent('transition', e.detail);
    },
    onScrollStart(e) {
      this.triggerEvent('scrollstart', e.detail);
    },
    onScrollEnd(e) {
      this.triggerEvent('scrollend', e.detail);
    }
  },
});
