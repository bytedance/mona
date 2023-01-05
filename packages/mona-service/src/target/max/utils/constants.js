const createUniqueId = require('./createUniqueId');
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
const uniqueHash = createUniqueId().substring(1, 6);
module.exports = {
  C_TYPE_NEW_ISV,
  uniqueHash,
};
