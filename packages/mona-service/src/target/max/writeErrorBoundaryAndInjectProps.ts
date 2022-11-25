import fs from 'fs';
import path from 'path';
import ConfigHelper from '../../ConfigHelper';
import { getLynxEntry } from './writeLynxConfig';
import getDevProps from './utils/getDevProps';

const getErrorBoundary = (schemaProps?: Record<string, any>) => {
  const errorBoundary = `
import ReactLynx, { Component } from "@bytedance/mona-speedy-runtime";
import PropTypes from "prop-types";
import App from './index.jsx';
  export default class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
    }
    state = {
      hasError: false${schemaProps ? ',\n      appProps:' + JSON.stringify(schemaProps) : ''}
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
                <text>something went wrong</text>
            </view>
        )
      }
      return (
        <view class="page-body">
            <App ${
              schemaProps ? '{...this.state.appProps}' : 'extraProps={this.props.extraProps} {...this.props.dataSource}'
            }/>
        </view>
      )
    }
  }
  `;
  return errorBoundary;
};

export const writeErrorBoundaryAndInjectProps = (
  maxTmp: string,
  configHelper: ConfigHelper,
  isInjectProps: boolean = false,
) => {
  const lynxEntry = getLynxEntry(maxTmp, configHelper);
  const schemaJson = JSON.parse(fs.readFileSync(path.resolve(configHelper.cwd, './src/schema.json'), 'utf-8'));
  const devProps = getDevProps(schemaJson);
  if (!isInjectProps) {
    fs.writeFileSync(lynxEntry, getErrorBoundary());
  } else {
    fs.writeFileSync(lynxEntry, getErrorBoundary(devProps));
  }
};
