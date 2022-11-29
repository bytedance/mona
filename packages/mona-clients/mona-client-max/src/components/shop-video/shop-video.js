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
    src: {
      type: String,
      value: '',
    },
    autoplay: {
      type: Boolean,
      value: false,
    },
    inittime: {
      type: Number,
      value: 0
    },
    loop: {
      type: Boolean,
      value: false
    },
    muted: {
      type: Boolean,
      value: false
    },
    rate: {
      type: Number,
      value: 1000/6
    },
    autolifecycle: {
      type: Boolean,
      value: false
    },
    poster: {
      type: String,
      value: ""
    },
    objectfit: {
      type: String,
      value: "contain"
    },
    cache: {
      type: Boolean,
      value: true
    },
    preloadKey: {
      type: String,
      value: ''
    },
    __control: {
      type: String,
      value: ''
    },
    volume: {
      type: Number,
      value: 100,
    },
  },
  data: {
    name: 'shop-video',
    hasError: false,
  },
  methods: {
    onPlay: function(e) {
      this.triggerEvent('play', e)
    },
    onPause: function(e) {
      this.triggerEvent('pause', e)
    },
    onEnded: function(e) {
      this.triggerEvent('ended', e)
    },
    onFirstFrame: function(e) {
      this.triggerEvent('firstframe', e)
    },
    onVideoInfos: function(e) {
      this.triggerEvent('videoinfos', e)
    },
    onError: function(e) {
      this.setData({ hasError: true });
      this.triggerEvent('error', e)
    },
    onTimeUpdate: function(e) {
      this.triggerEvent('timeupdate', e)
    },
    onFullScreenChange: function(e) {
      this.triggerEvent('fullscreenchange', e)
    },
    onBufferingChange: function(e) {
      this.triggerEvent('bufferingchange', e)
    },
    onReady: function(e) {
      this.triggerEvent('ready', e)
    },
    onSeek: function(e) {
      this.triggerEvent('seek', e)
    },
  },
});
