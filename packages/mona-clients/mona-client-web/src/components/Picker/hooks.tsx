import { PickerProps, TouchEvent } from '@bytedance/mona';

import { PickerData } from './type';
import { genEvent } from '../utils';
import { useMemo, useRef, useState } from 'react';

export const useProps = (props: PickerProps) => {
  const { mode } = props;
  const propsRef = useRef<PickerProps>(props);
  propsRef.current = props;
  const finalData = useMemo(() => {
    let finalData: {
      data: PickerData[];
      value: any;
    } = {
      data: [],
      value: props.value,
    };
    switch (mode) {
      case 'selector':
        finalData.data = genData([props.range!], props.rangeKey);
        finalData.value = [props.value];
        break;
      case 'multiSelector':
        finalData.value = Object.assign(
          Array.from({ length: props.range?.length || 0 }, () => 0),
          props.value,
        );
        finalData.data = genData(props.range || [], props.rangeKey);

        break;
      case 'date':
        finalData = genDateData(props.value, props.start, props.end, props.fields);

        break;
      case 'time':
        finalData = genTimeData(props.value, props.start, props.end);
        break;
      case 'region':
        break;
      default:
        const exhaustiveCheck: never = props;
        //@ts-ignore
        finalData.value = exhaustiveCheck.value;
        break;
    }
    return {
      data: finalData?.data as unknown as PickerData[],
      value: finalData.value,
    };
    //@ts-ignore
  }, [mode, props.value, props.start, props.end, props.fields, props.range, props.rangeKey]);
  const handler = useMemo(() => {
    let handleConfirm, handleChange, handleCancel;
    handleConfirm = propsRef.current.onChange;
    handleCancel = propsRef.current.onCancel;

    switch (mode) {
      case 'selector':
        handleConfirm = (e: TouchEvent) => {
          e.detail.value = e.detail.value?.[0];
          propsRef.current.onChange?.(e);
        };
        break;
      case 'multiSelector':
        handleChange = (value: any[], idx: number) => {
          //@ts-ignore
          propsRef.current.onColumnChange?.(
            genEvent({
              type: 'change',
              detail: {
                column: +idx,
                value: value[idx],
              },
            }),
          );
        };
        break;
      case 'date':
        handleConfirm = (e: TouchEvent) => {
          const value = e.detail.value;
          const y = finalData.data[value[0]];
          const m = y?.children?.[value[1]];
          const d = m?.children?.[value[2]];

          e.detail.value = [y.label, m?.label, d?.label].filter(item => item !== undefined).join(':');
          propsRef.current?.onChange?.(e);
        };
        break;
      case 'time':
        handleConfirm = (e: TouchEvent) => {
          const value = e.detail.value;
          const h = finalData.data[value[0]];
          const m = h.children?.[value[1]];
          e.detail.value = [h.label, m?.label].join(':');
          propsRef.current?.onChange?.(e);
        };

        break;

      case 'region':
        break;

      default:
        break;
    }
    return {
      onColumnChange: handleChange,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    };
  }, [finalData.data]);
  return {
    ...handler,
    ...finalData,
  };
};

export function useRefState<T>(
  initialValue: T | (() => T),
): [T, React.MutableRefObject<T>, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);
  const stateRef = useRef<T>(state);
  stateRef.current = state;
  return [state, stateRef, setState];
}

const genArr = (start: string, end: string) => {
  return Array.from({ length: +end + 1 - +start }, (_, idx) => {
    return idx + Number(start);
  });
};
const genTimeData = (value?: string, start: string = '00:00', end: string = '23:59') => {
  const [sH, sM] = start.split(':');
  const [eH, eM] = end.split(':');
  const AllMmArr = genArr('00', '59').map(m => {
    return m < 10 ? `0${m}` : `${m}`;
  });
  const mmArr = genArr(sM, eM).map(m => {
    return m < 10 ? `0${m}` : `${m}`;
  });
  const hhArr = genArr(sH, eH).map(m => {
    return m < 10 ? `0${m}` : `${m}`;
  });
  let timeArr = genData([hhArr, AllMmArr]);
  if (Number(eH) - Number(sH) >= 1) {
    timeArr = genData([hhArr, AllMmArr]);
    timeArr[0].children = genData([
      genArr(sM, 59 + '').map(m => {
        return +m < 10 ? `0${m}` : `${m}`;
      }),
    ]);

    timeArr[timeArr.length - 1].children = genData([
      genArr('0', eM).map(m => {
        return +m < 10 ? `0${m}` : `${m}`;
      }),
    ]);
  } else {
    timeArr = genData([hhArr, mmArr]);
  }
  const valueArr = value?.split(':') || [sH, sM];

  const hourIndex = hhArr.findIndex(item => +valueArr[0] === +item);
  const mIndx = timeArr
    .find(item => item.value === hourIndex)
    .children?.find((item: any) => +valueArr[1] === +item.label)?.value;
  return {
    value: [hourIndex, mIndx],
    data: timeArr,
  };
};

const genDateData = (value?: string, start: string = '2000-10-01', end: string = '2021-10-10', fields?: string) => {
  const [startYYYY, startMM, startDD] = start.split('-');
  const [endYYYY, endMM, endDD] = end.split('-');

  const YYYYArr = genArr(startYYYY, endYYYY);
  const MMArr = genArr(startMM, endMM);
  const isYear = fields === 'year' ? [] : undefined;
  const isMounth = fields === 'month' ? [] : undefined;

  let finalValue = genYearDataArr(YYYYArr, !isYear, !isMounth);
  let monthValue, dayValue, yearValue;
  const valueArr = value?.split('-') ?? [];
  if (!isYear) {
    if (+endYYYY - +startYYYY < 1) {
      finalValue[0].children = genMounthDataArr(MMArr, !isMounth);

      if (!isMounth) {
        if (+endMM - +startMM < 1) {
          finalValue[0].children[0].children = genData([dayArr[+startMM - 1].slice(+startDD - 1, +endDD)]);
        } else {
          finalValue[0].children[0].children = genData([dayArr[+startMM - 1].slice(+startDD - 1)]);
          finalValue[0].children[finalValue[0].children.length - 1].children = genData([
            dayArr[+endMM - 1].slice(0, +endDD),
          ]);
        }
      }
    } else {
      finalValue[0].children = genMounthDataArr(genArr(startMM, 12 + ''), !isMounth ? [] : undefined);
      finalValue[finalValue.length - 1].children = genMounthDataArr(genArr(1 + '', endMM), !isMounth);
      if (!isMounth) {
        finalValue[0].children[0].children = genData([dayArr[+startMM - 1].slice(+startDD - 1)]);
        finalValue[finalValue.length - 1].children[finalValue[finalValue.length - 1].children.length - 1].children =
          genData([dayArr[+endMM - 1].slice(0, +endDD)]);
      }
    }
  }
  if (isYear) {
    if (valueArr[0] !== undefined) {
      yearValue = finalValue.find(item => +item.label === +valueArr[0]);
    }
  } else if (isMounth) {
    if (valueArr[0] !== undefined) {
      yearValue = finalValue.find(item => +item.label === +valueArr[0]);
    }
    if (yearValue && valueArr[1] !== undefined) {
      monthValue = yearValue.children?.find(item => +item.label === +valueArr[1]);
    }
  } else {
    if (valueArr[0] !== undefined) {
      yearValue = finalValue.find(item => +item.label === +valueArr[0]);
    }
    if (yearValue && valueArr[1] !== undefined) {
      monthValue = yearValue.children?.find(item => +item.label === +valueArr[1]);
    }
    if (monthValue && valueArr[2] !== undefined) {
      dayValue = monthValue.children?.find(item => +item.label === +valueArr[2]);
    }
  }

  return {
    data: finalValue,
    value: [yearValue?.value, monthValue?.value, dayValue?.value].filter(item => item !== undefined),
  };
};

// TODO: 闰年
const dayArr = [31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30].map(item => genArr(1 + '', item + ''));
const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const genMounthDataArr = (MMarr: any[], children: any) => {
  return MMarr.map((item, idx) => {
    return {
      value: idx,
      label: item,
      children: children ? genData([dayArr[+item - 1]]) : undefined!,
    };
  });
};

const genYearDataArr = (YYYYArr: any[], yearChildren: any, monthChildren: any) => {
  const MMarr = monthArr.map((item, idx) => {
    return {
      value: idx,
      label: item,
      children: monthChildren ? genData([dayArr[+item - 1]]) : undefined,
    };
  });
  return YYYYArr.map((item, idx) => {
    return {
      value: idx,
      label: item,
      children: yearChildren ? MMarr : undefined!,
    };
  });
};

const genData = (data: (string | number | boolean)[][], rangeKey?: string) => {
  let children: any[];
  data
    .slice()
    .reverse()
    .forEach(arr => {
      children = arr.map((value, idx) => {
        if (rangeKey && value !== null && typeof value === 'object') {
          return {
            value: idx,
            label: value[rangeKey],
            children,
          };
        }
        return {
          value: idx,
          label: value,
          children,
        };
      });
    });
  //@ts-ignore
  return children;
};
