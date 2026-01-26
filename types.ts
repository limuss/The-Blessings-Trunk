
export interface Hamper {
  id: string;
  name: string;
  description: string;
  price: string;
  discountPrice?: string;
  image: string;
  category: string;
  showOnHome: boolean;
  showOnHampers: boolean;
  isSuggested: boolean;
}

export interface Occasion {
  id: string;
  title: string;
  image: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'hero' | 'about' | 'gallery' | 'hamper' | 'occasion';
  uploadedAt: string;
}

export interface SiteSettings {
  phoneNumber: string;
  whatsappNumber: string;
  ownerEmail: string;
  proprietorName: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutQuote: string;
  gasEndpoint?: string; // Google Apps Script URL
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
}
