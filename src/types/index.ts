// Product type definitions for ORA luxury jewellery e-commerce

export type Category = 'rings' | 'earrings' | 'necklaces' | 'bracelets';
export type Occasion = 'everyday' | 'office' | 'party' | 'gifting' | 'anniversary' | 'valentine';
export type Material = 'gold' | 'silver' | 'platinum' | 'rose-gold' | 'white-gold';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: Category;
  occasion: Occasion[];
  material: Material;
  image: string;
  hoverImage?: string;
  description: string;
  careInstructions: string;
  trustBadges: string[];
  isNew?: boolean;
  discount?: number;
  rating?: number;
  reviews?: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
}

export interface GiftingCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}
