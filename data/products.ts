import { Product } from '../types/service';

export const products: Product[] = [
  // Air Conditioners
  { id: 'p-ac-1', name: '1.5 Ton 5 Star Split Inverter AC', categoryId: 'ac', brandId: 'daikin', model: 'FTKF50TV', description: 'Dual inverter cooling with copper condenser and PM 2.5 filter' },
  { id: 'p-ac-2', name: '1.0 Ton 3 Star Window AC', categoryId: 'ac', brandId: 'voltas', model: '123V CZT', description: 'Turbo cooling with anti-dust filter and high ambient cooling' },
  { id: 'p-ac-3', name: '1.5 Ton 5 Star AI Dual Inverter AC', categoryId: 'ac', brandId: 'lg', model: 'RS-Q19YNZE', description: 'Super convertible 6-in-1 with AI dual inverter' },
  { id: 'p-ac-4', name: '1.5 Ton 3 Star WindFree AC', categoryId: 'ac', brandId: 'samsung', model: 'AR18CY3ZAWK', description: 'WindFree cooling with convertible 5-in-1 modes' },
  { id: 'p-ac-5', name: '1.5 Ton 3 Star Wi-Fi Inverter AC', categoryId: 'ac', brandId: 'panasonic', model: 'CS/CU-NU18YKYW', description: 'Miraie IoT enabled with shield blu anti-corrosion' },

  // Refrigerators
  { id: 'p-ref-1', name: '260L Smart Inverter Double Door', categoryId: 'refrigerator', brandId: 'lg', model: 'GL-S292RDSY', description: 'Multi air flow cooling with smart inverter compressor' },
  { id: 'p-ref-2', name: '253L Digital Inverter Double Door', categoryId: 'refrigerator', brandId: 'samsung', model: 'RT28C3052S8', description: 'All-around cooling with toughened glass shelves' },
  { id: 'p-ref-3', name: '240L Frost-Free Triple Door', categoryId: 'refrigerator', brandId: 'whirlpool', model: 'FP 263D Protton', description: 'Active fresh zone with zeolite technology' },
  { id: 'p-ref-4', name: '340L Inverter Frost-Free Fridge', categoryId: 'refrigerator', brandId: 'voltas', model: 'RFF3533', description: 'Dual cooling technology with moisture retaining crisper' },

  // Washing Machines
  { id: 'p-wm-1', name: '7.5kg EcoSilence Front Load', categoryId: 'washing-machine', brandId: 'bosch', model: 'WAJ24266IN', description: '1200 RPM anti-tangle with ActiveWater Plus' },
  { id: 'p-wm-2', name: '7.0kg 5 Star AI EcoBubble Front Load', categoryId: 'washing-machine', brandId: 'samsung', model: 'WW70T502NAN', description: 'AI control with hygiene steam cycle' },
  { id: 'p-wm-3', name: '8.0kg TurboWash 360 Front Load', categoryId: 'washing-machine', brandId: 'lg', model: 'FHM1208Z4W', description: 'Direct drive inverter with 6 motion technology' },
  { id: 'p-wm-4', name: '6.5kg Aqua Energie Front Load', categoryId: 'washing-machine', brandId: 'ifb', model: 'Diva Aqua SX', description: 'Triadic pulsator with cradle wash for delicates' },
  { id: 'p-wm-5', name: '7.5kg Stainwash Ultra Top Load', categoryId: 'washing-machine', brandId: 'whirlpool', model: 'Stainwash Ultra', description: 'Hard water wash with in-built heater' },

  // Microwave Ovens
  { id: 'p-mw-1', name: '28L Slim Fry Convection Oven', categoryId: 'microwave', brandId: 'samsung', model: 'MC28A5145VK', description: 'Tandoor & curd making with ceramic enamel cavity' },
  { id: 'p-mw-2', name: '32L Charcoal Convection Oven', categoryId: 'microwave', brandId: 'lg', model: 'MJEN326PK', description: 'Charcoal lighting heater with diet fry feature' },
  { id: 'p-mw-3', name: '30L Steam Clean Convection', categoryId: 'microwave', brandId: 'ifb', model: '30BRC2', description: 'Fermentation mode with motorized rotisserie' },
  { id: 'p-mw-4', name: '25L Zero Oil Convection Oven', categoryId: 'microwave', brandId: 'panasonic', model: 'NN-CT353BFDG', description: 'Auto cook menus with express defrost' },
  { id: 'p-mw-5', name: '29L Magicook Convection Oven', categoryId: 'microwave', brandId: 'whirlpool', model: 'Magicook Pro', description: 'Calorie meter with 300 auto cook menus' },

  // Water Purifiers
  { id: 'p-wp-1', name: 'Grand Plus Mineral RO Water Purifier', categoryId: 'water-purifier', brandId: 'kent', model: 'Grand Plus', description: 'RO + UV + UF + TDS control with 9L storage tank' },
  { id: 'p-wp-2', name: 'Active Copper Maxx UV+UF Purifier', categoryId: 'water-purifier', brandId: 'aquaguard', model: 'Active Copper', description: 'Copper ionic infusion with mineral guard technology' },
  { id: 'p-wp-3', name: 'Digitouch Alkaline RO Purifier', categoryId: 'water-purifier', brandId: 'havells', model: 'Digitouch Alkaline', description: 'pH balancing with touch dispensing interface' },

  // Kitchen Chimneys
  { id: 'p-ch-1', name: '60cm 1200 m³/hr Autoclean Chimney', categoryId: 'chimney', brandId: 'fabor', model: 'Hood Orient X', description: 'Gesture control with thermal auto-clean technology' },
  { id: 'p-ch-2', name: '60cm 1100 m³/hr Baffle Filter Chimney', categoryId: 'chimney', brandId: 'bosch', model: 'Serie 4 DWP64BC50I', description: 'Low noise blower with stainless steel baffle filter' },

  // Smart TV / LED
  { id: 'p-tv-1', name: '55-inch 4K OLED Smart TV', categoryId: 'television', brandId: 'lg', model: 'OLED55C3PSA', description: 'α9 Gen6 AI processor with Dolby Vision & Atmos' },
  { id: 'p-tv-2', name: '50-inch Crystal 4K UHD Smart TV', categoryId: 'television', brandId: 'samsung', model: '50CU7700', description: 'PurColor display with Knox security & OTS Lite' },
  { id: 'p-tv-3', name: '55-inch 4K Google TV LED', categoryId: 'television', brandId: 'panasonic', model: 'TH-55MX740DX', description: '4K colour engine with Hexa Chroma Drive' },
  { id: 'p-tv-4', name: '43-inch Full HD Smart Android TV', categoryId: 'television', brandId: 'havells', model: 'Havells Vision 43', description: 'Bezel-less IPS panel with surround stereo sound' },

  // Water Geysers
  { id: 'p-gy-1', name: '15L 5 Star Storage Geyser', categoryId: 'geyser', brandId: 'havells', model: 'Monza EC 15L', description: 'Feroglas coated inner tank with Incoloy heating element' },
];

export default products;
