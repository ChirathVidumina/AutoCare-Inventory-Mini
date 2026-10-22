import type { InventoryItem } from "./inventoryTypes";

// Spring Boot API එක එනතුරු භාවිතා කරන mock data
export const mockInventoryItems: InventoryItem[] = [
  { id: "IT-0010", name: "Tyres", partNumber: "FUSE-30A-030", category: "Tyres", price: 5000, quantity: 10, lowStockAlert: 15 },
  { id: "IT-0015", name: "Clutch cable", partNumber: "EOF-90915", category: "Spare Parts", price: 2500, quantity: 0, lowStockAlert: 5 },
  { id: "IT-0013", name: "Battery", partNumber: "BAT-12V-45A", category: "Electrical", price: 2500, quantity: 50, lowStockAlert: 10 },
  { id: "IT-0011", name: "Rubber Grease", partNumber: "GRS-2KG-011", category: "Consumables", price: 2500, quantity: 25, lowStockAlert: 10 },
  { id: "IT-0019", name: "Bulb", partNumber: "RAD-AL-210", category: "Electrical", price: 2500, quantity: 12, lowStockAlert: 15 },
  { id: "IT-0017", name: "Brake pads", partNumber: "ALT-90A-002", category: "Brakes", price: 2500, quantity: 36, lowStockAlert: 10 },
  { id: "IT-0021", name: "Wire Tape", partNumber: "RLY-12V-005", category: "Electrical", price: 2500, quantity: 0, lowStockAlert: 5 },
];