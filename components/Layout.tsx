
import React from 'react';
import { Icons } from '../constants';
import { User, ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  setView: (view: ViewState) => void;
  currentView: ViewState;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, setView, currentView }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-amber-500 p-2 rounded-lg text-slate-900">
            <Icons.Gavel />
          </div>
          <h1 className="text-2xl font-serif tracking-tight">Adv Dairy</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setView('DASHBOARD')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left ${currentView === 'DASHBOARD' ? 'bg-slate-800 text-amber-500' : 'hover:bg-slate-800'}`}
          >
            <Icons.Calendar />
            <span>My Diary</span>
          </button>
          <button 
            onClick={() => setView('ALL_CASES')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left ${currentView === 'ALL_CASES' ? 'bg-slate-800 text-amber-500' : 'hover:bg-slate-800'}`}
          >
            <Icons.List />
            <span>All Cases</span>
          </button>
          <button 
            onClick={() => setView('CLIENT_LIST')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left ${currentView === 'CLIENT_LIST' ? 'bg-slate-800 text-amber-500' : 'hover:bg-slate-800'}`}
          >
            <Icons.Users />
            <span>Client List</span>
          </button>
          <button 
            onClick={() => setView('ADD_CASE')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left ${currentView === 'ADD_CASE' ? 'bg-slate-800 text-amber-500' : 'hover:bg-slate-800'}`}
          >
            <Icons.Plus />
            <span>Add New Case</span>
          </button>
        </nav>

        {user && (
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div 
              onClick={() => setView('PROFILE')}
              className="flex items-center gap-3 mb-4 px-2 cursor-pointer hover:bg-slate-800 p-2 rounded-xl transition-colors"
            >
              <div className="bg-slate-700 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user.photo ? (
                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <Icons.User />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full py-2 px-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 p-1.5 rounded text-slate-900">
            <Icons.Gavel />
          </div>
          <h1 className="text-xl font-serif">Adv Dairy</h1>
        </div>
        <button onClick={() => setView('ADD_CASE')} className="p-2 bg-amber-500 rounded-full text-slate-900">
          <Icons.Plus />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50 shadow-lg">
        <button 
          onClick={() => setView('DASHBOARD')} 
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'DASHBOARD' ? 'text-amber-600' : 'text-slate-500'}`}
        >
          <Icons.Calendar />
          <span className="text-[9px] font-bold uppercase tracking-wider">Diary</span>
        </button>
        <button 
          onClick={() => setView('ALL_CASES')} 
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'ALL_CASES' ? 'text-amber-600' : 'text-slate-500'}`}
        >
          <Icons.List />
          <span className="text-[9px] font-bold uppercase tracking-wider">Cases</span>
        </button>
        <button 
          onClick={() => setView('CLIENT_LIST')} 
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'CLIENT_LIST' ? 'text-amber-600' : 'text-slate-500'}`}
        >
          <Icons.Users />
          <span className="text-[9px] font-bold uppercase tracking-wider">Clients</span>
        </button>
        <button 
          onClick={() => setView('PROFILE')} 
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'PROFILE' ? 'text-amber-600' : 'text-slate-500'}`}
        >
          <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <Icons.User />
            )}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Account</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
