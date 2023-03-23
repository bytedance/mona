module.exports = {
  exact: (list: string[]) => list.filter(m => m.match(/^[^*!]+$/)),
  contain: (list: string[]) =>
    list.filter(m => m.match(/^\*.+\*$/)).map(m => m.substr(1, m.length - 2)),
  endWith: (list: string[]) => list.filter(m => m.match(/^\*[^*]+$/)).map(m => m.substr(1)),
  startWith: (list: string[]) =>
    list.filter(m => m.match(/^[^*!]+\*$/)).map(m => m.substr(0, m.length - 1)),
  notExact: (list: string[]) =>
    list.filter(m => m.match(/^![^*].*$/)).map(m => m.substr(1)),
  notContain: (list: string[]) =>
    list.filter(m => m.match(/^!\*.+\*$/)).map(m => m.substr(2, m.length - 3)),
  notEndWith: (list: string[]) =>
    list.filter(m => m.match(/^!\*[^*]+$/)).map(m => m.substr(2)),
  notStartWith: (list: string[]) =>
    list.filter(m => m.match(/^![^*]+\*$/)).map(m => m.substr(1, m.length - 2))
};