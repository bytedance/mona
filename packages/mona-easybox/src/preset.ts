export function preset() {
  Object.defineProperty(document, 'cookie', {
    get: function () {
      return '';
    },
    set: function () {
      return '';
    },
  });
}
