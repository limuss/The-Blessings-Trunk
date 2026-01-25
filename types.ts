
export interface Hamper {
  id: string;
  name: string;
  description: string;
  price: string;
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

export interface SiteSettings {
  phoneNumber: string;
  whatsappNumber: string;
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
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
}
