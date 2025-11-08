export interface Rental {
  id: string;
  date: string;
  userId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentalRequest {
  date: string;
}

export interface DeleteRentalRequest {
  date: string;
}

export interface RentalsResponse {
  success: boolean;
  rentals?: Rental[];
  error?: string;
}

export interface CreateRentalResponse {
  success: boolean;
  rental?: Rental;
  error?: string;
}

export interface DeleteRentalResponse {
  success: boolean;
  error?: string;
}
