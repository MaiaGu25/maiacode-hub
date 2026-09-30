'use client';

import React, { useState } from 'react';
import { ProjectProvider } from '@/context/ProjectContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../ui/ToastContainer';
import { FeedbackModal } from '../modals/FeedbackModal';
import { PaymentModal } from '../modals/PaymentModal';
import { DeliverableDetailModal } from '../modals/DeliverableDetailModal';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ProjectProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          isMobileMenuOpen={mobileMenuOpen}
        />

        <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Mobile Sidebar Drawer Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative w-72 max-w-full bg-zinc-950 border-r border-zinc-850 h-full flex flex-col z-50">
                <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          )}

          {/* Main Page Content */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Global Modals & Notifications */}
        <FeedbackModal />
        <PaymentModal />
        <DeliverableDetailModal />
        <ToastContainer />
      </div>
    </ProjectProvider>
  );
}
