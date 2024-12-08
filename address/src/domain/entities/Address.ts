import { AddressType } from '../enums/AddressType';

export interface Address {
  address_id?: string;
  user_id: string;
  street: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: AddressType;
  latitude: number;
  longitude: number;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}
