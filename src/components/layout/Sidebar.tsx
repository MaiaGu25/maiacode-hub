'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProject } from '@/context/ProjectContext';
import {
  LayoutDashboard,
  CheckSquare,
  FolderGit2,
  CreditCard,
  MessageCircle,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { meta, pendingApprovalsCount, pendingAmount } = useProject();

  const navigation = [
    {
      name: 'Visão Geral',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Central de Aprovações',
      href: '/approvals',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      name: 'Arquivos & Entregáveis',
      href: '/assets',
      icon: FolderGit2,
      badge: null,
    },
    {
      name: 'Financeiro & Faturas',
      href: '/finance',
      icon: CreditCard,
      badge: pendingAmount > 0 ? 'Pendente' : null,
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
    },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between border-r border-zinc-850 bg-zinc-950/90 h-[calc(100vh-4rem)] sticky top-16 select-none p-4">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Project Card */}
        <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-850">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5 font-medium">
            <span>Status Geral</span>
            <span className="font-mono text-cyan-400 font-semibold">{meta.overallProgress}%</span>
          </div>

          {/* Mini progress bar */}
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${meta.overallProgress}%` }}
            />
          </div>

          <p className="text-xs font-semibold text-zinc-200 truncate">
            {meta.code}
          </p>
          <p className="text-[11px] text-zinc-400 truncate">
            {meta.currentPhase}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-3 mb-2">
            Menu Principal
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-cyan-300 shadow-sm border border-zinc-800'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold font-mono rounded-full border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Agency Studio Support Footer */}
      <div className="pt-4 border-t border-zinc-850 space-y-3">
        <div className="p-3 rounded-xl bg-gradient-to-b from-zinc-900/60 to-zinc-950 border border-zinc-850">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
              Squad Responsável
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-zinc-200">{meta.agency.leadName}</p>
            <p className="text-[11px] text-zinc-500">{meta.agency.leadRole}</p>
          </div>

          {/* Quick Chat Triggers */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-zinc-800/80">
            <a
              href={meta.agency.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/20 transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              WhatsApp
            </a>
            <a
              href={`mailto:${meta.agency.contactEmail}`}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-[11px] font-medium transition-colors"
            >
              Email Lead
            </a>
          </div>
        </div>

        <div className="text-[10px] text-zinc-400 flex items-center justify-between px-1">
          <span>MaiaCode Hub v2.4</span>
          <span>SLA: 2h úteis</span>
        </div>
      </div>
    </aside>
  );
}
