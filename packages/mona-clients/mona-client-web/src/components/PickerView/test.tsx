// import React, { useEffect, useState, useRef, forwardRef, Ref, useImperativeHandle } from 'react';
// import { cls } from '@arco-design/mobile-utils';
// import { ContextLayout } from '../context-provider';
// import Popup from '../popup';
// import PickerView, { PickerViewRef, ValueType, PickerData, PickerCellMovingStatus } from '../picker-view';
// import { PickerProps, DataType } from './type';
// import { useListenResize } from '../_helpers';

// export * from './type';
// export { MultiPicker, PickerCell, Cascader } from '../picker-view';

// export interface PickerRef {
//   /** 最外层元素 DOM */
//   dom: HTMLDivElement | null;
//   /** 每一列的滑动状态 */
//   getCellMovingStatus: () => PickerCellMovingStatus[];
//   /** 手动更新元素布局 */
//   updateLayout: () => void;
//   /** 获取所有列的值 */
//   getAllColumnValues: () => ValueType[];
//   /** 获取第 n 列的值 */
//   getColumnValue: (index: number) => ValueType;
// }

// const getInitialValue = (value, data: DataType, cascade) => {
//   if (value && value.length) {
//     return value;
//   }

//   const computedValue: ValueType[] = [];

//   if (!cascade) {
//     if (!(data[0] instanceof Array)) {
//       return data[0]?.value ? [data[0].value] : [];
//     }

//     (data as (ValueType | PickerData)[][]).map(column => {
//       computedValue.push(typeof column[0] === 'object' ? column[0].value : column[0]);
//     });
//   } else {
//     const cascadePickerData = data as unknown as PickerData[];
//     if (!cascadePickerData.length) {
//       return computedValue;
//     }

//     computedValue.push(cascadePickerData[0].value);

//     let traverse = cascadePickerData[0].children;

//     while (traverse) {
//       computedValue.push(traverse[0].value);

//       traverse = traverse[0].children;
//     }
//   }

//   return computedValue;
// };

// /**
//  * 选择器组件，形式是弹起的浮层。
//  * @type 数据录入
//  * @name 选择器
//  */
// const Picker = forwardRef((props: PickerProps, ref: Ref<PickerRef>) => {
//   const {
//     className,
//     itemStyle,
//     cascade = true,
//     cols = 3,
//     rows = 5,
//     data,
//     okText = '确定',
//     dismissText = '取消',
//     disabled = false,
//     clickable = true,
//     hideEmptyCols = false,
//     title = '',
//     visible = false,
//     value,
//     needBottomOffset = false,
//     onDismiss,
//     onOk,
//     onChange,
//     maskClosable = false,
//     onHide,
//     onColumnChange,
//     ...otherProps
//   } = props;

//   const [scrollValue, setScrollValue] = useState(getInitialValue(value, data, cascade));
//   const domRef = useRef<HTMLDivElement | null>(null);
//   const pickerViewRef = useRef<PickerViewRef>(null);

//   useImperativeHandle(ref, () => ({
//     dom: domRef.current,
//     getCellMovingStatus: () => pickerViewRef.current?.getCellMovingStatus() || [],
//     getAllColumnValues: () => pickerViewRef.current?.getAllColumnValues() || [],
//     getColumnValue: index => pickerViewRef.current?.getColumnValue(index) || '',
//     updateLayout: () => pickerViewRef.current?.updateLayout(),
//   }));

//   function handleDismiss() {
//     if (onDismiss) {
//       onDismiss();
//     }
//     if (onHide) {
//       onHide('dismiss');
//     }
//   }

//   const handleConfirm = () => {
//     const val = pickerViewRef.current?.getAllColumnValues() || scrollValue;
//     if (onOk) {
//       onOk(val);
//     }
//     if (onChange) {
//       onChange(val);
//     }
//     if (onHide) {
//       onHide('confirm');
//     }
//   };

//   useEffect(() => {
//     setScrollValue(value);
//   }, [value, setScrollValue]);

//   useListenResize(updateLayoutByVisible, [visible]);

//   // 每次visible从false变为true时需要重新设置scrollValue的值为当前value的值（初始值）
//   function updateLayoutByVisible() {
//     if (visible && pickerViewRef.current) {
//       pickerViewRef.current.updateLayout();
//     }
//   }

//   useEffect(() => {
//     updateLayoutByVisible();
//   }, [visible]);

//   return (
//     <ContextLayout>
//       {({ prefixCls }) => (
//         <>
//           <Popup
//             visible={visible}
//             className={className + ` ${prefixCls}-picker all-border-box`}
//             close={() => onHide?.('mask')}
//             direction="bottom"
//             maskClosable={maskClosable}
//             needBottomOffset={needBottomOffset}
//             {...otherProps}
//           >
//             <div className={`${prefixCls}-picker-wrap`} ref={domRef}>
//               <div className={`${prefixCls}-picker-header`}>
//                 <div className={`${prefixCls}-picker-header-btn left`} onClick={handleDismiss}>
//                   {dismissText}
//                 </div>
//                 <div className={`${prefixCls}-picker-header-title`}>{title}</div>
//                 <div className={`${prefixCls}-picker-header-btn right`} onClick={handleConfirm}>
//                   {okText}
//                 </div>
//               </div>
//               <PickerView
//                 ref={pickerViewRef}
//                 data={data}
//                 cascade={cascade}
//                 cols={cols}
//                 rows={rows}
//                 disabled={disabled}
//                 value={getInitialValue(value, data, cascade)}
//                 onColumnChange={onColumnChange}
//                 itemStyle={itemStyle}
//                 clickable={clickable}
//                 hideEmptyCols={hideEmptyCols}
//               />
//             </div>
//           </Popup>
//         </>
//       )}
//     </ContextLayout>
//   );
// });

// export default Picker;
