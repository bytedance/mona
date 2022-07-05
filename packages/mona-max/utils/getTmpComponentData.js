module.exports = function getTmpComponentData(value) {
  if (!value) return '';
  const keysOfValue = Object.keys(value);
  if (!Array.isArray(keysOfValue)) return '';

  let res = [];

  value.forEach(key => {
    const item = {
      componentId: key.component_id,
      componentVersion: key.version,
    }
    res.push(item)
  })
  return JSON.stringify(res)
}