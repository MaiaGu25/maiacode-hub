'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import {
  X,
  ExternalLink,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Check,
} from 'lucide-react';
import { FigmaIcon, GithubIcon } from '@/components/ui/BrandIcons';

export function DeliverableDetailModal() {
  const {
    detailModalTarget,
    closeDetailModal,
    approveDeliverable,
    openFeedbackModal,
    addToast,
  } = useProject();

  const [approvalNote, setApprovalNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!detailModalTarget) return null;

  const isPending = detailModalTarget.status === 'pending';
  const isApproved = detailModalTarget.status === 'approved';
  const isChangesRequested = detailModalTarget.status === 'changes_requested';

  const handleApprove = () => {
    approveDeliverable(detailModalTarget.id, approvalNote.trim() || undefined);
    setShowNoteInput(false);
    setApprovalNote('');
    closeDetailModal();
  };

  const handleOpenFeedback = () => {
    const target = detailModalTarget;
    closeDetailModal();
    openFeedbackModal(target);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {detailModalTarget.version}
              </span>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-cyan-400">
                {detailModalTarget.category}
              </span>

              {/* Status Badge */}
              {isApproved && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  <Clock className="w-3.5 h-3.5" /> Aguardando Aprovação
                </span>
              )}
              {isChangesRequested && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" /> Ajustes Solicitados
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              {detailModalTarget.title}
            </h3>
            <p className="text-xs text-zinc-400">
              Submetido em: {detailModalTarget.submittedAt}
            </p>
          </div>

          <button
            onClick={closeDetailModal}
            className="text-zinc-400 hover:text-zinc-200 p-2 rounded-xl hover:bg-zinc-800 transition-colors shrink-0"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-zinc-300">
          {/* Description */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
              Resumo da Entrega
            </h4>
            <p className="text-zinc-300 leading-relaxed text-sm bg-zinc-950/60 p-4 rounded-xl border border-zinc-850">
              {detailModalTarget.description}
            </p>
          </div>

          {/* External Links Bar */}
          <div className="flex flex-wrap gap-2">
            {detailModalTarget.previewUrl && (
              <a
                href={detailModalTarget.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Visualizar em Staging / Demo
              </a>
            )}
            {detailModalTarget.figmaUrl && (
              <a
                href={detailModalTarget.figmaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium transition-colors"
              >
                <FigmaIcon className="w-3.5 h-3.5 text-purple-400" />
                Abrir no Figma
              </a>
            )}
            {detailModalTarget.githubUrl && (
              <a
                href={detailModalTarget.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5 text-zinc-300" />
                Ver Código & Pull Request
              </a>
            )}
          </div>

          {/* Checklist */}
          {detailModalTarget.checklist.length > 0 && (
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-3">
                Critérios de Aceite & Checklist de Validação
              </h4>
              <div className="space-y-2 bg-zinc-950/70 p-4 rounded-xl border border-zinc-850">
                {detailModalTarget.checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        item.completed
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'border-zinc-700 bg-zinc-900 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span
                      className={
                        item.completed ? 'text-zinc-300' : 'text-zinc-500 line-through'
                      }
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attached Artifacts */}
          {detailModalTarget.attachments.length > 0 && (
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-3">
                Arquivos Anexados & Especificações
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {detailModalTarget.attachments.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-200 truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-zinc-500">{file.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        addToast(
                          'Download Iniciado',
                          `Arquivo "${file.name}" baixado para verificação.`,
                          'info'
                        )
                      }
                      className="p-1.5 text-zinc-400 hover:text-cyan-300 hover:bg-zinc-800 rounded-lg transition-colors"
                      title="Baixar arquivo"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback & History */}
          {detailModalTarget.feedbackHistory.length > 0 && (
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-3">
                Histórico de Revisões & Comentários
              </h4>
              <div className="space-y-3">
                {detailModalTarget.feedbackHistory.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200">{fb.author}</span>
                      <span className="text-zinc-500 text-[11px]">{fb.date}</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 block">{fb.role}</span>
                    <p className="text-xs text-zinc-300 pt-1 leading-relaxed border-t border-zinc-900 mt-2">
                      {fb.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Note input for approval */}
          {showNoteInput && isPending && (
            <div className="p-4 bg-zinc-950 border border-emerald-500/30 rounded-xl space-y-2 animate-in fade-in">
              <label className="block text-xs font-medium text-zinc-200">
                Observações de Aceite (Opcional)
              </label>
              <input
                type="text"
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="Ex: Aprovado após validação técnica da equipe de pagamentos."
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/80 shrink-0">
          <button
            onClick={closeDetailModal}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-xl transition-colors"
          >
            Fechar
          </button>

          <div className="flex items-center gap-3">
            {isPending && (
              <>
                <button
                  onClick={handleOpenFeedback}
                  className="px-4 py-2 text-xs font-medium rounded-xl text-amber-300 hover:bg-amber-500/10 border border-amber-500/30 transition-all"
                >
                  Solicitar Ajustes
                </button>
                {showNoteInput ? (
                  <button
                    onClick={handleApprove}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 active:scale-[0.98] transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirmar Aprovação
                  </button>
                ) : (
                  <button
                    onClick={() => setShowNoteInput(true)}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/40 active:scale-[0.98] transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Aprovar Entrega
                  </button>
                )}
              </>
            )}

            {isApproved && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Entrega homologada com sucesso
              </span>
            )}

            {isChangesRequested && (
              <button
                onClick={handleOpenFeedback}
                className="px-4 py-2 text-xs font-medium rounded-xl text-amber-300 hover:bg-amber-500/10 border border-amber-500/30 transition-all"
              >
                Complementar Apontamento
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
