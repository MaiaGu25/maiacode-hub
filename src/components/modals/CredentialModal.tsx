'use client';

import React, { useState } from 'react';
import { AssetItem } from '@/types';
import { useProject } from '@/context/ProjectContext';
import { X, KeyRound, Eye, EyeOff, Copy, Check, ShieldAlert } from 'lucide-react';

interface CredentialModalProps {
  item: AssetItem | null;
  onClose: () => void;
}

export function CredentialModal({ item, onClose }: CredentialModalProps) {
  const { addToast } = useProject();
  const [revealedKeys, setRevealedKeys] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<number | null>(null);

  if (!item || !item.credentials) return null;

  const toggleReveal = (idx: number) => {
    setRevealedKeys((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copyToClipboard = (text: string, label: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(idx);
    addToast('Credencial Copiada', `${label} copiado para a área de transferência.`, 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">
                Credenciais & Acessos Seguros
              </h3>
              <p className="text-xs text-zinc-400 truncate max-w-xs">{item.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-2 rounded-xl hover:bg-zinc-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-zinc-950/80 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              Estas credenciais dão acesso aos servidores de homologação e APIs da sprint. Nunca compartilhe estes segredos publicamente.
            </p>
          </div>

          <div className="space-y-3">
            {item.credentials.map((cred, idx) => {
              const isRevealed = revealedKeys[idx] || !cred.isSecret;
              return (
                <div
                  key={idx}
                  className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                      {cred.label}
                    </span>
                    {cred.isSecret && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        Sensível
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 font-mono text-xs px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 truncate select-all">
                      {isRevealed ? cred.value : '••••••••••••••••••••••••••••••••'}
                    </div>

                    {cred.isSecret && (
                      <button
                        type="button"
                        onClick={() => toggleReveal(idx)}
                        className="p-2 text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
                        title={isRevealed ? 'Ocultar' : 'Revelar'}
                      >
                        {isRevealed ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4 text-cyan-400" />
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => copyToClipboard(cred.value, cred.label, idx)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        copiedKey === idx
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-750'
                      }`}
                    >
                      {copiedKey === idx ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedKey === idx ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-zinc-800 bg-zinc-900/60">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
