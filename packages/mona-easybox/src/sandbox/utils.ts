export function hasOwn(target: any, prop: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(target, prop);
}


const __func_bind__ = Symbol.for('mona_func_bind');
export function bindContext(value: any, context: any) {
  if (typeof value === 'function') {
    // get bind function from cache
    if (hasOwn(value, __func_bind__)) {
      return value[__func_bind__]
    }

    return value[__func_bind__] = value.bind(context);
  }

  // FIX: hanle some spec cases
  return value;
}
