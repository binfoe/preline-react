export function uid() {
  return `${Date.now().toString(32)}.${Math.floor(Math.random() * 0xffffff).toString(32)}`;
}
