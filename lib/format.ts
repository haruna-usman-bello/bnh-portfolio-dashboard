const ngnFormatter = new Intl.NumberFormat("en-NG", {
  currency: "NGN",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  style: "currency",
});

const numberFormatter = new Intl.NumberFormat("en-NG", {
  maximumFractionDigits: 2,
});

export function formatNgn(value: { toString(): string } | number): string {
  return ngnFormatter.format(Number(value));
}

export function formatNumber(value: { toString(): string } | number): string {
  return numberFormatter.format(Number(value));
}
