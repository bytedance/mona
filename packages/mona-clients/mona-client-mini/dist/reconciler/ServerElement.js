var id = 1;
var generateId = function () { return id++; };
var allTypes = new Set(['view', 'button', 'text', 'ptext']);
function formatType(type) {
    if (allTypes.has(type)) {
        return type;
    }
    return 'view';
}
var ServerElement = /** @class */ (function () {
    function ServerElement(_a) {
        var type = _a.type, props = _a.props, taskController = _a.taskController;
        this.firstChildKey = null;
        this.lastChildKey = null;
        this.prevSiblingKey = null;
        this.nextSiblingKey = null;
        this.type = formatType(type);
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
    ServerElement.prototype.serialize = function () {
        var _this = this;
        var childrenKeys = this.children ? Array.from(this.children.keys()) : [];
        var children = childrenKeys.map(function (key) { var _a; return (_a = _this.children.get(key)) === null || _a === void 0 ? void 0 : _a.serialize(); });
        // remove children from props
        var _a = this.props || {}, _ = _a.children, cookiedProps = _a.cookiedProps;
        var json = {
            key: this.key,
            type: this.type,
            text: this.text,
            props: cookiedProps,
            children: children
        };
        return json;
    };
    return ServerElement;
}());
export default ServerElement;
//# sourceMappingURL=ServerElement.js.map