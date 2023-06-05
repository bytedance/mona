import fs from 'fs';
import path from 'path';
import getDevProps from './utils/getDevProps';
import { transformToWeb } from './ttmlToReactLynx';

const getErrorBoundary = (entry: string, schemaProps?: Record<string, any>) => {
  const errorBoundary = `
import ReactLynx, { Component } from "@bytedance/mona-speedy-runtime";
import PropTypes from "prop-types";
import App from '${entry}';
  export default class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
    }
    state = {
      hasError: false
    }
    static getDerivedStateFromError(error){
      console.log('getDerivedStateFromError', error)
      return {
        hasError: true
      }
    }
    componentDidCatch(error){
      console.log('App componentDidCatch', error)
    }
    render() {
      if(this.state.hasError){
        return (
            <view>
                <text>出错了</text>
            </view>
        )
      }

      const dataSource = this.props.dataSource || {};
      const buildId = this.props.buildId;
      const componentStyle=this.props.componentStyle || {};
      const finalProps = {
        ...${schemaProps ? JSON.stringify(schemaProps) : '{}'},
        ...dataSource,
        __mona_module_key: this.props.module ? this.props.module.key : '',
        __mona_module_index: this.props.module ? this.props.module.index : 0,
      }

      return (
        <view id={buildId} style={componentStyle}>
            <App {...finalProps} />
        </view>
      )
    }
  }
  `;
  return errorBoundary;
};

export const writeEntry = (tempTtmlLynxDir: string, entry: string, isInjectProps: boolean = false) => {
  const lynxEntry = path.join(tempTtmlLynxDir, 'index.jsx');
  const devProps = getDevProps();
  if (!isInjectProps) {
    fs.writeFileSync(lynxEntry, getErrorBoundary(entry));
  } else {
    fs.writeFileSync(lynxEntry, getErrorBoundary(entry, devProps));
  }

  // write web
  transformToWeb(path.dirname(lynxEntry), path.basename(lynxEntry), [entry], true);
};
