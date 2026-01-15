
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CaseForm from './components/CaseForm';
import CaseDetail from './components/CaseDetail';
import CaseHistory from './components/CaseHistory';
import AllCases from './components/AllCases';
import Profile from './components/Profile';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import { ViewState, Case, User, CaseStatus, Client } from './types';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('AUTH');
  const [user, setUser] = useState<User | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');

  // Initialize Auth and Data
  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCases(storageService.getCases(currentUser.userId));
      setClients(storageService.getClients(currentUser.userId));
      setView('DASHBOARD');
    }
  }, []);

  const handleLogin = (userData: User) => {
    storageService.login(userData.email);
    setUser(userData);
    setCases(storageService.getCases(userData.userId));
    setClients(storageService.getClients(userData.userId));
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setCases([]);
    setClients([]);
    setView('AUTH');
  };

  const handleUpdateUser = (updatedUser: User) => {
    storageService.saveUser(updatedUser);
    setUser(updatedUser);
  };

  // Case Management
  const handleSaveCase = (caseData: Case) => {
    const existingCase = cases.find(c => c.caseId === caseData.caseId);
    if (existingCase && existingCase.nextDate !== caseData.nextDate) {
      const historyItem = {
        date: existingCase.nextDate,
        step: existingCase.stepOfTheDay,
        notes: existingCase.notes
      };
      caseData.history = [...(existingCase.history || []), historyItem];
      caseData.previousDate = existingCase.nextDate;
    }

    storageService.saveCase(caseData);
    if (user) {
      setCases(storageService.getCases(user.userId));
    }
    setView(view === 'ALL_CASES' ? 'ALL_CASES' : 'DASHBOARD');
    setSelectedCase(null);
  };

  const handleDeleteCase = (caseId: string) => {
    storageService.deleteCase(caseId);
    if (user) {
      setCases(storageService.getCases(user.userId));
    }
    setView('DASHBOARD');
    setSelectedCase(null);
  };

  const handleBulkDelete = (ids: string[]) => {
    ids.forEach(id => storageService.deleteCase(id));
    if (user) {
      setCases(storageService.getCases(user.userId));
    }
  };

  const handleBulkComplete = (ids: string[]) => {
    ids.forEach(id => {
      const caseToUpdate = cases.find(c => c.caseId === id);
      if (caseToUpdate) {
        storageService.saveCase({
          ...caseToUpdate,
          status: CaseStatus.COMPLETED,
          updatedAt: Date.now()
        });
      }
    });
    if (user) {
      setCases(storageService.getCases(user.userId));
    }
  };

  // Client Management
  const handleSaveClient = (clientData: Client) => {
    storageService.saveClient(clientData);
    
    // Formal Linking: If client has a case number, link matching cases
    if (clientData.caseNumber) {
      const matchingCases = cases.filter(c => c.caseNumber === clientData.caseNumber);
      matchingCases.forEach(c => {
        if (c.clientId !== clientData.clientId) {
          storageService.saveCase({ ...c, clientId: clientData.clientId });
        }
      });
    }

    if (user) {
      setClients(storageService.getClients(user.userId));
      setCases(storageService.getCases(user.userId));
    }
    setView('CLIENT_LIST');
    setSelectedClient(null);
  };

  const handleDeleteClient = (clientId: string) => {
    storageService.deleteClient(clientId);
    // Remove link from cases
    const linkedCases = cases.filter(c => c.clientId === clientId);
    linkedCases.forEach(c => storageService.saveCase({ ...c, clientId: undefined }));
    
    if (user) {
      setClients(storageService.getClients(user.userId));
      setCases(storageService.getCases(user.userId));
    }
  };

  const navigateToCase = (caseData: Case) => {
    setSelectedCase(caseData);
    setView('CASE_DETAIL');
  };

  const navigateToEdit = (caseData: Case) => {
    setSelectedCase(caseData);
    setView('EDIT_CASE');
  };

  const navigateToEditClient = (client: Client) => {
    setSelectedClient(client);
    setView('EDIT_CLIENT');
  };

  const navigateToHistory = () => {
    setView('CASE_HISTORY');
  };

  const handleViewClientCases = (caseNumber: string) => {
    setInitialSearchQuery(caseNumber);
    setView('ALL_CASES');
  };

  // Reset search query when changing views manually
  const handleSetView = (newView: ViewState) => {
    if (newView !== 'ALL_CASES') {
      setInitialSearchQuery('');
    }
    setView(newView);
  };

  if (view === 'AUTH') {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout} setView={handleSetView} currentView={view}>
      {view === 'DASHBOARD' && (
        <Dashboard 
          cases={cases} 
          onSelectCase={navigateToCase} 
          onEditCase={navigateToEdit}
          onBulkDelete={handleBulkDelete}
          onBulkComplete={handleBulkComplete}
        />
      )}

      {view === 'ALL_CASES' && (
        <AllCases 
          cases={cases}
          onSelectCase={navigateToCase}
          onEditCase={navigateToEdit}
          initialSearch={initialSearchQuery}
        />
      )}

      {view === 'CLIENT_LIST' && (
        <ClientList 
          clients={clients}
          onAddClient={() => handleSetView('ADD_CLIENT')}
          onEditClient={navigateToEditClient}
          onDeleteClient={handleDeleteClient}
          onViewCases={handleViewClientCases}
        />
      )}
      
      {view === 'ADD_CASE' && (
        <CaseForm 
          userId={user?.userId || ''} 
          onSave={handleSaveCase} 
          onCancel={() => handleSetView('DASHBOARD')} 
        />
      )}

      {view === 'EDIT_CASE' && selectedCase && (
        <CaseForm 
          initialData={selectedCase}
          userId={user?.userId || ''} 
          onSave={handleSaveCase} 
          onCancel={() => handleSetView('DASHBOARD')} 
        />
      )}

      {view === 'ADD_CLIENT' && (
        <ClientForm 
          userId={user?.userId || ''} 
          cases={cases}
          onSave={handleSaveClient} 
          onCancel={() => handleSetView('CLIENT_LIST')} 
        />
      )}

      {view === 'EDIT_CLIENT' && selectedClient && (
        <ClientForm 
          initialData={selectedClient}
          userId={user?.userId || ''} 
          cases={cases}
          onSave={handleSaveClient} 
          onCancel={() => handleSetView('CLIENT_LIST')} 
        />
      )}

      {view === 'CASE_DETAIL' && selectedCase && (
        <CaseDetail 
          caseData={selectedCase}
          clientData={clients.find(cl => cl.clientId === selectedCase.clientId)}
          onEdit={navigateToEdit}
          onDelete={handleDeleteCase}
          onBack={() => handleSetView('DASHBOARD')}
          onViewHistory={navigateToHistory}
        />
      )}

      {view === 'CASE_HISTORY' && selectedCase && (
        <CaseHistory 
          caseData={selectedCase}
          onBack={() => handleSetView('CASE_DETAIL')}
        />
      )}

      {view === 'PROFILE' && user && (
        <Profile 
          user={user}
          cases={cases}
          onLogout={handleLogout}
          onBack={() => handleSetView('DASHBOARD')}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </Layout>
  );
};

export default App;
