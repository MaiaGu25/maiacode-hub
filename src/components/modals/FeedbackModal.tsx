'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { X, MessageSquareText, AlertCircle, Send } from 'lucide-react';

export function FeedbackModal() {
  const { feedbackModalTarget, closeFeedbackModal, requestChanges } = useProject();
  const [comment, setComment] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [categoryTag, setCategoryTag] = useState('UI/Visual');

  if (!feedbackModalTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const fullComment = `[${categoryTag}] ${comment.trim()}`;
    requestChanges(feedbackModalTarget.id, fullComment, priority);
    setComment('');
    closeFeedbackModal();
  };

  const categories = ['UI/Visual', 'Regra de Negócio', 'Bug/Inconsistência', 'Performance', 'Texto/Copy'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">
                Solicitar Ajustes na Entrega
              </h3>
              <p className="text-xs text-zinc-400 truncate max-w-sm">
                {feedbackModalTarget.title} ({feedbackModalTarget.version})
              </p>
            </div>
          </div>
          <button
            onClick={closeFeedbackModal}
            className="text-zinc-400 hover:text-zinc-200 p-2 rounded-xl hover:bg-zinc-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Deliverable Info Pill */}
          <div className="p-3.5 bg-zinc-950/70 border border-zinc-850 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              Os apontamentos serão registrados diretamente no backlog da squad <strong className="text-zinc-200">MaiaCode Studio</strong> e a entrega retornará para revisão técnica.
            </p>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              Tipo de Ajuste
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategoryTag(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    categoryTag === cat
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-medium'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              Nível de Urgência
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`py-2 px-3 text-xs rounded-lg border text-center transition-all ${
                  priority === 'low'
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-200 font-medium'
                    : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Baixa (Desejável)
              </button>
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-2 px-3 text-xs rounded-lg border text-center transition-all ${
                  priority === 'medium'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-medium'
                    : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Média (Normal)
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-2 px-3 text-xs rounded-lg border text-center transition-all ${
                  priority === 'high'
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 font-medium'
                    : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Alta (Bloqueante)
              </button>
            </div>
          </div>

          {/* Comment textarea */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="feedback-comment" className="text-xs font-medium text-zinc-300">
                Descrição Detalhada do Ajuste
              </label>
              <span className="text-[11px] text-zinc-500">Mínimo recomendado: 20 caracteres</span>
            </div>
            <textarea
              id="feedback-comment"
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ex: No fluxo de KYC em dispositivos mobile, o botão de captura da CNH fica sobreposto pela barra de navegação inferior. Solicito ajustar o padding inferior para 24px..."
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={closeFeedbackModal}
              className="px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!comment.trim()}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-950/30"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar Solicitação de Ajustes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
