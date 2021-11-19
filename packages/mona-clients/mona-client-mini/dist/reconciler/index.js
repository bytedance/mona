import Reconciler from 'react-reconciler';
import createHostConfig from './createHostConfig';
var renderInstance = Reconciler(createHostConfig());
export default function render(rootElement, controller) {
    if (!controller._root) {
        controller._root = renderInstance.createContainer({}, 0, false, null);
    }
    return renderInstance.updateContainer(rootElement, controller._root, null);
}
//# sourceMappingURL=index.js.map