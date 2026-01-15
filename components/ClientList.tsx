
import React, { useState, useMemo } from 'react';
import { Client } from '../types';
import { Icons } from '../constants';
import Modal from './Modal';

interface ClientListProps {
  clients: Client[];
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onViewCases: (caseNumber: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onAddClient, onEditClient, onDeleteClient, onViewCases }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.caseNumber && c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.caseName && c.caseName.toLowerCase().includes(searchQuery.toLowerCase()))
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, searchQuery]);

  const isStale = (lastContacted?: string) => {
    if (!lastContacted) return true;
    const lastDate = new Date(lastContacted);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 30;
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-amber-600 font-semibold tracking-wide uppercase text-xs mb-1">CRM</p>
          <h2 className="text-3xl font-serif text-slate-900">Client Directory</h2>
        </div>
        <button 
          onClick={onAddClient}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
        >
          <Icons.Plus />
          Add Client
        </button>
      </header>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icons.Search />
        </span>
        <input 
          type="text"
          placeholder="Search by name, phone, email or case no..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none shadow-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => {
            const needsFollowUp = isStale(client.lastContacted);
            return (
              <div 
                key={client.clientId}
                className={`bg-white border p-6 rounded-[2rem] hover:shadow-md transition-all group relative ${needsFollowUp ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200'}`}
              >
                {needsFollowUp && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-full md:translate-y-0 md:static md:translate-x-0 mb-4 inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm z-10">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Follow-up Needed
                  </div>
                )}

                <div className="flex gap-6">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    {client.photo ? (
                      <img 
                        src={client.photo} 
                        alt={client.name} 
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-50" 
                      />
                    ) : (
                      <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                        <Icons.User />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900 truncate pr-8">{client.name}</h3>
                      <div className="flex gap-1 absolute top-6 right-6">
                        <button 
                          onClick={() => onEditClient(client)}
                          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <Icons.Edit />
                        </button>
                        <button 
                          onClick={() => setClientToDelete(client)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        {client.phone}
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2 truncate">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        {client.email || 'No email provided'}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-2">
                        Last Contact: <span className={needsFollowUp ? 'text-amber-600' : 'text-slate-600'}>
                          {client.lastContacted ? new Date(client.lastContacted).toLocaleDateString('en-GB') : 'N/A'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Associated Case */}
                <div className="mt-6 bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Case</p>
                    {client.caseNumber ? (
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate">{client.caseNumber}</p>
                        <p className="text-xs text-slate-500 truncate">{client.caseName || 'N/A'}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No case linked yet</p>
                    )}
                  </div>
                  {client.caseNumber && (
                    <button 
                      onClick={() => onViewCases(client.caseNumber!)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition-all uppercase tracking-tight"
                    >
                      View History
                      <Icons.ArrowUp className="rotate-90" />
                    </button>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Address</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{client.address || 'No address provided.'}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-slate-200 rounded-full mb-4 text-slate-400">
              <Icons.Users />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No clients found</h3>
            <p className="text-slate-500">Add your first client to start building your directory.</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={!!clientToDelete}
        title="Delete Client?"
        message={`Are you sure you want to remove ${clientToDelete?.name}? This will delete their contact details forever.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Keep Client"
        type="danger"
        onConfirm={() => {
          if (clientToDelete) {
            onDeleteClient(clientToDelete.clientId);
            setClientToDelete(null);
          }
        }}
        onClose={() => setClientToDelete(null)}
      />
    </div>
  );
};

export default ClientList;
