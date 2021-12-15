import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { InputAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  // name: propAliasMap.name,
  value: propAliasMap.value,
  type: propAliasMap.type,
  password: propAliasMap.password,
  placeholder: propAliasMap.placeholder,
  disabled: propAliasMap.disabled,
  placeholderStyle: propAliasMap.placeholderStyle,
  maxLength: propAliasMap.maxLength,
  focus: propAliasMap.focus,
  cursorSpacing: propAliasMap.cursorSpacing,
  cursor: propAliasMap.cursor,
  selectionStart: propAliasMap.selectionStart,
  selectionEnd: propAliasMap.selectionEnd,
  onFocus: propAliasMap.onFocus,
  onBlur: propAliasMap.onBlur,
  onConfirm: propAliasMap.onConfirm,
  onInput: propAliasMap.onInput,
  adjustPosition: propAliasMap.adjustPosition,
  confirmType: propAliasMap.confirmType,
};

export default alias;
