export type Gender = 'Male' | 'Female' | 'Unknown';
export type Status = 'Available' | 'Sold' | 'Breeder';
export type SortOption = 'dateDesc' | 'dateAsc' | 'priceDesc' | 'priceAsc';

export interface Morph {
  id: string;
  ko: string;
  en: string;
  order: number; // 정렬 순서 필드 추가
}

export interface SiteSettings {
  landingImageUrl: string;
}

export interface Gecko {
  id: string;
  name: string;
  morphId: string; // ID of the Morph object
  morphName?: string; // Fallback for old data
  gender: Gender;
  hatchDate: string;
  price: number;
  status: Status;
  description: string;
  photos: string[];
  sireId?: string;
  damId?: string;
}

export type Language = 'ko' | 'en';

export interface Translation {
  title: string;
  forSale: string;
  parents: string;
  soldOut: string;
  adminMode: string;
  addGecko: string;
  manageMorphs: string;
  setAsMain: string;
  edit: string;
  delete: string;
  morph: string;
  gender: string;
  hatchDate: string;
  price: string;
  sire: string;
  dam: string;
  status: string;
  all: string;
  filterBy: string;
  male: string;
  female: string;
  unsexed: string;
  unknown: string;
  save: string;
  cancel: string;
  available: string;
  sold: string;
  breeder: string;
  viewDetails: string;
  back: string;
  address: string;
  getDirections: string;
  instagram: string;
  auctionBand: string;
  premiumBand: string;
  kakaoChat: string;
  sortBy: string;
  dateDesc: string;
  dateAsc: string;
  priceDesc: string;
  priceAsc: string;
  quickJump: string;
}