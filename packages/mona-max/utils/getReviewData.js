const isJSONStringifyLegal = v => {
  try {
    JSON.stringify(v);
    return true;
  } catch (e) {
    return false;
  }
};

const C_TYPE_NEW_ISV = {
  input: { value: 1, componentName: 'Input' },
  textArea: { value: 2, componentName: 'Input.TextArea' },
  radio: { value: 3, componentName: 'Radio.Group' },
  checkBoxGroup: { value: 4, componentName: 'Checkbox.Group' },
  datePicker: { value: 5, componentName: 'DatePicker' },
  dateRangePicker: { value: 6, componentName: 'DatePicker.RangePicker' },
  timePicker: { value: 7, componentName: 'TimePicker' },
  timeRangePicker: { value: 8, componentName: 'TimePicker.RangePicker' },
  select: { value: 9, componentName: 'Select' },
  switch: { value: 10, componentName: 'Switch' },
  imagePicker: { value: 11, componentName: 'ImagePicker' },
  hotSpot: { value: 12, componentName: 'HotSpot' },
  linkPicker: { value: 13, componentName: 'LinkPicker' },
  productPicker: { value: 14, componentName: 'ProductPicker' },
  couponPicker: { value: 15, componentName: 'CouponPicker' },
  poster: { value: 16, componentName: 'Poster' },
  activityPicker: { value: 17, componentName: 'ActivityPicker' },
  objectContainer: { value: 20, componentName: 'Object' },
  listContainer: { value: 19, componentName: 'ArrayCards' },
};

module.exports = function transformSchemaValue(value) {
  if (!value) return '';
  const keysOfValue = Object.keys(value);
  if (!Array.isArray(keysOfValue)) return '';

  let res = [];

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
            scheme_value: {},
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
          res.scheme_value = JSON.stringify(res.scheme_value);
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

  return JSON.stringify(res);
};

