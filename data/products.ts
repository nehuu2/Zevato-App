import { Product } from '../types/service';

export const products: Product[] = [
  { id: 'p-1', name: '1.5 Ton 5 Star Split Inverter AC', categoryId: 'ac', brandId: 'daikin', description: 'Dual inverter cooling high efficiency' },
  { id: 'p-2', name: '1.0 Ton 3 Star Window AC', categoryId: 'ac', brandId: 'voltas', description: 'Compact room cooling' },
  { id: 'p-3', name: '260L Frost-Free Double Door Fridge', categoryId: 'refrigerator', brandId: 'lg', description: 'Smart inverter compressor' },
  { id: 'p-4', name: '7.5kg Front Load Washing Machine', categoryId: 'washing-machine', brandId: 'bosch', description: 'EcoSilence drive 1200 RPM' },
  { id: 'p-5', name: 'Grand Plus Mineral RO Water Purifier', categoryId: 'water-purifier', brandId: 'kent', description: 'RO + UV + UF + TDS control' },
  { id: 'p-6', name: '28L Convection Microwave Oven', categoryId: 'microwave', brandId: 'samsung', description: 'Tandoor technology auto-cook' },
];

export default products;
