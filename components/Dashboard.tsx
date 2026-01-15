
import React, { useState, useMemo } from 'react';
import { Case, Priority, CaseStatus } from '../types';
import { Icons, PRIORITY_COLORS } from '../constants';
import Modal from './Modal';

interface DashboardProps {
  cases: Case[];
  onSelectCase: (caseData: Case) => void;
  onEditCase: (caseData: Case) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkComplete: (ids: string[]) => void;
}

type SortOption = 'SERIAL' | 'PRIORITY';

const Dashboard: React.FC<DashboardProps> = ({ cases, onSelectCase, onEditCase, onBulkDelete, onBulkComplete }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourt, setFilterCourt] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('SERIAL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const priorityWeight = {
    [Priority.HIGH]: 3,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 1
  };

  const filteredCases = useMemo(() => {
    return cases
      .filter(c => {
        const matchesDate = c.nextDate === selectedDate;
        const matchesSearch = c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              c.courtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (c.caseNameParties && c.caseNameParties.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCourt = filterCourt === 'All' || c.courtName === filterCourt;
        const matchesStatus = c.status !== CaseStatus.COMPLETED || searchQuery !== '';
        return matchesDate && matchesSearch && matchesCourt && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'PRIORITY') {
          return priorityWeight[b.priority || Priority.LOW] - priorityWeight[a.priority || Priority.LOW];
        }
        return parseInt(a.serialNumber || '0') - parseInt(b.serialNumber || '0');
      });
  }, [cases, selectedDate, searchQuery, filterCourt, sortBy]);

  const uniqueCourts = useMemo(() => {
    return ['All', ...Array.from(new Set(cases.map(c => c.courtName)))];
  }, [cases]);

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredCases.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCases.map(c => c.caseId)));
    }
  };

  const handleBulkCompleteAction = () => {
    onBulkComplete(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const confirmBulkDelete = () => {
    onBulkDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
    setShowBulkDeleteModal(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-amber-600 font-semibold tracking-wide uppercase text-xs mb-1">Today's List</p>
          <h2 className="text-3xl font-serif text-slate-900">Case Diary</h2>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 bg-transparent outline-none text-slate-700 font-medium"
          />
        </div>
      </header>

      {selectedIds.size > 0 && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <button onClick={toggleAll} className="p-1 rounded hover:bg-slate-800">
               <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${selectedIds.size === filteredCases.length ? 'bg-amber-500 border-amber-500' : 'border-slate-500'}`}>
                 {selectedIds.size === filteredCases.length && (
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                 )}
               </div>
            </button>
            <span className="font-bold text-sm">{selectedIds.size} selected</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleBulkCompleteAction}
              className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors"
            >
              Mark Completed
            </button>
            <button 
              onClick={() => setShowBulkDeleteModal(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors"
            >
              Delete Selected
            </button>
            <button 
              onClick={() => setSelectedIds(new Set())}
              className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icons.Search />
          </span>
          <input 
            type="text"
            placeholder="Search by case no., parties or court..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={filterCourt}
            onChange={(e) => setFilterCourt(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium"
          >
            {uniqueCourts.map(court => (
              <option key={court} value={court}>{court}</option>
            ))}
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium"
          >
            <option value="SERIAL">Sort by Serial</option>
            <option value="PRIORITY">Sort by Priority</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCases.length > 0 ? (
          filteredCases.map((c) => (
            <div 
              key={c.caseId}
              onClick={() => onSelectCase(c)}
              className={`bg-white border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row md:items-center gap-4 relative overflow-hidden ${selectedIds.has(c.caseId) ? 'ring-2 ring-amber-500 border-transparent shadow-md' : ''} ${c.isTaskDone ? 'bg-slate-50 opacity-80' : ''}`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${c.priority === Priority.HIGH ? 'bg-red-500' : c.priority === Priority.MEDIUM ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              
              <div className="flex items-center gap-4 flex-1">
                <div 
                  onClick={(e) => toggleSelection(c.caseId, e)}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${selectedIds.has(c.caseId) ? 'bg-amber-500 border-amber-500' : 'border-slate-200 group-hover:border-slate-300 bg-slate-50'}`}
                >
                  {selectedIds.has(c.caseId) && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </div>

                <div className="flex-shrink-0 bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-slate-700 relative">
                  #{c.serialNumber || '-'}
                  {c.isTaskDone && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`font-bold text-slate-900 text-lg truncate ${c.isTaskDone ? 'line-through text-slate-400' : ''}`}>{c.caseNumber}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border flex-shrink-0 ${PRIORITY_COLORS[c.priority || Priority.LOW]}`}>
                      {c.priority || 'Low'}
                    </span>
                    {c.status === CaseStatus.COMPLETED && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-600 flex-shrink-0">Case Closed</span>
                    )}
                  </div>
                  {c.caseNameParties && (
                    <p className="text-sm font-bold text-slate-700 truncate mb-0.5">{c.caseNameParties}</p>
                  )}
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-tight truncate">{c.courtName} • {c.caseType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:flex md:items-center gap-6 text-sm">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase mb-0.5">Section & Act</p>
                  <p className="text-slate-700 font-medium truncate max-w-[100px]">{c.section}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase mb-0.5">Today's Step</p>
                  <p className={`${c.isTaskDone ? 'text-emerald-600' : 'text-amber-600'} font-bold truncate max-w-[120px]`}>
                    {c.stepOfTheDay}
                    {c.isTaskDone && <span className="ml-1 text-[10px] text-emerald-500 uppercase tracking-tighter">(Done)</span>}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCase(c);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Icons.Edit />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-slate-200 rounded-full mb-4 text-slate-400">
              <Icons.Calendar />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No cases scheduled</h3>
            <p className="text-slate-500">There are no active cases listed for {new Date(selectedDate).toLocaleDateString('en-GB')}.</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={showBulkDeleteModal}
        title="Confirm Bulk Deletion"
        message={`Are you sure you want to delete ${selectedIds.size} selected cases? This action cannot be reversed.`}
        confirmLabel={`Delete ${selectedIds.size} Cases`}
        cancelLabel="Discard"
        type="danger"
        onConfirm={confirmBulkDelete}
        onClose={() => setShowBulkDeleteModal(false)}
      />
    </div>
  );
};

export default Dashboard;
