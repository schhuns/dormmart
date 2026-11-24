/**
 * Vietnamese Dong (VND) Currency Formatter
 * Formats price with comma separators and ₫
 * Example: 5000000 -> "5,000,000 ₫", 0 -> "Free / Giveaway"
 */
export const formatVND = (price, { freeText = "Free / Giveaway" } = {}) => {
  const num = Number(price);
  if (isNaN(num) || num === 0) {
    return freeText;
  }
  return `${num.toLocaleString("en-US")} ₫`;
};
