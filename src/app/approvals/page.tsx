'use client';

import React, { useState, useMemo } from 'react';
import { useProject } from '@/context/ProjectContext';
import { DeliverableStatus } from '@/types';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
  FileText,
  Check,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { FigmaIcon, GithubIcon } from '@/components/ui/BrandIcons';

export default function ApprovalsPage() {
  const {
    deliverables,
    approveDeliverable,
    openFeedbackModal,
    openDetailModal,
    pendingApprovalsCount,
    approvedCount,
    changesRequestedCount,
  } = useProject();

  const [statusFilter, setStatusFilter] = useState<'all' | DeliverableStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered deliverables list
  const filteredDeliverables = useMemo(() => {
    return deliverables.filter((item) => {
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesVersion = item.version.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesVersion) {
          return false;
        }
      }
      return true;
    });
  }, [deliverables, statusFilter, categoryFilter, searchQuery]);

  const categories = [
    { id: 'all', label: 'Todas as Áreas' },
    { id: 'design', label: 'Design & UI/UX' },
    { id: 'backend', label: 'Backend & APIs' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'architecture', label: 'Arquitetura' },
    { id: 'qa', label: 'QA & Staging' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Central de Aprovações
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {deliverables.length} Itens
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Homologue e valide formalmente entregáveis técnicos, protótipos de design e builds de homologação da squad.
          </p>
        </div>

        {/* Quick status counters */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
              statusFilter === 'pending'
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-semibold shadow-sm'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pendentes: {pendingApprovalsCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
              statusFilter === 'approved'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold shadow-sm'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aprovados: {approvedCount}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-850 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              statusFilter === 'all'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Todos ({deliverables.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              statusFilter === 'pending'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pendentes ({pendingApprovalsCount})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              statusFilter === 'approved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Aprovados ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('changes_requested')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              statusFilter === 'changes_requested'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Ajustes ({changesRequestedCount})
          </button>
        </div>

        {/* Search Input & Category */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar entregáveis..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/60"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Deliverable Review Cards List */}
      {filteredDeliverables.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-3">
          <Filter className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-300">
            Nenhum entregável encontrado com os filtros selecionados.
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Tente remover os filtros ou limpar o termo de busca para visualizar os itens cadastrados.
          </p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="text-xs text-cyan-400 hover:underline pt-2 font-medium"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDeliverables.map((item) => {
            const isPending = item.status === 'pending';
            const isApproved = item.status === 'approved';
            const isChangesRequested = item.status === 'changes_requested';

            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border transition-all duration-200 ${
                  isPending
                    ? 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 shadow-lg shadow-zinc-950/40'
                    : isApproved
                    ? 'bg-zinc-900/40 border-zinc-850 hover:border-zinc-800'
                    : 'bg-zinc-900/40 border-amber-500/30'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column: Info, Badges, Details */}
                  <div className="space-y-3 flex-1">
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {item.version}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-cyan-400">
                        {item.category}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-400">
                        Submetido: {item.submittedAt}
                      </span>

                      {/* Status indicator */}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado Formalmente
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          <Clock className="w-3.5 h-3.5" /> Aguardando Sua Aprovação
                        </span>
                      )}
                      {isChangesRequested && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <AlertTriangle className="w-3.5 h-3.5" /> Ajustes Solicitados
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => openDetailModal(item)}
                      className="text-base sm:text-lg font-bold text-zinc-100 hover:text-cyan-300 cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
                      {item.description}
                    </p>

                    {/* Acceptance Criteria Checklist Preview */}
                    {item.checklist.length > 0 && (
                      <div className="pt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                            Checklist de Homologação:
                          </span>
                          <span className="text-xs text-zinc-400 font-mono">
                            {item.checklist.filter((c) => c.completed).length} /{' '}
                            {item.checklist.length} concluídos
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.checklist.slice(0, 4).map((chk) => (
                            <div
                              key={chk.id}
                              className="flex items-center gap-2 text-xs p-2 rounded-lg bg-zinc-950/60 border border-zinc-850"
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                                  chk.completed
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                    : 'border-zinc-700 bg-zinc-900 text-transparent'
                                }`}
                              >
                                <Check className="w-2.5 h-2.5" />
                              </div>
                              <span
                                className={`truncate ${
                                  chk.completed ? 'text-zinc-300' : 'text-zinc-500'
                                }`}
                              >
                                {chk.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* External links & attachments */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {item.previewUrl && (
                        <a
                          href={item.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Abrir Staging Demo</span>
                        </a>
                      )}

                      {item.figmaUrl && (
                        <a
                          href={item.figmaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
                        >
                          <FigmaIcon className="w-3 h-3 text-purple-400" />
                          <span>Figma Prototype</span>
                        </a>
                      )}

                      {item.githubUrl && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
                        >
                          <GithubIcon className="w-3 h-3 text-zinc-300" />
                          <span>GitHub Release</span>
                        </a>
                      )}

                      {item.attachments.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{item.attachments.length} arquivos anexados</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex lg:flex-col items-center gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-800">
                    {isPending && (
                      <>
                        <button
                          onClick={() => approveDeliverable(item.id)}
                          className="flex-1 lg:w-44 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-950/40 active:scale-[0.98] transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Aprovar Entrega</span>
                        </button>

                        <button
                          onClick={() => openFeedbackModal(item)}
                          className="flex-1 lg:w-44 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-amber-300 border border-amber-500/20 font-medium text-xs transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Solicitar Ajustes</span>
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <div className="w-full lg:w-44 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Homologado</span>
                        </div>
                        <p className="text-[10px] text-zinc-400">
                          Revisado: {item.reviewedAt || 'Recente'}
                        </p>
                      </div>
                    )}

                    {isChangesRequested && (
                      <div className="w-full lg:w-44 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-amber-400 font-semibold text-xs">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Em Correção</span>
                        </div>
                        <p className="text-[10px] text-zinc-400">
                          Squad notificada
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => openDetailModal(item)}
                      className="w-full lg:w-44 flex items-center justify-center gap-1 px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-xl transition-all"
                    >
                      <span>Ver Ficha Completa</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
