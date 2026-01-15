
export enum CaseType {
  CIVIL = 'Civil',
  CRIMINAL = 'Criminal',
  FAMILY = 'Family',
  REVENUE = 'Revenue',
  CONSUMER = 'Consumer',
  LABOUR = 'Labour',
  WRIT = 'Writ',
  OTHER = 'Other'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum CaseStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed'
}

export interface HistoryItem {
  date: string;
  step: string;
  notes?: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  photo?: string; // Base64 encoded profile picture
}

export interface Client {
  clientId: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  photo?: string; // Base64 encoded image
  caseNumber?: string;
  caseName?: string;
  lastContacted?: string; // ISO date string
  createdAt: number;
  updatedAt: number;
}

export interface Case {
  caseId: string;
  userId: string;
  clientId?: string; // Formal link to a client record
  serialNumber: string;
  caseNumber: string;
  caseNameParties?: string; // Name of parties (e.g., John vs State)
  courtName: string;
  caseType: string;
  priority: Priority;
  status: CaseStatus;
  section: string;
  previousDate: string;
  nextDate: string;
  stepOfTheDay: string;
  isTaskDone?: boolean; // Tracking if current step is completed
  notes: string;
  history?: HistoryItem[];
  createdAt: number;
  updatedAt: number;
}

export type ViewState = 'DASHBOARD' | 'ALL_CASES' | 'ADD_CASE' | 'EDIT_CASE' | 'CASE_DETAIL' | 'CASE_HISTORY' | 'AUTH' | 'PROFILE' | 'CLIENT_LIST' | 'ADD_CLIENT' | 'EDIT_CLIENT';
