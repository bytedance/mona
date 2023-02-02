const fs = require('fs');
const path = require('path');

function getSchemaProps(schemaJson) {
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

  for (let key in properties) {
    if(preDefinedKey.includes(key)) continue
    value[key] = properties[key].default
  }

  return value
}

function safeJsonParse(str) {
  if (!str) {
    return str;
  }
  try {
    return JSON.parse(str);
  } catch(_) {
    return str;
  }
}
function formatCtype19Value(arr) {
    return arr.map(item => ({
        name: item.name,
        type: item.c_type,
        value: formatCtypeValue(safeJsonParse(item.scheme_value), item.c_type)
    }))
}
function formatCtype20Value(value) {
    const result = {};
    Object.keys(value).forEach(key => {
        const item = value[key];
        result[key] = {
            name: item.name,
            type: item.c_type,
            value: formatCtypeValue(safeJsonParse(item.scheme_value), item.c_type)
        }
    })
    return result;
}
function formatCtypeValue(value, type) {
    if (type === 19) {
        return formatCtype19Value(value);
    } else if (type === 20) {
        return formatCtype20Value(value);
    } else {
        return value;
    }
}

function getPreviewProps(value, defaultValue = {}) {
  const arr = value;
  const result = {};
  arr.forEach(item => {
    result[item.name] = formatCtypeValue(safeJsonParse(item.scheme_value) || defaultValue[item.name], item.c_type);
  })
  return result;
}

module.exports = function getDevProps() {
  const schemaJsonPath = path.resolve(process.cwd(), './src/schema.json');
  const previewJsonPath = path.resolve(process.cwd(), './src/preview.json')
  let finalValue = {};
  if (fs.existsSync(schemaJsonPath)) {
    const schemaJson = JSON.parse(fs.readFileSync(schemaJsonPath).toString().trim() || '{}');
    finalValue = { ...getSchemaProps(schemaJson) };
  }
  if (fs.existsSync(previewJsonPath)) {
    const previewJson = JSON.parse(fs.readFileSync(previewJsonPath).toString().trim() || '[]');
    finalValue = { ...finalValue, ...getPreviewProps(previewJson, finalValue) };
  }
  return finalValue;
}