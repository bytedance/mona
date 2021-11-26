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
import BaseComponents from '@bytedance/mona-components/dist/Base';
import createBaseComponent from '../createBaseComponent';
var MiniComponents = /** @class */ (function (_super) {
    __extends(MiniComponents, _super);
    function MiniComponents() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Button = createBaseComponent('button');
        return _this;
    }
    return MiniComponents;
}(BaseComponents));
export default MiniComponents;
//# sourceMappingURL=index.js.map