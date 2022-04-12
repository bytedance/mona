module.exports = function getDevProps(schemaJson) {
  const preDefinedKey = ['extraProps']

  const value = {
    extraProps:{
      "secShopId": "test",
      "inEditor": true
    }
  }
  if(Object.prototype.toString.call(schemaJson) !== '[object Object]')  return value
  const properties = schemaJson.properties
  if(Object.prototype.toString.call(properties) !== '[object Object]')  return value

  for (key in properties) {
    if(preDefinedKey.includes(key)) continue
    value[key] = properties[key].default
  }
}
