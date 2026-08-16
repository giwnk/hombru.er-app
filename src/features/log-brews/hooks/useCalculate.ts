export function calculateBrewratio(
  coffeeWeight?: number | null,
  waterWeight?: number | null
): number | null {
  if (!coffeeWeight || coffeeWeight <= 0 || !waterWeight || waterWeight <= 0)
    return null;
  return Number((waterWeight / coffeeWeight).toFixed(1));
}

/**
 * Menghitung rasio Yield : Kopi (1 : X)
 */
export function calculateYieldRatio(
  coffeeWeight?: number | null,
  yieldWeight?: number | null
): number | null {
  if (!coffeeWeight || coffeeWeight <= 0 || !yieldWeight || yieldWeight <= 0)
    return null;
  return Number((yieldWeight / coffeeWeight).toFixed(1));
}

/**
 * Menghitung Extraction Yield % berdasarkan TDS
 * Rumus: (Yield Weight (g) * TDS (%)) / Coffee Weight (g)
 */
export function calculateExtractionYield(
  tds?: number | null,
  yieldWeight?: number | null,
  coffeeWeight?: number | null
): number | null {
  if (!tds || !yieldWeight || !coffeeWeight || coffeeWeight <= 0) return null;
  return Number(((yieldWeight * tds) / coffeeWeight).toFixed(2));
}