export interface FuelLog {
  id: string;
  date: string;
  odometer: number;
  liters: number;
  totalPrice: number;
  pricePerLiter?: number;
  kmPerLiter?: number;
  distance?: number;
}

export interface TripLog {
  id: string;
  date: string;
  distance: number;
  earnings: number;
  odometer?: number;
}

export type Log = (FuelLog & { type: 'fuel' }) | (TripLog & { type: 'trip' });

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
