export enum UserRole {
  OWNER = 'OWNER',
  VET = 'VET'
}

export interface OwnerProfile {
  name: string;
  phone: string;
  address: string;
  lineId: string;
  facebook: string;
  email: string;
  reliabilityScore: number; // 0-100
  noShowCount: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string; // e.g. General, Surgery, Dermatology
  image: string;
}

export interface Pet {
  id: string;
  name: string;
  type: string; // 'Dog' | 'Cat' | 'Bird' | 'Other'
  breed: string;
  sex: 'Male' | 'Female';
  weight: number; // kg
  age: number; // years
  birthday: string; // YYYY-MM-DD
  food: string;
  image: string;
  allergies: string[];
  history: string[];
  ownerName: string;
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  type: 'Medicine' | 'Vaccine' | 'Checkup'; 
  dosage: string;
  frequency: string; // e.g., "Daily", "Twice Daily"
  nextDue: Date;
  confirmed: boolean;
}

export type SeverityLevel = 'CRITICAL' | 'URGENT' | 'ROUTINE';
export type AppointmentType = 'VACCINE' | 'CHECKUP' | 'SURGERY' | 'EMERGENCY' | 'FOLLOWUP' | 'SICK';

export interface Appointment {
  id: string;
  petId: string;
  clinicName: string;
  doctorName?: string;
  date: Date;
  type: AppointmentType;
  severity: SeverityLevel;
  reason: string;
  symptoms?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  prepInstructions?: string[]; // What to bring/do before
  isWalkIn?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  actionLink?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  date: string;
  category: 'Disease' | 'Nutrition' | 'Wellness';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'vet';
  text: string;
  timestamp: Date;
}