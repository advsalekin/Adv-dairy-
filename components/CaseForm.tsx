
import React, { useState, useEffect } from 'react';
import { Case, Priority, CaseStatus } from '../types';
import { PRIORITIES, Icons } from '../constants';

interface CaseFormProps {
  initialData?: Case | null;
  userId: string;
  onSave: (caseData: Case) => void;
  onCancel: () => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ initialData, userId, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Case>>({
    serialNumber: '',
    caseNumber: '',
    caseNameParties: '',
    courtName: '',
    caseType: '',
    priority: Priority.MEDIUM,
    status: CaseStatus.ACTIVE,
    section: '',
    previousDate: '',
    nextDate: new Date().toISOString().split('T')[0],
    stepOfTheDay: '',
    isTaskDone: false,
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const caseToSave: Case = {
      ...formData as Case,
      priority: formData.priority || Priority.LOW,
      status: formData.status || CaseStatus.ACTIVE,
      isTaskDone: formData.isTaskDone || false,
      caseId: initialData?.caseId || Math.random().toString(36).substr(2, 9),
      userId,
      createdAt: initialData?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    onSave(caseToSave);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-serif text-slate-900">{initialData ? 'Update Case Record' : 'New Case Entry'}</h2>
        <p className="text-slate-500">Manage case identification and upcoming procedural steps.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
        {/* Case ID Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Icons.Gavel className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Case Identification</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Serial Number</label>
              <input 
                required
                type="text"
                value={formData.serialNumber}
                onChange={e => setFormData({...formData, serialNumber: e.target.value})}
                placeholder="e.g. 1"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Case Number</label>
              <input 
                required
                type="text"
                value={formData.caseNumber}
                onChange={e => setFormData({...formData, caseNumber: e.target.value})}
                placeholder="e.g. CR/123/2024"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-black"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Case Name / Parties</label>
            <input 
              required
              type="text"
              value={formData.caseNameParties}
              onChange={e => setFormData({...formData, caseNameParties: e.target.value})}
              placeholder="e.g. John Doe vs State of Maharashtra"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Court Name</label>
              <input 
                required
                type="text"
                value={formData.courtName}
                onChange={e => setFormData({...formData, courtName: e.target.value})}
                placeholder="e.g. High Court, Delhi"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Type of Case</label>
              <input 
                required
                type="text"
                value={formData.caseType}
                onChange={e => setFormData({...formData, caseType: e.target.value})}
                placeholder="Civil, Criminal, etc."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-black"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Section and Act</label>
            <input 
              type="text"
              value={formData.section}
              onChange={e => setFormData({...formData, section: e.target.value})}
              placeholder="e.g. IPC 302, NI Act 138"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-black"
            />
          </div>
        </section>

        {/* Status Section */}
        {initialData && (
          <section className="bg-slate-900 rounded-[2rem] p-6 text-white space-y-4 shadow-xl">
             <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl">Hearing Completion</h3>
                  <p className="text-xs text-slate-400">Is the task for {new Date(initialData.nextDate).toLocaleDateString()} done?</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, isTaskDone: !formData.isTaskDone})}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                    formData.isTaskDone 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-800 border border-slate-700 text-slate-300'
                  }`}
                >
                  {formData.isTaskDone ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                  )}
                  {formData.isTaskDone ? 'Task is Done' : 'Is Task Done?'}
                </button>
             </div>
             
             {formData.isTaskDone && (
               <div className="pt-4 border-t border-slate-800 animate-in fade-in slide-in-from-top-2">
                 <p className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                   <Icons.Sparkles className="w-3 h-3" />
                   Ready to reschedule
                 </p>
                 <p className="text-[10px] text-slate-400 mt-1 italic">When you change the date below, today's step will move to Procedural History.</p>
               </div>
             )}
          </section>
        )}

        {/* Scheduling Section */}
        <section className="space-y-6 pt-2">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Icons.Calendar className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Procedural Scheduling</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Next Procedure Date</label>
              <input 
                required
                type="date"
                value={formData.nextDate}
                onChange={e => setFormData({...formData, nextDate: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Next Procedure / Step</label>
              <input 
                required
                type="text"
                value={formData.stepOfTheDay}
                onChange={e => setFormData({...formData, stepOfTheDay: e.target.value})}
                placeholder="e.g. Final Argument"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-black"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Procedural Notes / Remarks</label>
            <textarea 
              rows={4}
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              placeholder="Add details about what happened or preparation needed..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-black"
            />
          </div>
        </section>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit"
            className="flex-[2] bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-slate-800 transition-colors shadow-lg active:scale-[0.98]"
          >
            {initialData ? 'Update & Save Case' : 'Register New Case'}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-100 text-slate-600 font-bold py-5 rounded-2xl hover:bg-slate-200 transition-colors active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseForm;
