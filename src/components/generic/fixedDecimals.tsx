export function fixedDecimals(value: number, decimals: number = 2) {
  const f = Math.pow(10, decimals);
  return (Math.round(value * f) / f).toLocaleString("en-us", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
