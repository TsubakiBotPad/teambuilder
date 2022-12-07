export function leftPad(num: number, size: number) {
  var s = String(num);
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}
