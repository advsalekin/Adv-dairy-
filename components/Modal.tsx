
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'info';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = 'Confirm', 
  cancelLabel = 'Cancel',
  type = 'info' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 border border-slate-200">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
          {type === 'danger' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          )}
        </div>
        
        <h3 className="text-2xl font-serif text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 mb-8 leading-relaxed font-medium">{message}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={onConfirm}
            className={`flex-1 py-4 rounded-xl font-bold transition-all shadow-sm active:scale-[0.98] ${type === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
          >
            {confirmLabel}
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98]"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
