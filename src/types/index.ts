// types/index.ts
export interface Teacher {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  status: 'active' | 'inactive' | 'pending';
  qualifications?: Qualification[];
  schedule?: Schedule;
}

export interface Qualification {
  id: string;
  name: string;
  rate: number;
  currency: string;
  type: 'private' | 'group';
  description?: string;
  requirements?: string[];
  isActive: boolean;
}

export interface TimeSlot {
  id: string;
  day: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  status: 'available' | 'booked' | 'unavailable';
  studentName?: string;
  subject?: string;
  notes?: string;
}

export interface Schedule {
  teacherId: string;
  slots: TimeSlot[];
  weekStartDate: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  subItems?: NavItem[];
}

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    message?: string;
  };
  options?: { value: string; label: string }[];
}

export interface FormErrors {
  [key: string]: string;
}

export interface CalendarProps {
  schedule: Schedule;
  onSlotClick: (slot: TimeSlot) => void;
  onSlotUpdate: (slot: TimeSlot) => void;
  readonly?: boolean;
}

export type ViewMode = 'week' | 'month' | 'day';

export interface CalendarViewProps {
  viewMode: ViewMode;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

