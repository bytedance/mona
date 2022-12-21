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
function getReviewProps(reviewJson, defaultValue) {
  const arr = reviewJson;
  const result = {};
  arr.forEach(item => {
    result[item.name] = safeJsonParse(item.scheme_value) || defaultValue[item.name];
  })
  return result;
}

module.exports = function getDevProps() {
  const schemaJsonPath = path.resolve(process.cwd(), './src/schema.json');
  const reviewJsonPath = path.resolve(process.cwd(), './src/review.json')
  let finalValue = {};
  if (fs.existsSync(schemaJsonPath)) {
    const schemaJson = JSON.parse(fs.readFileSync(schemaJsonPath).toString().trim() || '{}');
    finalValue = { ...getSchemaProps(schemaJson) };
  }
  if (fs.existsSync(reviewJsonPath)) {
    const reviewJson = JSON.parse(fs.readFileSync(reviewJsonPath).toString().trim() || '[]');
    finalValue = { ...finalValue, ...getReviewProps(reviewJson, finalValue) };
  }
  return finalValue;
}