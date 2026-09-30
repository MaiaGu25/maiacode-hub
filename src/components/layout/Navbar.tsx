'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProject } from '@/context/ProjectContext';
import {
  Bell,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Navbar({ onToggleMobileMenu, isMobileMenuOpen }: NavbarProps) {
  const { meta, activities, pendingApprovalsCount } = useProject();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-850 bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Toggle & Project Switcher */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-900"
            aria-label="Abrir Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold tracking-tight text-white text-base">
                MaiaCode
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold tracking-wider">
                HUB
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-zinc-800 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-zinc-300 font-medium">{meta.title}</span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400 font-mono">{meta.currentSprint}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Staging Link Action */}
          <a
            href={meta.stagingUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 hover:border-cyan-500/40 transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Ambiente Staging</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>

          {/* Activity / Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-zinc-400 hover:text-zinc-200 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
              aria-label="Notificações"
            >
              <Bell className="w-4 h-4" />
              {pendingApprovalsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-zinc-950 animate-pulse" />
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                        Atividades Recentes
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono">
                        {activities.length}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">Tempo Real</span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {activities.map((act) => (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-850 hover:border-zinc-800 transition-all text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-zinc-200">{act.title}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {act.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          {act.description}
                        </p>
                        <div className="flex items-center gap-1.5 pt-1 text-[10px] text-zinc-500">
                          <span>{act.user.name}</span>
                          <span>•</span>
                          <span>{act.user.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-zinc-800 text-center">
                    <Link
                      href="/approvals"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Ir para Central de Aprovações &rarr;
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Client Avatar / Profile */}
          <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 p-0.5 shrink-0">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-xs font-bold text-cyan-300">
                HV
              </div>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-zinc-200 leading-none">
                {meta.client.name}
              </p>
              <p className="text-[10px] text-zinc-500 leading-none mt-1">
                {meta.client.company}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
