/**
 * Vietnamese Dong (VND) Currency Formatter
 * Formats price in Vietnamese standard notation with ₫
 * Example: 50000 -> "50.000 ₫", 0 -> "Free / Giveaway"
 */
export const formatVND = (price, { freeText = "Free / Giveaway" } = {}) => {
  const num = Number(price);
  if (isNaN(num) || num === 0) {
    return freeText;
  }
  return `${num.toLocaleString("vi-VN")} ₫`;
};
