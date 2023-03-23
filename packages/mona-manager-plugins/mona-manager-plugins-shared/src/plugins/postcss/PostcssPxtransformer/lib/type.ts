const typeJudge = (s: any) =>
  Object.prototype.toString
    .call(s)
    .slice(8, -1)
    .toLowerCase();

const types = [
  "String",
  "Array",
  "Undefined",
  "Boolean",
  "Number",
  "Function",
  "Symbol",
  "Object"
];

module.exports = types.reduce((acc, str) => {
  acc["is" + str] = val => typeJudge(val) === str.toLowerCase();
  return acc;
}, {} as { [key: string]: (val: any) => boolean });