var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// @ts-nocheck
import BaseComponents from '@bytedance/mona-components/dist/BaseComponents';
import createBaseComponent from '../createBaseComponent';
var MiniComponents = /** @class */ (function (_super) {
    __extends(MiniComponents, _super);
    function MiniComponents() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Text = createBaseComponent('text');
        _this.RichText = createBaseComponent('rich-text');
        _this.Progress = createBaseComponent('progress');
        _this.Icon = createBaseComponent('icon');
        _this.View = createBaseComponent('view');
        _this.ScrollView = createBaseComponent('scroll-view');
        _this.Swiper = createBaseComponent('swiper');
        _this.SwiperItem = createBaseComponent('swiper-item');
        _this.MovableArea = createBaseComponent('movable-area');
        _this.MovableView = createBaseComponent('movable-view');
        _this.Button = createBaseComponent('button');
        _this.Checkbox = createBaseComponent('checkbox');
        _this.CheckboxGroup = createBaseComponent('checkbox-group');
        _this.Form = createBaseComponent('form');
        _this.Input = createBaseComponent('input');
        _this.Label = createBaseComponent('label');
        _this.Picker = createBaseComponent('picker');
        _this.PickerView = createBaseComponent('picker-view');
        _this.PickerViewColumn = createBaseComponent('picker-view-column');
        _this.Radio = createBaseComponent('radio');
        _this.RadioGroup = createBaseComponent('radio-group');
        _this.Slider = createBaseComponent('slider');
        _this.Switch = createBaseComponent('switch');
        _this.Textarea = createBaseComponent('textarea');
        _this.Navigator = createBaseComponent('navigator');
        _this.Image = createBaseComponent('image');
        _this.Video = createBaseComponent('video');
        _this.LivePlayer = createBaseComponent('live-player');
        _this.Camera = createBaseComponent('camera');
        _this.Canvas = createBaseComponent('canvas');
        _this.Map = createBaseComponent('map');
        _this.Webview = createBaseComponent('web-view');
        _this.Ad = createBaseComponent('ad');
        _this.OpenData = createBaseComponent('open-data');
        return _this;
    }
    return MiniComponents;
}(BaseComponents));
export default MiniComponents;
//# sourceMappingURL=index.js.map