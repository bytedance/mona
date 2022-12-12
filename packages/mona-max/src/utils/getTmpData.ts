//@ts-nocheck
import { C_TYPE_NEW_ISV } from './constants.js';

const isJSONStringifyLegal = (v: any) => {
  try {
    JSON.stringify(v);
    return true;
  } catch (e) {
    return false;
  }
};

function transformSchemaValue(value: any) {
  if (!value) return '';
  const keysOfValue = Object.keys(value);
  if (!Array.isArray(keysOfValue)) return '';

  let res: any = [];

  keysOfValue.forEach(key => {
    const v = value[key] ? JSON.parse(value[key]) : null;
    const { type, value: scheme_value } = v || {};

    let realValue = scheme_value;
    if (Array.isArray(scheme_value) && type === C_TYPE_NEW_ISV.listContainer.value) {
      realValue = scheme_value.map(i => {
        if (i && i.type === C_TYPE_NEW_ISV.objectContainer.value && i.value) {
          const res = {
            c_type: i.type,
            name: i.name,
            reject_info: null,
            scheme_value: {} as Record<string, any>,
          };
          Object.keys(i.value).forEach(j => {
            const vForObj = i.value[j];
            res.scheme_value[j] = {
              c_type: vForObj?.type,
              scheme_value: vForObj && vForObj.value ? JSON.stringify(vForObj.value) : '',
              name: j,
              reject_info: null,
            };
          });
          res.scheme_value = JSON.stringify(res.scheme_value) as unknown as Record<string, any>;
          return res;
        }

        return {
          c_type: i?.type,
          name: i?.name,
          reject_info: null,
          scheme_value: i && i.value ? JSON.stringify(i.value) : '',
        };
      });
    }

    if (type === C_TYPE_NEW_ISV.objectContainer.value) {
      const res = {};
      Object.keys(scheme_value).forEach(j => {
        const vForObj = scheme_value[j];
        res[j] = {
          c_type: vForObj?.type,
          scheme_value: vForObj?.value ? JSON.stringify(vForObj.value) : '',
          name: j,
          reject_info: null,
        };
      });
      realValue = res;
    }

    res.push({
      c_type: type,
      scheme_value: isJSONStringifyLegal(realValue) ? JSON.stringify(realValue) : '',
      name: key,
      reject_info: null,
    });
  });

  return res;
}

export function finalData(value) {
  if (!value) return '';
  const keysOfValue = Object.keys(value);
  if (!Array.isArray(keysOfValue)) return '';

  let res = [];

  value.forEach(key => {
    const item = {
      componentId: key.component_id,
      componentVersion: key.version,
    };
    const componentValue = transformSchemaValue(key.data.value);
    item.value = JSON.stringify(componentValue);
    res.push(item);
  });

  return JSON.stringify(res);
}
