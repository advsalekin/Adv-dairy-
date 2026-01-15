
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Client, Case } from '../types';
import { Icons } from '../constants';

interface ClientFormProps {
  initialData?: Client | null;
  userId: string;
  cases: Case[];
  onSave: (client: Client) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ initialData, userId, cases, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    photo: '',
    caseNumber: '',
    caseName: '',
    lastContacted: new Date().toISOString().split('T')[0],
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const caseSuggestions = useMemo(() => {
    if (!formData.caseNumber || formData.caseNumber.length < 2) return [];
    return cases.filter(c => 
      c.caseNumber.toLowerCase().includes(formData.caseNumber!.toLowerCase()) ||
      (c.caseNameParties && c.caseNameParties.toLowerCase().includes(formData.caseNumber!.toLowerCase()))
    ).slice(0, 5);
  }, [formData.caseNumber, cases]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const selectCase = (c: Case) => {
    setFormData({ 
      ...formData, 
      caseNumber: c.caseNumber, 
      // Use the actual parties/case name instead of a generic string
      caseName: c.caseNameParties || `${c.caseType} @ ${c.courtName}` 
    });
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientToSave: Client = {
      ...formData as Client,
      clientId: initialData?.clientId || Math.random().toString(36).substr(2, 9),
      userId,
      createdAt: initialData?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    onSave(clientToSave);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-serif text-slate-900">{initialData ? 'Update Client' : 'New Client Registration'}</h2>
        <p className="text-slate-500">Capture contact and demographic information for your client.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
        <div className="flex flex-col items-center gap-4 py-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center cursor-pointer overflow-hidden group hover:border-amber-500 transition-all relative"
          >
            {formData.photo ? (
              <>
                <img src={formData.photo} alt="Client" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs font-bold">Change Photo</span>
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="text-slate-400 group-hover:text-amber-500 flex justify-center mb-1">
                  <Icons.User />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-amber-500">Add Photo</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Client Full Name</label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
              <input 
                required
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+91 00000 00000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <input 
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="client@email.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-black"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Last Contacted Date</label>
            <input 
              type="date"
              value={formData.lastContacted}
              onChange={e => setFormData({...formData, lastContacted: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-black"
            />
          </div>

          <div className="p-6 bg-slate-900 rounded-3xl space-y-4 relative overflow-visible">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Primary Case Association</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Case Number</label>
                <input 
                  type="text"
                  autoComplete="off"
                  value={formData.caseNumber}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={e => {
                    setFormData({...formData, caseNumber: e.target.value});
                    setShowSuggestions(true);
                  }}
                  placeholder="Link existing case..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white text-sm"
                />
                
                {showSuggestions && caseSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 bg-slate-50 border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Matching Cases in Diary</div>
                    {caseSuggestions.map(c => (
                      <button
                        key={c.caseId}
                        type="button"
                        onClick={() => selectCase(c)}
                        className="w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 truncate">{c.caseNumber}</p>
                          <p className="text-[11px] font-bold text-amber-600 truncate">{c.caseNameParties || 'Parties not listed'}</p>
                          <p className="text-[9px] text-slate-400 truncate">{c.courtName} • {c.caseType}</p>
                        </div>
                        <div className="text-amber-500 ml-2">
                          <Icons.Plus />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Case Name / Parties</label>
                <input 
                  type="text"
                  value={formData.caseName}
                  onChange={e => setFormData({...formData, caseName: e.target.value})}
                  placeholder="e.g. John vs State"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white text-sm"
                />
              </div>
            </div>
            <p className="text-[9px] text-slate-500 italic">Selecting a case from the suggestions will automatically populate the parties/name from your diary.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Residential/Office Address</label>
            <textarea 
              rows={2}
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              placeholder="Enter full postal address..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Additional Notes</label>
            <textarea 
              rows={4}
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              placeholder="Background info, relative contacts, etc..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-black"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit"
            className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg active:scale-[0.98]"
          >
            {initialData ? 'Update Details' : 'Register Client'}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
