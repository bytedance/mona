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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import ServerElement from './ServerElement';
var emptyObject = {};
function changedProps(oldObj, newObj) {
    // Return a diff between the new and the old object
    var uniqueProps = new Set(__spreadArray(__spreadArray([], Object.keys(oldObj), true), Object.keys(newObj), true));
    var props = Array.from(uniqueProps).filter(function (propName) { return oldObj[propName] !== newObj[propName]; });
    // const finalChangedProps = dealEvent(changedProps);
    return props;
}
// eslint-disable-next-line max-lines-per-function
export default function createHostConfig() {
    var hostConfig = {
        appendInitialChild: function (parent, child) {
            parent.appendChild(child);
        },
        createInstance: function (type, props, taskController) {
            return new ServerElement({ type: type, props: props, taskController: taskController });
        },
        createTextInstance: function (text, taskController) {
            var element = new ServerElement({ type: 'text', taskController: taskController });
            element.text = text;
            return element;
        },
        // finalizeInitialChildren(element: ServerElement, type: string, props: any) {
        //     const result = {}
        //     Object.keys(props).forEach((key) => {
        //         if (isEventName(key) && typeof props[key] === 'function') {
        //             const eventKey = generateEventKey();
        //             result[key] = eventKey;
        //             // 进入事件池
        //             eventPool.set(eventKey, props[key]);
        //         } else if (key !== 'children') {
        //             result[key] = props[key];
        //         }
        //     })
        //     element.props = result;
        //     return false
        // },
        // getPublicInstance(inst:) {
        //     return inst
        // },
        // clearContainer() {
        //     console.log('clearContainer')
        // },
        prepareForCommit: function () {
            // empty
        },
        resetAfterCommit: function () {
            // empty
        },
        resetTextContent: function (element) {
            // empty
        },
        prepareUpdate: function (domElement, type, oldProps, newProps) {
            return changedProps(oldProps, newProps).filter(function (prop) { return prop !== 'children'; });
        },
        getRootHostContext: function (rootInstance) {
            return emptyObject;
        },
        getChildHostContext: function (parentHostContext, type) {
            return emptyObject;
        },
        shouldSetTextContent: function (type, props) {
            return false;
        },
        now: function () {
            // noop
        },
        // useSyncScheduling: true,
        supportsMutation: true,
        appendAllChildren: function (children) {
            // console.log('appendAllChildren', children);
        },
        appendChild: function (parent, child) {
            // console.log('appendChild', child.sent, child)
            var identifier = { child: child, method: 'appendChild' };
            // const identifier = child.sent
            //     ? { childKey: child.key, method: 'appendExistingChild' }
            //     : { child: child, method: 'appendChild'}
            // WorkerElement.markSent(child)
            parent.appendChild(child);
            parent.requestUpdate(__assign({ parentKey: parent.key }, identifier));
        },
        appendChildToContainer: function (parent, child) {
            // console.log('appendChildToContainer', child.children.get(2).children.get(1).children.size);
            // WorkerElement.markSent(child)
            // console.log('mark end all');
            parent.requestUpdate({
                method: 'appendChildToContainer',
                child: child,
            });
            // console.log('send', child)
        },
        removeChild: function (parent, child) {
            parent.removeChild(child);
            parent.requestUpdate({
                method: 'removeChild',
                parentKey: parent.key,
                childKey: child.key,
            });
        },
        removeChildFromContainer: function (parent, child) {
            // debugger
            // throw new Error('not yet implemented')
            // sendMessage({
            //   method: 'removeChildFromContainer',
            //   parentInstance, child
            // })
        },
        insertBefore: function (parent, child, beforeChild) {
            // const identifier = child.sent
            //     ? { childKey: child.key, method: 'insertExistingBefore' }
            //     : { child: child, method: 'insertBefore'}
            var identifier = { child: child, method: 'insertBefore' };
            // WorkerElement.markSent(child)
            parent.insertBefore(child, beforeChild);
            parent.requestUpdate(__assign({ parentKey: parent.key, beforeKey: beforeChild.key }, identifier));
        },
        commitUpdate: function (instance, updatePayload, type, oldProps, newProps) {
            if (updatePayload.length) {
                // throw new Error('not yet implemented')
                // sendMessage({
                //   method: 'commitUpdate',
                //   instance, updatePayload, type, oldProps, newProps
                // })
            }
        },
        commitMount: function (instance, updatePayload, type, oldProps, newProps) {
            if (updatePayload.length) {
                throw new Error('not yet implemented');
                // sendMessage({
                //   method: 'commitMount',
                //   instance, updatePayload, type, oldProps, newProps
                // })
            }
        },
        commitTextUpdate: function (textInstance, oldText, newText) {
            // WorkerElement.markSent(textInstance);
            textInstance.text = newText;
            textInstance.requestUpdate({
                method: 'commitTextUpdate',
                key: textInstance.key,
                text: newText,
            });
        },
    };
    return hostConfig;
}
//# sourceMappingURL=createHostConfig.js.map