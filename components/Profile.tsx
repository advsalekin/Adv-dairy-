
import React, { useRef } from 'react';
import { User, Case } from '../types';
import { Icons } from '../constants';

interface ProfileProps {
  user: User;
  cases: Case[];
  onLogout: () => void;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, cases, onLogout, onBack, onUpdateUser }) => {
  const activeCases = cases.filter(c => c.status !== 'Completed').length;
  const completedCases = cases.length - activeCases;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({
          ...user,
          photo: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-amber-600 font-semibold tracking-wide uppercase text-xs mb-1">Account Settings</p>
          <h2 className="text-3xl font-serif text-slate-900">User Profile</h2>
        </div>
        <button 
          onClick={onBack}
          className="p-2 text-slate-400 hover:text-slate-900 transition-colors md:hidden"
        >
          <Icons.Plus className="rotate-45" /> {/* Using Plus as a close icon via rotation */}
        </button>
      </header>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 border-4 border-white shadow-md relative overflow-hidden group cursor-pointer transition-all hover:ring-4 hover:ring-amber-100"
          >
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-[10px] font-bold uppercase tracking-widest">Update Photo</span>
            </div>
          </div>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            className="hidden"
            accept="image/*"
          />
          
          <h3 className="text-2xl font-bold text-slate-900">{user.name}</h3>
          <p className="text-slate-500 font-medium">{user.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100">
            <p className="text-2xl font-serif text-slate-900 mb-1">{activeCases}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Cases</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100">
            <p className="text-2xl font-serif text-slate-900 mb-1">{completedCases}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Closed</p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-5 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all border border-red-100 shadow-sm active:scale-[0.98]"
          >
            <Icons.Trash />
            Sign Out from Adv Dairy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
