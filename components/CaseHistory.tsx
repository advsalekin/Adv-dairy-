
import React, { useState } from 'react';
import { Case, HistoryItem } from '../types';
import { Icons } from '../constants';
import { jsPDF } from 'jspdf';

interface CaseHistoryProps {
  caseData: Case;
  onBack: () => void;
}

const CaseHistory: React.FC<CaseHistoryProps> = ({ caseData, onBack }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Combine explicit history with the previousDate/step if not already present
  const history: HistoryItem[] = caseData.history || [];
  
  // If we have a previousDate but no history items, create one for display
  const displayHistory = history.length > 0 ? history : (caseData.previousDate ? [{
    date: caseData.previousDate,
    step: "Previous Proceeding",
    notes: "Historical record migrated from previous date field."
  }] : []);

  const handlePrintPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      const margin = 20;
      let y = 20;

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('Adv Dairy - Procedural History', margin, y);
      
      y += 10;
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.line(margin, y, 210 - margin, y);
      y += 15;

      // Case Summary
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text('CASE SUMMARY', margin, y);
      y += 8;

      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text(`Case No: ${caseData.caseNumber}`, margin, y);
      y += 7;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`${caseData.courtName} | ${caseData.caseType}`, margin, y);
      y += 15;

      // History Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('Proceedings Timeline', margin, y);
      y += 10;

      if (displayHistory.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('No historical records found for this case.', margin, y);
      } else {
        // Sort history by date descending for the PDF
        const sortedHistory = [...displayHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        sortedHistory.forEach((item, index) => {
          // Check for page overflow
          if (y > 250) {
            doc.addPage();
            y = 20;
          }

          // Date Bubble Background (Simulated)
          doc.setFillColor(255, 251, 235); // amber-50
          doc.rect(margin, y, 40, 8, 'F');
          
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(180, 83, 9); // amber-700
          doc.text(new Date(item.date).toLocaleDateString('en-GB'), margin + 5, y + 5.5);
          
          y += 12;
          
          doc.setFontSize(11);
          doc.setTextColor(15, 23, 42);
          doc.text(`Step: ${item.step}`, margin + 5, y);
          y += 6;

          if (item.notes) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(71, 85, 105); // slate-600
            const splitNotes = doc.splitTextToSize(`Notes: ${item.notes}`, 160);
            doc.text(splitNotes, margin + 5, y);
            y += (splitNotes.length * 5) + 5;
          }

          // Separator
          doc.setDrawColor(241, 245, 249);
          doc.line(margin, y, 210 - margin, y);
          y += 10;
        });
      }

      // Final/Next Milestone
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text('NEXT SCHEDULED LISTING', margin, y);
      y += 8;
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(new Date(caseData.nextDate).toLocaleDateString('en-GB'), margin, y);

      // Footer
      const pageCount = doc.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(`Procedural History - ${caseData.caseNumber} - Page ${i} of ${pageCount}`, margin, 285);
      }

      doc.save(`${caseData.caseNumber.replace(/[/\\?%*:|"<>]/g, '-')}_History.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Failed to export procedural history PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Case Details
        </button>
        
        <button 
          onClick={handlePrintPdf}
          disabled={isGeneratingPdf}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
        >
          {isGeneratingPdf ? (
            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          ) : (
            <Icons.Print />
          )}
          {isGeneratingPdf ? 'Generating...' : 'Export History as PDF'}
        </button>
      </div>

      <header className="mb-8">
        <h2 className="text-3xl font-serif text-slate-900">Procedural History</h2>
        <p className="text-slate-500">{caseData.caseNumber} • {caseData.courtName}</p>
      </header>

      <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-12">
        {displayHistory.length > 0 ? (
          [...displayHistory].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item, index) => (
            <div key={index} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] top-0 w-5 h-5 bg-amber-500 rounded-full border-4 border-white shadow-sm" />
              
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    {new Date(item.date).toLocaleDateString('en-GB')}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Step Taken</p>
                    <p className="text-black font-semibold text-lg">{item.step}</p>
                  </div>
                  
                  {item.notes && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Notes from Session</p>
                      <p className="text-black text-sm leading-relaxed">{item.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center ml-[-2rem]">
            <p className="text-slate-500">No past hearing records found for this case.</p>
          </div>
        )}

        {/* Current/Future Milestone */}
        <div className="relative">
           <div className="absolute -left-[41px] top-0 w-5 h-5 bg-slate-200 rounded-full border-4 border-white shadow-sm" />
           <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 opacity-60">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Next Scheduled Listing</span>
             <p className="text-black font-medium">{new Date(caseData.nextDate).toLocaleDateString('en-GB')}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CaseHistory;
