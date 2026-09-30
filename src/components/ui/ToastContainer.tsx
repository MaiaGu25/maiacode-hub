'use client';

import React from 'react';
import { useProject } from '@/context/ProjectContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useProject();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'bg-zinc-900/95 border-emerald-500/40 text-zinc-100 shadow-emerald-950/20'
                : isError
                ? 'bg-zinc-900/95 border-rose-500/40 text-zinc-100 shadow-rose-950/20'
                : isWarning
                ? 'bg-zinc-900/95 border-amber-500/40 text-zinc-100 shadow-amber-950/20'
                : 'bg-zinc-900/95 border-cyan-500/40 text-zinc-100 shadow-cyan-950/20'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {isInfo && <Info className="w-5 h-5 text-cyan-400" />}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <h4 className="text-sm font-semibold tracking-tight text-zinc-100">
                {toast.title}
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 -mr-1 -mt-1 rounded-lg hover:bg-zinc-800"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
