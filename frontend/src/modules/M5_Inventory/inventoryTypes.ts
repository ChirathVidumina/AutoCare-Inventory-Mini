// Inventory item එකක තියෙන data වල හැඩය (shape)
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface InventoryItem {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  price: number;
  quantity: number;
  lowStockAlert: number;
}

// Status නිර්ණය කරන rule එක:
// quantity 0 -> Out of Stock
// quantity <= lowStockAlert -> Low Stock
// ඉතිරි -> In Stock
export function getStockStatus(item: InventoryItem): StockStatus {
  if (item.quantity <= 0) return "out-of-stock";
  if (item.quantity <= item.lowStockAlert) return "low-stock";
  return "in-stock";
}