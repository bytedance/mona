export function hide(element: string) {
  const container = document.getElementById(element);
  container && document.body.removeChild(container);
}