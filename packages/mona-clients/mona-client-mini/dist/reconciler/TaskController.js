var TaskController = /** @class */ (function () {
    function TaskController(context) {
        this.context = context;
        this.tasks = [];
    }
    TaskController.prototype.requestUpdate = function (task) {
        this.tasks.push(task);
    };
    TaskController.prototype.applyUpdate = function () {
        this.context.setData(this.tasks);
        this.tasks = [];
    };
    return TaskController;
}());
export default TaskController;
//# sourceMappingURL=TaskController.js.map