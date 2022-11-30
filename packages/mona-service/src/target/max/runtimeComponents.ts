type IMap = { [key: string]: string };
function mapComponentToMaxRuntime(obj: IMap) {
  const result: IMap = {};
  Object.keys(obj).forEach(key => {
    result[key] = `@bytedance/mona-runtime++${obj[key]}`
  })

  return result;
}

export default mapComponentToMaxRuntime({
  // 'canvas': 'Canvas'
})