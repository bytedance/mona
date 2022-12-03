import fs from 'fs';
import path from 'path';
import ConfigHelper from '../../ConfigHelper';
import { getLynxEntry } from './writeLynxConfig';
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
        <view>
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

export const writeEntry = (
  tempReactLynxDir: string,
  configHelper: ConfigHelper,
  entry: string,
  isInjectProps: boolean = false,
) => {
  const lynxEntry = getLynxEntry(tempReactLynxDir);
  const schemaJson = JSON.parse(fs.readFileSync(path.resolve(configHelper.cwd, './src/schema.json'), 'utf-8'));
  const devProps = getDevProps(schemaJson);
  if (!isInjectProps) {
    fs.writeFileSync(lynxEntry, getErrorBoundary(entry));
  } else {
    fs.writeFileSync(lynxEntry, getErrorBoundary(entry, devProps));
  }
  // write web
  transformToWeb(path.dirname(lynxEntry), path.basename(lynxEntry), [entry])
};
