
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  BRANCH_ADMIN = 'BRANCH_ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Branch {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // بالمتر
  managerId: string;
  subscriptionEnd: string; // ISO Date
  isActive: boolean;
  isPaid: boolean; // حالة دفع الاشتراك
}

export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string;
  role: UserRole;
  branchId?: string;
  department?: string;
  employeeId?: string;
  joinedDate: string;
  status: RegistrationStatus; // حالة الموافقة من مدير النظام
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  location: {
    lat: number;
    lng: number;
  } | null;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'OVERTIME';
  workHours: number;
}