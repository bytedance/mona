export function getTmpComponentData(value: Record<string, any>) {
  if (!value) return '';
  const keysOfValue = Object.keys(value);
  if (!Array.isArray(keysOfValue)) return '';

  let res: Array<{
    componentId: string;
    componentVersion: string;
  }> = [];

  value.forEach((key: { component_id: any; version: any }) => {
    const item = {
      componentId: key.component_id,
      componentVersion: key.version,
    };
    res.push(item);
  });
  return JSON.stringify(res);
}
