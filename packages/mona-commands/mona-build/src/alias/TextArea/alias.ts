import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { TextareaAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  value: propAliasMap.value,
  placeholder: propAliasMap.placeholder,
  disabled: propAliasMap.disabled,
  placeholderStyle: propAliasMap.placeholderStyle,
  maxLength: propAliasMap.maxLength,
  focus: propAliasMap.focus,
  cursorSpacing: propAliasMap.cursorSpacing,
  // cursor: propAliasMap.cursor,
  selectionStart: propAliasMap.selectionStart,
  selectionEnd: propAliasMap.selectionEnd,
  onFocus: propAliasMap.onFocus,
  onBlur: propAliasMap.onBlur,
  onConfirm: propAliasMap.onConfirm,
  onInput: propAliasMap.onInput,
  autoHeight: propAliasMap.autoHeight,
  fixed: propAliasMap.fixed,
  disableDefaultPadding: propAliasMap.disableDefaultPadding,
};

export default alias;
