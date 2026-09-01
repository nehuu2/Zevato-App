import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    id: 'ac',
    name: 'Air Conditioner',
    icon: 'snow-outline',
    iconFamily: 'Ionicons',
    description: 'Split, Window, Inverter AC service & deep cleaning',
    popular: true,
    itemCount: 12,
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    icon: 'cube-outline',
    iconFamily: 'Ionicons',
    description: 'Single, Double Door, Side-by-side cooling repair',
    popular: true,
    itemCount: 8,
  },
  {
    id: 'washing-machine',
    name: 'Washing Machine',
    icon: 'shirt-outline',
    iconFamily: 'Ionicons',
    description: 'Front load, Top load, Semi-automatic repairs',
    popular: true,
    itemCount: 10,
  },
  {
    id: 'microwave',
    name: 'Microwave Oven',
    icon: 'flame-outline',
    iconFamily: 'Ionicons',
    description: 'Solo, Grill, Convection heating issues',
    popular: false,
    itemCount: 6,
  },
  {
    id: 'water-purifier',
    name: 'Water Purifier',
    icon: 'water-outline',
    iconFamily: 'Ionicons',
    description: 'RO, UV, Alkaline filter replacement & servicing',
    popular: true,
    itemCount: 9,
  },
  {
    id: 'chimney',
    name: 'Kitchen Chimney',
    icon: 'funnel-outline',
    iconFamily: 'Ionicons',
    description: 'Deep degreasing, motor check & duct cleaning',
    popular: false,
    itemCount: 5,
  },
  {
    id: 'television',
    name: 'Smart TV / LED',
    icon: 'tv-outline',
    iconFamily: 'Ionicons',
    description: 'Screen repair, motherboard, wall mounting',
    popular: false,
    itemCount: 7,
  },
  {
    id: 'geyser',
    name: 'Water Geyser',
    icon: 'thermometer-outline',
    iconFamily: 'Ionicons',
    description: 'Instant, Storage, Solar geyser element repair',
    popular: false,
    itemCount: 4,
  },
];

const brands = [
  { id: 'lg', name: 'LG', categories: ['ac', 'refrigerator', 'washing-machine', 'microwave', 'television'] },
  { id: 'samsung', name: 'Samsung', categories: ['ac', 'refrigerator', 'washing-machine', 'microwave', 'television'] },
  { id: 'daikin', name: 'Daikin', categories: ['ac'] },
  { id: 'voltas', name: 'Voltas', categories: ['ac', 'refrigerator'] },
  { id: 'whirlpool', name: 'Whirlpool', categories: ['refrigerator', 'washing-machine', 'microwave'] },
  { id: 'bosch', name: 'Bosch', categories: ['washing-machine', 'chimney'] },
  { id: 'ifb', name: 'IFB', categories: ['washing-machine', 'microwave'] },
  { id: 'kent', name: 'Kent RO', categories: ['water-purifier'] },
  { id: 'aquaguard', name: 'Aquaguard', categories: ['water-purifier'] },
  { id: 'havells', name: 'Havells', categories: ['geyser', 'water-purifier', 'television'] },
  { id: 'fabor', name: 'Faber', categories: ['chimney'] },
  { id: 'panasonic', name: 'Panasonic', categories: ['ac', 'television', 'microwave'] },
];

const products = [
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

const serviceOptions = [
  // AC Services
  {
    id: 'ac-foam-jet',
    categoryId: 'ac',
    title: 'Power Jet AC Deep Cleaning',
    description: 'High-pressure foam jet cleaning for indoor and outdoor units, enhancing cooling & air quality.',
    duration: '45 - 60 mins',
    price: 499,
    originalPrice: 799,
    rating: 4.88,
    reviewCount: 3420,
    features: JSON.stringify(['2x deeper cleaning with foam jet', 'Free cooling check & amp reading', 'Drain tray & pipe cleaning']),
    included: JSON.stringify(['Indoor coil foam wash', 'Outdoor unit jet spray', 'Filter mesh disinfection', 'Pre & post-service performance check']),
    excluded: JSON.stringify(['Gas refilling / top-up', 'Spare part replacements']),
    warrantyDays: 30,
    isPopular: true,
  },
  {
    id: 'ac-repair',
    categoryId: 'ac',
    title: 'AC Diagnosis & Repair',
    description: 'Comprehensive troubleshooting for cooling issues, water leakage, noise, or electrical faults.',
    duration: '60 - 90 mins',
    price: 299,
    originalPrice: 499,
    rating: 4.75,
    reviewCount: 1890,
    features: JSON.stringify(['Complete PCB & motor testing', 'Gas leak detection test', 'Exact quotation before repair']),
    included: JSON.stringify(['Inspection & diagnosis', 'Labor for basic fixes', '30-day service warranty']),
    excluded: JSON.stringify(['Cost of spare parts', 'Refrigerant gas']),
    warrantyDays: 30,
    isPopular: false,
  },
  {
    id: 'ac-gas-refill',
    categoryId: 'ac',
    title: 'Complete Gas Leak Fix & Refill',
    description: 'Full system leak test, brazing/soldering, vacuumization, and 100% pure refrigerant gas charging.',
    duration: '90 - 120 mins',
    price: 1899,
    originalPrice: 2499,
    rating: 4.91,
    reviewCount: 1120,
    features: JSON.stringify(['Nitrogen leak pressure test', 'Certified pure R32/R410A gas', 'Guaranteed cooling restoration']),
    included: JSON.stringify(['Nitrogen pressure testing', 'Leak braze/repair', 'Full refrigerant charge', '60-day gas warranty']),
    excluded: JSON.stringify(['Compressor replacement']),
    warrantyDays: 60,
    isPopular: false,
  },
  {
    id: 'ac-install',
    categoryId: 'ac',
    title: 'AC Installation / Uninstallation',
    description: 'Safe mounting, copper pipe routing, vibration isolation, and test run by certified pros.',
    duration: '90 - 120 mins',
    price: 799,
    originalPrice: 1199,
    rating: 4.82,
    reviewCount: 940,
    features: JSON.stringify(['Laser-level mounting', 'Core drilling & bracket setting', 'Vacuum and leak check']),
    included: JSON.stringify(['Indoor & outdoor unit mounting', 'Wiring connection', 'Performance testing']),
    excluded: JSON.stringify(['Copper pipe materials (>3m)', 'Outdoor wall stand/bracket']),
    warrantyDays: 30,
    isPopular: false,
  },

  // Refrigerator Services
  {
    id: 'fridge-checkup',
    categoryId: 'refrigerator',
    title: 'Fridge Complete Health Checkup',
    description: 'Thorough inspection of compressor, thermostat, defrost timer, fan motor, and door gaskets.',
    duration: '45 mins',
    price: 249,
    originalPrice: 399,
    rating: 4.8,
    reviewCount: 840,
    features: JSON.stringify(['Defrost cycle testing', 'Thermostat temperature audit', 'Gasket seal tightness check']),
    included: JSON.stringify(['Full multi-point diagnosis', 'Free minor adjustments']),
    excluded: JSON.stringify(['Parts replacement']),
    warrantyDays: 30,
    isPopular: true,
  },
  {
    id: 'fridge-repair',
    categoryId: 'refrigerator',
    title: 'Cooling & Electrical Repair',
    description: 'Fixing not cooling, ice buildup, water leakage, or buzzing compressor noise.',
    duration: '60 - 90 mins',
    price: 399,
    originalPrice: 599,
    rating: 4.78,
    reviewCount: 1200,
    features: JSON.stringify(['Genuine OEM spare parts', 'Defrost heater & sensor replacement', '90-day parts warranty']),
    included: JSON.stringify(['Labor & repair diagnosis', 'Post-repair cooling validation']),
    excluded: JSON.stringify(['Cost of parts']),
    warrantyDays: 30,
    isPopular: false,
  },

  // Washing Machine Services
  {
    id: 'wm-deep-clean',
    categoryId: 'washing-machine',
    title: 'Drum Descaling & Deep Cleaning',
    description: 'Removal of lint, scale buildup, and odors.',
    duration: '60 mins',
    price: 399,
    originalPrice: 599,
    rating: 4.85,
    reviewCount: 1540,
    features: JSON.stringify(['Descaling agent treatment', 'Filter cleaning', 'Drain pump audit']),
    included: JSON.stringify(['Drum sanitization', 'Scale wash']),
    excluded: JSON.stringify(['Parts replacement']),
    warrantyDays: 30,
    isPopular: true,
  },
  {
    id: 'wm-repair',
    categoryId: 'washing-machine',
    title: 'Motor, PCB & Drain Repair',
    description: 'Diagnosis of spin failure, vibration, error codes, and water filling issues.',
    duration: '60 - 90 mins',
    price: 349,
    originalPrice: 499,
    rating: 4.79,
    reviewCount: 980,
    features: JSON.stringify(['Belt & clutch check', 'Sensor calibration', 'Inlet valve testing']),
    included: JSON.stringify(['Inspection & basic fixes']),
    excluded: JSON.stringify(['Cost of spare parts']),
    warrantyDays: 30,
    isPopular: false,
  },

  // Water Purifier
  {
    id: 'wp-service',
    categoryId: 'water-purifier',
    title: 'RO + UV Complete Servicing',
    description: 'Filter cleaning, membrane flushing, and TDS check.',
    duration: '45 mins',
    price: 299,
    originalPrice: 499,
    rating: 4.89,
    reviewCount: 2100,
    features: JSON.stringify(['Digital TDS measurement', 'Booster pump pressure test', 'Sanitization']),
    included: JSON.stringify(['Membrane flush', 'Full system diagnosis']),
    excluded: JSON.stringify(['Sediment / Carbon filter candles']),
    warrantyDays: 30,
    isPopular: true,
  },

  // Microwave
  {
    id: 'mw-repair',
    categoryId: 'microwave',
    title: 'Microwave Heating & Turntable Fix',
    description: 'Magnetron testing, high voltage diode replacement, and turntable motor repair.',
    duration: '45 mins',
    price: 299,
    originalPrice: 449,
    rating: 4.76,
    reviewCount: 650,
    features: JSON.stringify(['Radiation leakage test', 'Magnetron test', 'Door safety interlock check']),
    included: JSON.stringify(['Diagnosis & basic fixes']),
    excluded: JSON.stringify(['Magnetron replacement cost']),
    warrantyDays: 30,
    isPopular: true,
  },

  // Chimney
  {
    id: 'ch-clean',
    categoryId: 'chimney',
    title: 'Chimney Baffle Deep Degreasing',
    description: 'High pressure caustic degreasing of baffle filters and blower assembly.',
    duration: '60 - 75 mins',
    price: 499,
    originalPrice: 799,
    rating: 4.83,
    reviewCount: 780,
    features: JSON.stringify(['Industrial degreasing dip', 'Suction speed measurement', 'Oil collector clean']),
    included: JSON.stringify(['Filter wash', 'Hood polishing']),
    excluded: JSON.stringify(['Duct pipe replacement']),
    warrantyDays: 30,
    isPopular: true,
  },

  // Television
  {
    id: 'tv-mount',
    categoryId: 'television',
    title: 'Smart TV Wall Mounting & Setup',
    description: 'Precision mounting, HDMI cabling, soundbar sync, and app config.',
    duration: '45 mins',
    price: 349,
    originalPrice: 499,
    rating: 4.88,
    reviewCount: 910,
    features: JSON.stringify(['Laser leveled bracket setting', 'Cable concealment', 'Wi-Fi connection']),
    included: JSON.stringify(['Standard mounting']),
    excluded: JSON.stringify(['Heavy-duty swivel brackets']),
    warrantyDays: 30,
    isPopular: true,
  },

  // Geyser
  {
    id: 'gy-service',
    categoryId: 'geyser',
    title: 'Geyser Tank Descaling & Heating Check',
    description: 'Heating element scale removal, thermostat calibration, and pressure valve test.',
    duration: '45 - 60 mins',
    price: 349,
    originalPrice: 499,
    rating: 4.81,
    reviewCount: 520,
    features: JSON.stringify(['Magnesium anode inspection', 'Safety valve test', 'Scale removal']),
    included: JSON.stringify(['Inspection and descaling labor']),
    excluded: JSON.stringify(['Heating coil cost']),
    warrantyDays: 30,
    isPopular: true,
  },
];

const technicians = [
  {
    id: 'tech-101',
    name: 'Rajesh Sharma',
    phone: '+91 98765 12345',
    rating: 4.9,
    completedJobs: 420,
    experienceYears: 6,
    specialization: 'Appliance Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    currentLatitude: 28.4595,
    currentLongitude: 77.0266,
    available: true,
  },
  {
    id: 'tech-102',
    name: 'Suresh Patil',
    phone: '+91 98765 67890',
    rating: 4.85,
    completedJobs: 310,
    experienceYears: 5,
    specialization: 'RO & Water Purifiers',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    currentLatitude: 28.4625,
    currentLongitude: 77.0312,
    available: true,
  },
  {
    id: 'tech-103',
    name: 'Amit Verma',
    phone: '+91 98111 22334',
    rating: 4.88,
    completedJobs: 380,
    experienceYears: 4,
    specialization: 'Washing Machine Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    currentLatitude: 28.4512,
    currentLongitude: 77.0289,
    available: true,
  },
];

async function seed() {
  console.log('🌱 Seeding Zevota Database...');

  // Seed Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }
  console.log(`✅ Seeded ${categories.length} Categories`);

  // Seed Brands
  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { id: brand.id },
      update: {
        name: brand.name,
        categories: JSON.stringify(brand.categories),
      },
      create: {
        id: brand.id,
        name: brand.name,
        categories: JSON.stringify(brand.categories),
      },
    });
  }
  console.log(`✅ Seeded ${brands.length} Brands`);

  // Seed Products
  for (const prod of products) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: prod,
      create: prod,
    });
  }
  console.log(`✅ Seeded ${products.length} Products`);

  // Seed Service Options
  for (const srv of serviceOptions) {
    await prisma.serviceOption.upsert({
      where: { id: srv.id },
      update: srv,
      create: srv,
    });
  }
  console.log(`✅ Seeded ${serviceOptions.length} Service Packages`);

  // Seed Technicians
  for (const tech of technicians) {
    await prisma.technician.upsert({
      where: { id: tech.id },
      update: tech,
      create: tech,
    });
  }
  console.log(`✅ Seeded ${technicians.length} Technicians`);

  console.log('🎉 Database seeding complete!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
