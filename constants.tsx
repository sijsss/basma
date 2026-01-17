
import { User, UserRole, AttendanceRecord, Branch } from './types';

export const BRANCHES: Branch[] = [
  {
    id: 'b1',
    name: 'فرع الرياض الرئيسي',
    lat: 24.7136,
    lng: 46.6753,
    radius: 300,
    managerId: 'u2',
    subscriptionEnd: '2025-12-31',
    isActive: true,
    isPaid: true
  },
  {
    id: 'b2',
    name: 'فرع جدة',
    lat: 21.4858,
    lng: 39.1925,
    radius: 200,
    managerId: 'u5',
    subscriptionEnd: '2024-05-01',
    isActive: true,
    isPaid: false
  }
];

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'سجاد - مدير النظام',
    phone: '07737523465',
    password: 'Sajad745',
    role: UserRole.SUPER_ADMIN,
    joinedDate: '2023-01-01',
    status: 'APPROVED'
  },
  {
    id: 'u2',
    name: 'مدير فرع الرياض',
    phone: '0511111111',
    password: '123',
    role: UserRole.BRANCH_ADMIN,
    branchId: 'b1',
    joinedDate: '2023-01-15',
    status: 'APPROVED'
  },
  {
    id: 'u3',
    name: 'موظف تجريبي 1',
    phone: '0522222222',
    password: '123',
    role: UserRole.EMPLOYEE,
    branchId: 'b1',
    department: 'المبيعات',
    employeeId: 'EMP-001',
    joinedDate: '2024-01-01',
    status: 'APPROVED'
  }
];

export const INITIAL_RECORDS: AttendanceRecord[] = [
  {
    id: 'r1',
    userId: 'u3',
    userName: 'موظف تجريبي 1',
    date: '2024-05-20',
    checkIn: '08:00',
    checkOut: '16:00',
    location: { lat: 24.7136, lng: 46.6753 },
    status: 'PRESENT',
    workHours: 8
  }
];