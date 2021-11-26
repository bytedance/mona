// @ts-nocheck
import BaseComponents from '@bytedance/mona-components/dist/Base'
import createBaseComponent from '../createBaseComponent';

class MiniComponents extends BaseComponents {
  Button = createBaseComponent('button')
}

export default MiniComponents;