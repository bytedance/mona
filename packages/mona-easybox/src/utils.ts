// set template
// not use document.write(code) directly to keep root not change
export function writeTemplate(code: string, root: HTMLElement) {
  // set template
  root.innerHTML = code;

  // get html attributes
  const htmlAttrs: { name: string; value: string }[] = [];
  if (!!DOMParser) {
    const parser = new DOMParser().parseFromString(code, 'text/html');
    const htmlNode = parser.querySelector('html');
    if (htmlNode && htmlNode.attributes) {
      const attrs = [...((htmlNode.attributes as any) || [])];
      attrs.forEach(attr => {
        htmlAttrs.push({ name: attr.name, value: attr.value });
      });
    }
  }

  // append attribute to root
  htmlAttrs.forEach(attr => {
    root.setAttribute(attr.name, attr.value);
  });
}
