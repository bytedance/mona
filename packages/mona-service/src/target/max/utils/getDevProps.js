const fs = require('fs');

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

function getReviewProps(reviewJson, defaultValue) {
  const arr = reviewJson;
  const result = {};
  arr.forEach(item => {
    result[item.name] = item.scheme_value || defaultValue[item.name];
  })
  return result;
}

module.exports = function getDevProps() {
  const schemaJsonPath = path.resolve(process.cwd(), './src/schema.json');
  const reviewJsonPath = path.resolve(process.cwd(), './src/review.json')
  let finalValue = {};
  if (fs.existsSync(schemaJsonPath)) {
    const schemaJson = JSON.parse(schemaJsonPath, 'utf-8');
    finalValue = { ...getSchemaProps(schemaJson) };
  }
  if (fs.existsSync(reviewJsonPath)) {
    const reviewJson = JSON.parse(reviewJsonPath, 'utf-8');
    finalValue = { ...finalValue, ...getReviewProps(reviewJsonPath, finalValue) };
  }
  return finalValue;
}
