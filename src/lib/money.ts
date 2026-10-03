/**
 * Money formatting and calculations in pence (£)
 */

export function formatMoney(pence: number, showDecimals: boolean = true): string {
  const pounds = pence / 100;
  if (!showDecimals && pence % 100 === 0) {
    return `£${pounds.toLocaleString('en-GB')}`;
  }
  return `£${pounds.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateVat(totalPence: number): number {
  // 20% UK VAT included: VAT = total - (total / 1.2)
  return Math.round(totalPence - totalPence / 1.2);
}
