
export enum ListingType {
  Individual = 'Individual',
  Business = 'Business',
}

export interface Profile {
  id: number;
  userId?: string;
  type: ListingType.Individual;
  name: string;
  role: string;
  summary: string;
  avatarUrl: string;
  linkedInUrl: string;
}

export interface Business {
  id: number;
  type: ListingType.Business;
  name:string;
  category: string;
  description: string;
  logoUrl: string;
  contactEmail: string;
}

export type Listing = Profile | Business;

export interface User {
  id: string; // Changed to string for Firebase UID
  name: string;
  email: string;
}

export interface Credentials {
  email: string;
  password?: string;
}

export interface SignupData extends Credentials {
    name: string;
}