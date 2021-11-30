import Reconciler from 'react-reconciler';
import TaskController from './TaskController';
import createHostConfig from './createHostConfig';
import AppTaskController from './AppTaskController';
const renderInstance = Reconciler(createHostConfig() as any);

export default function render(rootElement: React.ReactElement | null, controller: TaskController | AppTaskController) {
  if (!controller.rootContainer) {
    controller.rootContainer = renderInstance.createContainer(controller, 0, false, null);
  }
  return renderInstance.updateContainer(rootElement, controller.rootContainer, null);
}
