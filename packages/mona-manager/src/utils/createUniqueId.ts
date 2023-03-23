import { hexMD5 } from './md5';
export function createUniqueId() {
  const random = () => Number(Math.random().toString().substr(2)).toString(36);
  const arr = [String(Date.now())];
  function createId() {
    var num = random();
    arr.push(num);
  }
  var i = 0;
  while (i < 4) {
    createId();
    i++;
  }
  return hexMD5(arr.join(','));
}
