import createComponent from '../../createComponent';
export var Button = createComponent('button');
Button.defaultProps = {
    size: 'default',
    type: 'default',
    disabled: false,
    loading: false,
    hoverClassName: 'button-hover',
    hoverStartTime: 20,
    hoverStayTime: 70,
    hoverStopPropagation: false
};
//# sourceMappingURL=index.js.map