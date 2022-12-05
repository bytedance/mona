import fs from 'fs';
import path from 'path';
import ConfigHelper from '../../ConfigHelper';
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

function adapteForWebFuncRender(webEntry: string) {
  if (fs.existsSync(webEntry)) {
    const sourceCode = fs.readFileSync(webEntry).toString();
    let code = sourceCode.replace('export default class ErrorBoundary', 'class ErrorBoundary');
    code += '\nexport default function Entry(props) { return <ErrorBoundary {...props} />}';
    fs.writeFileSync(webEntry, code);
  }
}

export const writeEntry = (
  tempReactLynxDir: string,
  configHelper: ConfigHelper,
  entry: string,
  isInjectProps: boolean = false,
) => {
  const lynxEntry = path.join(tempReactLynxDir, 'index.jsx');
  const schemaJson = JSON.parse(fs.readFileSync(path.resolve(configHelper.cwd, './src/schema.json'), 'utf-8'));
  const devProps = getDevProps(schemaJson);
  if (!isInjectProps) {
    fs.writeFileSync(lynxEntry, getErrorBoundary(entry));
  } else {
    fs.writeFileSync(lynxEntry, getErrorBoundary(entry, devProps));
  }


  // write web
  transformToWeb(path.dirname(lynxEntry), path.basename(lynxEntry), [entry])
  // web entry 
  const webEntry =path.join(tempReactLynxDir, 'index.web.jsx');
  // 适配旧逻辑的函数render方式
  adapteForWebFuncRender(webEntry);
};
