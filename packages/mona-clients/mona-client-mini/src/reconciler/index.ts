import Reconciler from 'react-reconciler';
import TaskController from './TaskController';
import createHostConfig from './createHostConfig';

const renderInstance = Reconciler(createHostConfig() as any);

export default function render(rootElement: React.ReactElement | null, controller: TaskController) {
  if (!controller._root) {
    controller._root = renderInstance.createContainer({}, 0, false, null);
  }
  return renderInstance.updateContainer(rootElement, controller._root, null);
}