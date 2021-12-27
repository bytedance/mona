import { PickerProps } from '@bytedance/mona';
import React, { useCallback, useRef, useState } from 'react';
import { useProps } from './hooks';
import PickerMask from './mask';
import PickerView from './pickerView';
import { TouchEvent } from '@bytedance/mona';

const Picker: React.FC<PickerProps> = props => {
  const [visible, setVisible] = useState(false);
  const newProps = useProps(props);
  const pickerRef = useRef(newProps.value);
  const propsRef = useRef(newProps);

  const handleCancel = useCallback((e: TouchEvent) => {
    setVisible(false);
    propsRef.current?.onCancel?.({
      ...e,
      detail: { value: pickerRef.current.getData() },
    });
  }, []);
  const handleConfirm = useCallback((e: TouchEvent) => {
    setVisible(false);
    propsRef.current?.onConfirm?.({
      ...e,
      detail: { value: pickerRef.current.getData() },
    });
  }, []);
  return (
    <div>
      <div onTouchStart={() => !props.disabled && setVisible(true)}>
        {props.children}
        <PickerMask visible={visible} onCancel={handleCancel} onConfirm={handleConfirm}>
          <PickerView ref={pickerRef} {...newProps}></PickerView>
        </PickerMask>
      </div>
    </div>
  );
};
export default Picker;
