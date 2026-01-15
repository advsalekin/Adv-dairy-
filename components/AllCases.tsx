
import React, { useState, useMemo, useEffect } from 'react';
import { Case, Priority, CaseStatus } from '../types';
import { Icons, PRIORITY_COLORS } from '../constants';

interface AllCasesProps {
  cases: Case[];
  onSelectCase: (caseData: Case) => void;
  onEditCase: (caseData: Case) => void;
  initialSearch?: string;
}

type SortOption = 'RECENT' | 'DATE_ASC' | 'DATE_DESC';

const AllCases: React.FC<AllCasesProps> = ({ cases, onSelectCase, onEditCase, initialSearch = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<'All' | CaseStatus>('All');
  const [sortBy, setSortBy] = useState<SortOption>('RECENT');

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const filteredCases = useMemo(() => {
    return cases
      .filter(c => {
        const matchesSearch = c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              c.courtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              c.caseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (c.caseNameParties && c.caseNameParties.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'DATE_ASC') {
          return new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime();
        }
        if (sortBy === 'DATE_DESC') {
          return new Date(b.nextDate).getTime() - new Date(a.nextDate).getTime();
        }
        // Default: RECENT (Recently updated)
        return b.updatedAt - a.updatedAt;
      });
  }, [cases, searchQuery, statusFilter, sortBy]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-amber-600 font-semibold tracking-wide uppercase text-xs mb-1">Portfolio</p>
          <h2 className="text-3xl font-serif text-slate-900">All Cases</h2>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-500 uppercase tracking-widest">
          Total: {cases.length}
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icons.Search />
          </span>
          <input 
            type="text"
            placeholder="Search by case no, parties, court, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium flex-1 md:flex-none"
          >
            <option value="All">All Statuses</option>
            <option value={CaseStatus.ACTIVE}>Active</option>
            <option value={CaseStatus.COMPLETED}>Completed</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium flex-1 md:flex-none"
          >
            <option value="RECENT">Recently Updated</option>
            <option value="DATE_ASC">Date: Soonest First</option>
            <option value="DATE_DESC">Date: Furthest First</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCases.length > 0 ? (
          filteredCases.map((c) => (
            <div 
              key={c.caseId}
              onClick={() => onSelectCase(c)}
              className="bg-white border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row md:items-center gap-4 relative overflow-hidden"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${c.priority === Priority.HIGH ? 'bg-red-500' : c.priority === Priority.MEDIUM ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0 bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-slate-700">
                  #{c.serialNumber || '-'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-slate-900 text-lg truncate">{c.caseNumber}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border flex-shrink-0 ${PRIORITY_COLORS[c.priority || Priority.LOW]}`}>
                      {c.priority || 'Low'}
                    </span>
                    {c.status === CaseStatus.COMPLETED && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-600 flex-shrink-0">Completed</span>
                    )}
                  </div>
                  {c.caseNameParties && (
                    <p className="text-sm font-bold text-slate-700 truncate mb-0.5">{c.caseNameParties}</p>
                  )}
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-tight truncate">{c.courtName} • {c.caseType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:flex md:items-center gap-8 text-sm">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase mb-0.5">Next Date</p>
                  <p className="text-slate-900 font-bold">{new Date(c.nextDate).toLocaleDateString('en-GB')}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase mb-0.5">Step of the Day</p>
                  <p className="text-slate-700 font-medium max-w-[120px] truncate">{c.stepOfTheDay}</p>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCase(c);
                }}
                className="md:ml-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Icons.Edit />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-slate-200 rounded-full mb-4 text-slate-400">
              <Icons.List />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No cases found</h3>
            <p className="text-slate-500">Your search didn't match any records.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCases;
