import type { Product, OrderItem, FarmerApplication, UserData } from './types';
import tomatoImage from './assets/tomato.jpg';
import mangoImage from './assets/mango.jpg';
import grainImage from './assets/grain.jpg';
import eggImage from './assets/eggs.webp';
import lettuceImage from './assets/lettuce.jpg';
import bananaImage from './assets/banana.jpg';

// Sample Data
export const sampleProducts: Product[] = [
  { id: 1, name: 'Organic Tomatoes', price: 85, unit: 'kg', seller: 'Juan dela Cruz', location: 'Cebu City', stock: 50, image: tomatoImage, category: 'Vegetables' },
  { id: 2, name: 'Fresh Mangoes', price: 120, unit: 'kg', seller: 'Maria Santos', location: 'Davao', stock: 30, image: mangoImage, category: 'Fruits' },
  { id: 3, name: 'Brown Rice', price: 65, unit: 'kg', seller: 'Pedro Reyes', location: 'Nueva Ecija', stock: 100, image: grainImage, category: 'Grains' },
  { id: 4, name: 'Fresh Eggs', price: 180, unit: 'tray', seller: 'Ana Garcia', location: 'Laguna', stock: 25, image: eggImage, category: 'Poultry' },
  { id: 5, name: 'Organic Lettuce', price: 75, unit: 'kg', seller: 'Jose Cruz', location: 'Baguio', stock: 40, image: lettuceImage, category: 'Vegetables' },
  { id: 6, name: 'Bananas', price: 45, unit: 'kg', seller: 'Rosa Mendoza', location: 'Mindanao', stock: 80, image: bananaImage, category: 'Fruits' },
];

export const farmerOrders: OrderItem[] = [
  { id: '#ORD-001', buyer: 'Maria Santos', product: 'Organic Tomatoes', qty: '10 kg', status: 'Pending', amount: '₱850' },
  { id: '#ORD-002', buyer: 'Pedro Reyes', product: 'Fresh Mangoes', qty: '5 kg', status: 'Confirmed', amount: '₱600' },
  { id: '#ORD-003', buyer: 'Ana Garcia', product: 'Organic Lettuce', qty: '8 kg', status: 'Delivered', amount: '₱600' },
];

export const buyerOrders: OrderItem[] = [
  { id: '#ORD-105', farmer: 'Juan dela Cruz', product: 'Organic Tomatoes', items: 'Organic Tomatoes × 5kg', date: 'Feb 14, 2026', status: 'In Transit', amount: '₱425' },
  { id: '#ORD-104', farmer: 'Rosa Mendoza', product: 'Bananas', items: 'Bananas × 10kg', date: 'Feb 13, 2026', status: 'Delivered', amount: '₱450' },
  { id: '#ORD-103', farmer: 'Jose Cruz', product: 'Organic Lettuce', items: 'Organic Lettuce × 3kg', date: 'Feb 12, 2026', status: 'Delivered', amount: '₱225' },
];

export const pendingFarmers: FarmerApplication[] = [
  { name: 'Carlos Hernandez', location: 'Iloilo', products: 'Rice, Corn', date: 'Feb 14, 2026' },
  { name: 'Linda Aquino', location: 'Pangasinan', products: 'Vegetables', date: 'Feb 14, 2026' },
  { name: 'Ramon Diaz', location: 'Batangas', products: 'Fruits', date: 'Feb 13, 2026' },
];

export const users: UserData[] = [
  { name: 'Juan dela Cruz', type: 'Farmer', location: 'Cebu City', status: 'Active' },
  { name: 'Maria Santos', type: 'Buyer', location: 'Davao', status: 'Active' },
  { name: 'Pedro Reyes', type: 'Farmer', location: 'Nueva Ecija', status: 'Active' },
  { name: 'Ana Garcia', type: 'Buyer', location: 'Laguna', status: 'Suspended' },
  { name: 'Hon. Roberto Gomez', type: 'Barangay Official', location: 'San Jose, Cebu', status: 'Active' },
  { name: 'Engr. Alicia Torres', type: 'LGU Official', location: 'Cebu City Hall', status: 'Active' },
];
