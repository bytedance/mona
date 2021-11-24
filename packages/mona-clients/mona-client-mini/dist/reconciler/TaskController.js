var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var TaskController = /** @class */ (function () {
    function TaskController(context) {
        this.context = context;
        this.tasks = [];
    }
    TaskController.prototype.requestUpdate = function (task) {
        var _this = this;
        if (this.tasks.length === 0) {
            Promise.resolve().then(function () {
                _this.applyUpdate();
            });
        }
        this.tasks.push(task);
    };
    TaskController.prototype.applyUpdate = function () {
        var data = this.tasks.map(function (t) { var _a; return (__assign(__assign({}, t), { child: (_a = t.child) === null || _a === void 0 ? void 0 : _a.serialize() })); });
        console.log('applyUpdate', data);
        this.context.setData({
            tasks: data
        });
        this.tasks = [];
    };
    return TaskController;
}());
export default TaskController;
//# sourceMappingURL=TaskController.js.map