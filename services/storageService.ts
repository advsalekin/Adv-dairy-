
import { Case, User, Client } from '../types';

const USERS_KEY = 'adv_dairy_users';
const CASES_KEY = 'adv_dairy_cases';
const CLIENTS_KEY = 'adv_dairy_clients';
const SESSION_KEY = 'adv_dairy_session';

export const storageService = {
  // Auth simulation
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  login: (email: string): User => {
    const users = storageService.getUsers();
    let user = users.find(u => u.email === email);
    if (!user) {
      user = { userId: Math.random().toString(36).substr(2, 9), name: email.split('@')[0], email };
      storageService.saveUser(user);
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // User persistence
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.userId === user.userId);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // If updating current user, update session too
    const currentSession = storageService.getCurrentUser();
    if (currentSession && currentSession.userId === user.userId) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }
  },

  // Case persistence
  getCases: (userId: string): Case[] => {
    const data = localStorage.getItem(CASES_KEY);
    const allCases: Case[] = data ? JSON.parse(data) : [];
    return allCases.filter(c => c.userId === userId);
  },

  saveCase: (caseData: Case) => {
    const data = localStorage.getItem(CASES_KEY);
    let allCases: Case[] = data ? JSON.parse(data) : [];
    
    const index = allCases.findIndex(c => c.caseId === caseData.caseId);
    if (index >= 0) {
      allCases[index] = { ...caseData, updatedAt: Date.now() };
    } else {
      allCases.push({ ...caseData, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    localStorage.setItem(CASES_KEY, JSON.stringify(allCases));
  },

  deleteCase: (caseId: string) => {
    const data = localStorage.getItem(CASES_KEY);
    let allCases: Case[] = data ? JSON.parse(data) : [];
    allCases = allCases.filter(c => c.caseId !== caseId);
    localStorage.setItem(CASES_KEY, JSON.stringify(allCases));
  },

  // Client persistence
  getClients: (userId: string): Client[] => {
    const data = localStorage.getItem(CLIENTS_KEY);
    const allClients: Client[] = data ? JSON.parse(data) : [];
    return allClients.filter(c => c.userId === userId);
  },

  saveClient: (clientData: Client) => {
    const data = localStorage.getItem(CLIENTS_KEY);
    let allClients: Client[] = data ? JSON.parse(data) : [];
    
    const index = allClients.findIndex(c => c.clientId === clientData.clientId);
    if (index >= 0) {
      allClients[index] = { ...clientData, updatedAt: Date.now() };
    } else {
      allClients.push({ ...clientData, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(allClients));
  },

  deleteClient: (clientId: string) => {
    const data = localStorage.getItem(CLIENTS_KEY);
    let allClients: Client[] = data ? JSON.parse(data) : [];
    allClients = allClients.filter(c => c.clientId !== clientId);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(allClients));
  }
};
