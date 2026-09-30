'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  Deliverable,
  InvoiceMilestone,
  Milestone,
  ProjectMeta,
  ActivityItem,
  DeliverableStatus,
} from '@/types';
import {
  mockProjectMeta,
  mockMilestones,
  mockDeliverables,
  mockInvoices,
  mockActivities,
} from '@/data/mock-project';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}

interface ProjectContextType {
  meta: ProjectMeta;
  milestones: Milestone[];
  deliverables: Deliverable[];
  invoices: InvoiceMilestone[];
  activities: ActivityItem[];
  toasts: ToastNotification[];
  pendingApprovalsCount: number;
  approvedCount: number;
  changesRequestedCount: number;
  paidAmount: number;
  pendingAmount: number;
  totalAmount: number;

  // Actions
  approveDeliverable: (id: string, note?: string) => void;
  requestChanges: (id: string, comment: string, priority?: 'low' | 'medium' | 'high') => void;
  simulateInvoicePayment: (invoiceId: string, method: 'pix' | 'boleto') => void;
  addToast: (title: string, message: string, type?: ToastNotification['type']) => void;
  dismissToast: (id: string) => void;

  // Modal triggers
  feedbackModalTarget: Deliverable | null;
  openFeedbackModal: (deliverable: Deliverable) => void;
  closeFeedbackModal: () => void;

  paymentModalTarget: { invoice: InvoiceMilestone; initialTab: 'pix' | 'boleto' } | null;
  openPaymentModal: (invoice: InvoiceMilestone, initialTab?: 'pix' | 'boleto') => void;
  closePaymentModal: () => void;

  detailModalTarget: Deliverable | null;
  openDetailModal: (deliverable: Deliverable) => void;
  closeDetailModal: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [meta] = useState<ProjectMeta>(mockProjectMeta);
  const [milestones] = useState<Milestone[]>(mockMilestones);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(mockDeliverables);
  const [invoices, setInvoices] = useState<InvoiceMilestone[]>(mockInvoices);
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Modals state
  const [feedbackModalTarget, setFeedbackModalTarget] = useState<Deliverable | null>(null);
  const [paymentModalTarget, setPaymentModalTarget] = useState<{
    invoice: InvoiceMilestone;
    initialTab: 'pix' | 'boleto';
  } | null>(null);
  const [detailModalTarget, setDetailModalTarget] = useState<Deliverable | null>(null);

  const addToast = useCallback(
    (title: string, message: string, type: ToastNotification['type'] = 'success') => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      const newToast: ToastNotification = {
        id,
        title,
        message,
        type,
        timestamp: Date.now(),
      };
      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 4.5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const approveDeliverable = useCallback(
    (id: string, note?: string) => {
      let targetTitle = '';
      setDeliverables((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            targetTitle = item.title;
            const newFeedback = note
              ? [
                  ...item.feedbackHistory,
                  {
                    id: 'fb-' + Date.now(),
                    author: meta.client.name,
                    role: `${meta.client.company} (Cliente)`,
                    date: 'Agora',
                    comment: note,
                    type: 'approval' as const,
                  },
                ]
              : item.feedbackHistory;

            return {
              ...item,
              status: 'approved' as DeliverableStatus,
              reviewedAt: 'Agora',
              feedbackHistory: newFeedback,
            };
          }
          return item;
        })
      );

      // Add activity
      const newAct: ActivityItem = {
        id: 'act-' + Date.now(),
        timestamp: 'Agora mesmo',
        title: `Entrega Aprovada: ${targetTitle || 'Item'}`,
        description: note || 'Aprovação formal registrada com sucesso no portal.',
        user: {
          name: meta.client.name,
          avatar: meta.client.avatar,
          role: 'Cliente Autorizado',
        },
        type: 'approval',
      };
      setActivities((prev) => [newAct, ...prev]);

      addToast(
        'Entrega Aprovada com Sucesso!',
        `"${targetTitle}" foi homologado e marcado como concluído.`,
        'success'
      );
    },
    [meta, addToast]
  );

  const requestChanges = useCallback(
    (id: string, comment: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
      let targetTitle = '';
      setDeliverables((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            targetTitle = item.title;
            return {
              ...item,
              status: 'changes_requested' as DeliverableStatus,
              reviewedAt: 'Agora',
              feedbackHistory: [
                ...item.feedbackHistory,
                {
                  id: 'fb-' + Date.now(),
                  author: meta.client.name,
                  role: `${meta.client.company} (Cliente)`,
                  date: 'Agora',
                  comment,
                  type: 'request_changes' as const,
                  priority,
                },
              ],
            };
          }
          return item;
        })
      );

      // Add activity
      const newAct: ActivityItem = {
        id: 'act-' + Date.now(),
        timestamp: 'Agora mesmo',
        title: `Ajustes Solicitados: ${targetTitle || 'Item'}`,
        description: comment.length > 80 ? comment.substring(0, 80) + '...' : comment,
        user: {
          name: meta.client.name,
          avatar: meta.client.avatar,
          role: 'Cliente Autorizado',
        },
        type: 'comment',
      };
      setActivities((prev) => [newAct, ...prev]);

      addToast(
        'Ajustes Solicitados',
        `A equipe da MaiaCode Studio foi notificada dos apontamentos em "${targetTitle}".`,
        'info'
      );
    },
    [meta, addToast]
  );

  const simulateInvoicePayment = useCallback(
    (invoiceId: string, method: 'pix' | 'boleto') => {
      let invTitle = '';
      let amountFormatted = '';

      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === invoiceId) {
            invTitle = inv.title;
            amountFormatted = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(inv.amount);
            return {
              ...inv,
              status: 'paid',
              paidDate: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              notes: `Pagamento simulado via ${method === 'pix' ? 'Pix Instantâneo' : 'Boleto Bancário'} confirmado com sucesso.`,
            };
          }
          return inv;
        })
      );

      // Add activity
      const newAct: ActivityItem = {
        id: 'act-' + Date.now(),
        timestamp: 'Agora mesmo',
        title: `Pagamento Confirmado: ${invTitle}`,
        description: `Liquidação de ${amountFormatted} via ${method.toUpperCase()} confirmada no sistema bancário.`,
        user: {
          name: meta.client.name,
          avatar: meta.client.avatar,
          role: 'Financeiro NexusPay',
        },
        type: 'payment',
      };
      setActivities((prev) => [newAct, ...prev]);

      addToast(
        'Pagamento Confirmado!',
        `A fatura no valor de ${amountFormatted} foi liquidada com sucesso via ${method.toUpperCase()}.`,
        'success'
      );
    },
    [meta, addToast]
  );

  // Computed counts
  const pendingApprovalsCount = useMemo(
    () => deliverables.filter((d) => d.status === 'pending').length,
    [deliverables]
  );

  const approvedCount = useMemo(
    () => deliverables.filter((d) => d.status === 'approved').length,
    [deliverables]
  );

  const changesRequestedCount = useMemo(
    () => deliverables.filter((d) => d.status === 'changes_requested').length,
    [deliverables]
  );

  const totalAmount = useMemo(
    () => invoices.reduce((acc, curr) => acc + curr.amount, 0),
    [invoices]
  );

  const paidAmount = useMemo(
    () =>
      invoices
        .filter((i) => i.status === 'paid')
        .reduce((acc, curr) => acc + curr.amount, 0),
    [invoices]
  );

  const pendingAmount = useMemo(
    () =>
      invoices
        .filter((i) => i.status === 'pending')
        .reduce((acc, curr) => acc + curr.amount, 0),
    [invoices]
  );

  // Modal open/close helpers
  const openFeedbackModal = useCallback((deliverable: Deliverable) => {
    setFeedbackModalTarget(deliverable);
  }, []);

  const closeFeedbackModal = useCallback(() => {
    setFeedbackModalTarget(null);
  }, []);

  const openPaymentModal = useCallback(
    (invoice: InvoiceMilestone, initialTab: 'pix' | 'boleto' = 'pix') => {
      setPaymentModalTarget({ invoice, initialTab });
    },
    []
  );

  const closePaymentModal = useCallback(() => {
    setPaymentModalTarget(null);
  }, []);

  const openDetailModal = useCallback((deliverable: Deliverable) => {
    setDetailModalTarget(deliverable);
  }, []);

  const closeDetailModal = useCallback(() => {
    setDetailModalTarget(null);
  }, []);

  const value = useMemo(
    () => ({
      meta,
      milestones,
      deliverables,
      invoices,
      activities,
      toasts,
      pendingApprovalsCount,
      approvedCount,
      changesRequestedCount,
      paidAmount,
      pendingAmount,
      totalAmount,
      approveDeliverable,
      requestChanges,
      simulateInvoicePayment,
      addToast,
      dismissToast,
      feedbackModalTarget,
      openFeedbackModal,
      closeFeedbackModal,
      paymentModalTarget,
      openPaymentModal,
      closePaymentModal,
      detailModalTarget,
      openDetailModal,
      closeDetailModal,
    }),
    [
      meta,
      milestones,
      deliverables,
      invoices,
      activities,
      toasts,
      pendingApprovalsCount,
      approvedCount,
      changesRequestedCount,
      paidAmount,
      pendingAmount,
      totalAmount,
      approveDeliverable,
      requestChanges,
      simulateInvoicePayment,
      addToast,
      dismissToast,
      feedbackModalTarget,
      openFeedbackModal,
      closeFeedbackModal,
      paymentModalTarget,
      openPaymentModal,
      closePaymentModal,
      detailModalTarget,
      openDetailModal,
      closeDetailModal,
    ]
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
