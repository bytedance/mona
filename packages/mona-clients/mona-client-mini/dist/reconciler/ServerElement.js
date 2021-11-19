var id = 1;
var generateId = function () { return id++; };
var ServerElement = /** @class */ (function () {
    function ServerElement(_a) {
        var type = _a.type, props = _a.props, taskController = _a.taskController;
        this.firstChildKey = null;
        this.lastChildKey = null;
        this.prevSiblingKey = null;
        this.nextSiblingKey = null;
        this.type = type;
        this.props = props;
        this.key = generateId();
        this.taskController = taskController;
        this.children = new Map();
    }
    ServerElement.prototype.requestUpdate = function (task) {
        this.taskController.requestUpdate(task);
    };
    ServerElement.prototype.appendChild = function (child) {
        if (this.children.get(child.key)) {
            this.removeChild(child);
        }
        this.children.set(child.key, child);
        if (!this.firstChildKey) {
            this.firstChildKey = child.key;
        }
        else if (this.lastChildKey) {
            child.prevSiblingKey = this.lastChildKey;
            var oldLastChild = this.children.get(this.lastChildKey);
            if (oldLastChild) {
                oldLastChild.nextSiblingKey = child.key;
            }
        }
        this.lastChildKey = child.key;
    };
    ServerElement.prototype.removeChild = function (child) {
        var prevSibling = child.prevSiblingKey ? this.children.get(child.prevSiblingKey) : null;
        var nextSibling = child.nextSiblingKey ? this.children.get(child.nextSiblingKey) : null;
        if (prevSibling && nextSibling) {
            // middle element
            prevSibling.nextSiblingKey = nextSibling.key;
            nextSibling.prevSiblingKey = prevSibling.key;
        }
        else if (prevSibling) {
            // last element
            prevSibling.nextSiblingKey = null;
            this.lastChildKey = prevSibling.key;
        }
        else if (nextSibling) {
            // first element
            this.firstChildKey = nextSibling.key;
            nextSibling.prevSiblingKey = null;
        }
        else {
            // TODO
            // only element
            this.firstChildKey = null;
            this.lastChildKey = null;
        }
        this.children.delete(child.key);
    };
    ServerElement.prototype.insertBefore = function (child, nextSibling) {
        if (this.children.get(child.key)) {
            this.removeChild(child);
        }
        this.children.set(child.key, child);
        var prevSibling = nextSibling.prevSiblingKey ? this.children.get(nextSibling.prevSiblingKey) : null;
        child.nextSiblingKey = nextSibling.key;
        nextSibling.prevSiblingKey = child.key;
        child.prevSiblingKey = nextSibling.prevSiblingKey;
        if (prevSibling) {
            // added as first child, prepended
            prevSibling.nextSiblingKey = child.key;
        }
        else {
            // added in between
            this.firstChildKey = child.key;
        }
    };
    return ServerElement;
}());
export default ServerElement;
//# sourceMappingURL=ServerElement.js.map