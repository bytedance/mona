var baseId = 1;
export var TYPE_TEXT = 'mona_text';
var VNode = /** @class */ (function () {
    function VNode(_a) {
        var type = _a.type, props = _a.props, container = _a.container;
        this.parent = null;
        this.firstChild = null;
        this.lastChild = null;
        this.previousSibling = null;
        this.nextSibling = null;
        this._key = baseId++;
        this.type = type;
        this.container = container;
        this.props = props;
    }
    VNode.toNodeJSON = function (node) {
        if (node.type === TYPE_TEXT) {
            return {
                key: node._key,
                type: node.type,
                text: node.text,
            };
        }
        return {
            key: node._key,
            type: node.type,
            text: node.text,
            props: node.props,
            children: []
        };
    };
    VNode.prototype.appendChild = function (node) {
        // perf
        this.removeChild(node);
        node.parent = this;
        if (!this.firstChild) {
            this.firstChild = node;
        }
        else if (this.lastChild) {
            this.lastChild.nextSibling = node;
            node.previousSibling = this.lastChild;
        }
        this.lastChild = node;
    };
    VNode.prototype.removeChild = function (node) {
        if (node.parent !== this) {
            return;
        }
        var _a = this, prev = _a.previousSibling, next = _a.nextSibling;
        if (prev && next) {
            prev.nextSibling = next;
            next.previousSibling = prev;
        }
        else if (prev) {
            prev.nextSibling = null;
            this.lastChild = prev;
        }
        else if (next) {
            next.previousSibling = null;
            this.firstChild = next;
        }
        node.previousSibling = null;
        node.nextSibling = null;
    };
    VNode.prototype.insertBefore = function (node, refNode) {
        this.removeChild(node);
        node.parent = this;
        var prev = refNode.previousSibling;
        node.nextSibling = refNode;
        refNode.previousSibling = node;
        node.previousSibling = prev;
        if (prev) {
            prev.nextSibling = node;
        }
        else {
            this.firstChild = node;
        }
    };
    VNode.prototype.toJSON = function () {
        var _a;
        var nodeJson = VNode.toNodeJSON(this);
        var child = this.firstChild;
        while (child) {
            (_a = nodeJson.children) === null || _a === void 0 ? void 0 : _a.push(child.toJSON());
            child = child.nextSibling;
        }
        return nodeJson;
    };
    return VNode;
}());
export default VNode;
//# sourceMappingURL=VNode.js.map