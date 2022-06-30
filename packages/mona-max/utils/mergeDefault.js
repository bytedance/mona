module.exports = function mergeDefault(schemaJson, defaultValue) {
  try {
    if(Object.prototype.toString.call(schemaJson) !== '[object Object]')  return schemaJson
    const properties = schemaJson.properties
    if(Object.prototype.toString.call(properties) !== '[object Object]')  return schemaJson
    for (key in properties) {
      if(defaultValue[key]) {
        const value = JSON.parse(defaultValue[key]).value
        properties[key].default = value
      }
    }
  }catch(e) {
    console.log('save default value failed', e)
  }
  return schemaJson
}

