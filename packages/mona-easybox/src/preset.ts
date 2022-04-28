export function preset() {
  Object.defineProperty(document, 'cookie', {
    get: function () {
      return '';
    },
    set: function () {
      return '';
    },
  });

  Object.defineProperty(document, 'defaultView', {
    get: function () {
      return window.__mona_easy_box.global;
    },
    set: function () {
      return window.__mona_easy_box.global;
    },
  });
}
