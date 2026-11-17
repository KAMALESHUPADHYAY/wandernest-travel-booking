export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  phone?: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt?: string;
  _count?: {
    bookings: number;
    wishlists: number;
    reviews: number;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  description: string;
  image: string;
  popular: boolean;
  featured: boolean;
  latitude: number;
  longitude: number;
  createdAt: string;
  _count?: {
    hotels: number;
  };
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  type: string;
  capacity: number;
  bedType: string;
  pricePerNight: number;
  originalPrice?: number | null;
  size?: number | null;
  amenities: string; // JSON string or array
  images: string;
  availableCount: number;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  destinationId: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  starRating: number;
  pricePerNight: number;
  images: string; // JSON string
  amenities: string; // JSON string
  description: string;
  policies?: string | null;
  featured: boolean;
  rooms?: Room[];
  destination?: Destination;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineLogo: string;
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  stops: number;
  price: number;
  cabinClass: string;
  seatAvailability: number;
  featured: boolean;
}

export interface Offer {
  id: string;
  title: string;
  badge: string;
  discountPercent: number;
  promoCode: string;
  description: string;
  imageUrl: string;
  validUntil: string;
  category: string;
  active: boolean;
}
