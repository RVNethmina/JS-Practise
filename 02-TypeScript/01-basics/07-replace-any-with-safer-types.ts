/**
 * 01-basics — Problem 7: Replace any with safer types
 *
 * Remove every `any` below without changing behaviour. Define proper types
 * for a cart item, a coupon, and receipt data. The coupon `type` field must
 * be a union of literals, not `string`.
 *
 * Must compile:
 * - a correct end-to-end call: build items, total them, apply a coupon,
 *   format the receipt
 *
 * Must be rejected:
 * - an item missing `quantity`
 * - a coupon with a `type` that isn't in your union
 * - passing the item array straight into formatReceipt
 *
 * Answer without looking once done: which of the three `any`s was the most
 * dangerous, and why?
 *
 * Theory: TS-Vault/01-basics/any, unknown, never, void.md
 *         TS-Vault/01-basics/Object Types.md
 */

function calculateTotal(items: any): any {
  let total: any = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}

function applyCoupon(total: any, coupon: any): any {
  if (coupon.type === "percentage") {
    return total - total * (coupon.value / 100);
  }
  return total - coupon.value;
}

function formatReceipt(data: any): any {
  return `${data.customer}: ${data.total.toFixed(2)}`;
}

export {};
