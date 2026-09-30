'use client';

import React from 'react';
import Link from 'next/link';
import { useProject } from '@/context/ProjectContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ArrowRight,
  FileCheck2,
  GitBranch,
} from 'lucide-react';

export default function OverviewPage() {
  const {
    meta,
    milestones,
    deliverables,
    pendingApprovalsCount,
    approvedCount,
    approveDeliverable,
    openFeedbackModal,
    openDetailModal,
  } = useProject();

  // Pending deliverables to highlight on dashboard
  const pendingDeliverables = deliverables.filter((d) => d.status === 'pending');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Project Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-20 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full font-medium">
                {meta.code}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300 font-medium">{meta.client.company}</span>
              <span className="text-zinc-500">•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                No Prazo
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {meta.title}
            </h1>

            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Portal executivo de homologação contínua. Acompanhe marcos contratuais, valide entregas de design e código e gerencie faturamento em tempo real.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={meta.stagingUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-750 text-xs font-medium transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Abrir Staging (v1.4.2)</span>
            </a>
            <Link
              href="/approvals"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-950/40 active:scale-[0.98] transition-all"
            >
              <span>Central de Aprovações</span>
              {pendingApprovalsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px] font-mono">
                  {pendingApprovalsCount}
                </span>
              )}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* High-Level Project Status Bar */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-zinc-100">
                {meta.overallProgress}% Concluído — {meta.currentPhase}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                {meta.currentSprint} de {meta.totalSprints}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Entrega Final Prevista: <strong className="text-zinc-300 font-medium">{meta.targetDeliveryDate}</strong>
              </span>
            </div>
          </div>

          {/* Detailed Progress Bar */}
          <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800/80">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 rounded-full transition-all duration-700 shadow-sm shadow-cyan-500/50"
              style={{ width: `${meta.overallProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-[11px] text-zinc-500 font-medium">
            <div className="text-cyan-400">1. Discovery ✓</div>
            <div className="text-cyan-400">2. Design System ✓</div>
            <div className="text-cyan-400">3. Core Backend ✓</div>
            <div className="text-cyan-300 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              4. Homologação (75%)
            </div>
            <div className="text-zinc-600">5. Go-Live Prod (0%)</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Days remaining */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Dias Restantes</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">
              {meta.daysRemaining}
            </span>
            <span className="text-xs text-zinc-400">dias corridos</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Alinhado ao cronograma contratual
          </p>
        </div>

        {/* Stat 2: Pending Approvals */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Aprovações Pendentes</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">
              {pendingApprovalsCount}
            </span>
            <span className="text-xs text-zinc-400">itens aguardando</span>
          </div>
          <Link
            href="/approvals"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 mt-2 flex items-center gap-1 transition-colors"
          >
            Revisar entregas agora &rarr;
          </Link>
        </div>

        {/* Stat 3: Active Sprints */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Sprints Ativas</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-blue-400">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">
              {meta.currentSprint}
            </span>
            <span className="text-xs text-zinc-400">de {meta.totalSprints} sprints</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Branch: <span className="font-mono text-zinc-400">{meta.repositoryBranch}</span>
          </p>
        </div>

        {/* Stat 4: Approved deliverables */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Homologadas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">
              {approvedCount}
            </span>
            <span className="text-xs text-zinc-400">de {deliverables.length} entregas</span>
          </div>
          <p className="text-[11px] text-emerald-400/90 mt-2">
            {Math.round((approvedCount / deliverables.length) * 100)}% de aceite acumulado
          </p>
        </div>
      </div>

      {/* Main Section: Deliverables awaiting action & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Priority Deliverables needing approval */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-base font-semibold text-zinc-100">
                Entregas Aguardando Sua Aprovação
              </h2>
            </div>
            <Link
              href="/approvals"
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              Ver todas ({deliverables.length}) &rarr;
            </Link>
          </div>

          {pendingDeliverables.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200">
                Tudo em dia! Nenhuma entrega pendente de aceite.
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                A equipe da MaiaCode está refinando o próximo release candidate no ambiente de staging.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDeliverables.map((item) => (
                <div
                  key={item.id}
                  className="group p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all hover:shadow-xl hover:shadow-cyan-950/10"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {item.version}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-cyan-400 tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-xs text-zinc-500">•</span>
                        <span className="text-xs text-zinc-400">{item.submittedAt}</span>
                      </div>

                      <h3
                        onClick={() => openDetailModal(item)}
                        className="text-sm font-semibold text-zinc-100 group-hover:text-cyan-300 cursor-pointer transition-colors"
                      >
                        {item.title}
                      </h3>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Criteria counter */}
                      {item.checklist.length > 0 && (
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>
                            {item.checklist.filter((c) => c.completed).length} de{' '}
                            {item.checklist.length} critérios validados pelo time técnico
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                      <button
                        onClick={() => approveDeliverable(item.id)}
                        className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-950/40 active:scale-[0.98] transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aprovar</span>
                      </button>

                      <button
                        onClick={() => openFeedbackModal(item)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-amber-300 border border-amber-500/20 text-xs font-medium transition-all"
                      >
                        <span>Ajustes</span>
                      </button>

                      <button
                        onClick={() => openDetailModal(item)}
                        className="w-full text-[11px] text-zinc-400 hover:text-zinc-200 py-1 text-center transition-colors"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline Milestones Cards */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-100">
                Timeline do Projeto & Marcos Contratuais
              </h2>
              <span className="text-xs text-zinc-500">5 Fases de Desenvolvimento</span>
            </div>

            <div className="space-y-3">
              {milestones.map((ms) => {
                const isCompleted = ms.status === 'completed';
                const isInProgress = ms.status === 'in_progress';

                return (
                  <div
                    key={ms.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isInProgress
                        ? 'bg-zinc-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                        : isCompleted
                        ? 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700/80'
                        : 'bg-zinc-950/60 border-zinc-900 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isInProgress
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                              : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                          }`}
                        >
                          {isCompleted ? '✓' : ms.phaseNumber}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-zinc-200">
                              {ms.title}
                            </h3>
                            {isInProgress && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                Fase Atual
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            {ms.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-zinc-500">
                            <span>Período: {ms.startDate} a {ms.endDate}</span>
                            <span>•</span>
                            <span>
                              {ms.completedDeliverablesCount} de {ms.deliverablesCount} entregas
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-mono font-bold ${
                            isCompleted
                              ? 'text-emerald-400'
                              : isInProgress
                              ? 'text-cyan-400'
                              : 'text-zinc-600'
                          }`}
                        >
                          {ms.progressPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Info, Studio Team & Live Environment */}
        <div className="space-y-6">
          {/* Live Environment Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Ambiente de Staging
              </h3>
              <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Online
              </span>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Versão Ativa:</span>
                <span className="font-mono text-zinc-200">v1.4.2-rc3</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Cluster AWS:</span>
                <span className="font-mono text-zinc-200">ecs-homolog-sa</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Último Deploy:</span>
                <span className="text-zinc-300">Hoje às 11:30</span>
              </div>
            </div>

            <a
              href={meta.stagingUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-cyan-300 text-xs font-medium border border-zinc-700 hover:border-cyan-500/30 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Acessar Painel de Homologação
            </a>
          </div>

          {/* Agency Studio Squad Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Squad MaiaCode Studio
              </h3>
              <span className="text-[10px] text-zinc-400">Alocação Dedicada</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  GM
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Gabriel Maia</h4>
                  <p className="text-[11px] text-zinc-400">Lead Architect & Partner</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white text-xs">
                  SA
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Sofia Alencar</h4>
                  <p className="text-[11px] text-zinc-400">Tech Lead & Backend Specialist</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center font-bold text-white text-xs">
                  LV
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Lucas Viana</h4>
                  <p className="text-[11px] text-zinc-400">Senior UI/UX & Design Systems</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800/80">
              <a
                href={meta.agency.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/20 transition-colors"
              >
                <span>Falar com o Gabriel no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Assets Jump */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Arquivos Rápidos
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/assets"
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-white transition-colors"
              >
                <span>Figma Master File v2.4</span>
                <span className="text-[10px] text-zinc-500 font-mono">48.2 MB</span>
              </Link>
              <Link
                href="/assets"
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-white transition-colors"
              >
                <span>Contrato Master SOW</span>
                <span className="text-[10px] text-zinc-500 font-mono">DocuSign</span>
              </Link>
              <Link
                href="/assets"
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-white transition-colors"
              >
                <span>Credenciais Staging AWS</span>
                <span className="text-[10px] text-cyan-400 font-mono">Seguro</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
