import { LoaderContext } from 'webpack';
import sax from 'sax';
import { urlToRequest, isUrlRequest } from 'loader-utils';

export default async function miniTemplateLoader(this: LoaderContext<any>, source: string) {
  this.cacheable();
  const callback = this.async()!;
  const requests: Set<string> = new Set();

  const loadDependency = (request: string) =>
    new Promise((resolve, reject) => {
      this.addDependency(request);
      this.loadModule(request, (err, src) => {
        if (err) {
          reject(err);
        } else {
          resolve(src);
        }
      });
    });

  const parser = sax.parser(false, { lowercase: true });
  parser.onopentag = ({ name, attributes }) => {
    if (!['import', 'include'].includes(name)) {
      return;
    }
    for (const key in attributes) {
      const value = attributes[key];
      if (value && typeof value === 'string') {
        if (key === 'src' && isUrlRequest(value)) {
          const request = urlToRequest(value);
          requests.add(request);
        }
      }
    }
  };
  parser.onend = async () => {
    try {
      const list: any[] = [];
      Array.from(requests).forEach(req => {
        list.push(loadDependency(req));
      });
      await Promise.all(list);
      callback(null, source);
    } catch (error) {
      callback(error as Error, source);
    }
  };
  parser.write(`<root>${source}</root>`).close();
}
