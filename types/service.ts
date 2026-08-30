export interface Category {
  id: string;
  name: string;
  icon: string;
  iconFamily?: 'Ionicons' | 'MaterialCommunityIcons' | 'Feather';
  description: string;
  popular?: boolean;
  itemCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  categories: string[];
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  brandId: string;
  model?: string;
  image?: string;
  description: string;
}

export interface ServiceOption {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  features: string[];
  included: string[];
  excluded: string[];
  warrantyDays: number;
  isPopular?: boolean;
}

export interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}
