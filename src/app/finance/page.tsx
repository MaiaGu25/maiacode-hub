'use client';

import React from 'react';
import { useProject } from '@/context/ProjectContext';
import { InvoiceMilestone } from '@/types';
import {
  CreditCard,
  QrCode,
  Barcode,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';

export default function FinancePage() {
  const {
    invoices,
    paidAmount,
    pendingAmount,
    totalAmount,
    openPaymentModal,
    addToast,
  } = useProject();

  const formatBRL = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const paidPercentage = Math.round((paidAmount / totalAmount) * 100);

  const handleDownloadReceipt = (invoice: InvoiceMilestone) => {
    addToast(
      'Nota Fiscal & Recibo',
      `O comprovante oficial e NF-e da fatura ${invoice.invoiceNumber} foram baixados.`,
      'info'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Financeiro & Faturamento do Projeto
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Contrato Master
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Gestão transparente de parcelas vinculadas a marcos técnicos, emissão de NF-e e pagamentos via Pix ou Boleto.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Faturado para: <strong className="text-zinc-100">NexusPay S.A.</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Value */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Valor Contratado</span>
            <CreditCard className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-white font-mono">
            {formatBRL(totalAmount)}
          </p>
          <p className="text-[11px] text-zinc-500">
            4 parcelas vinculadas a marcos de entrega
          </p>
        </div>

        {/* KPI 2: Paid Amount */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Total Liquidado</span>
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-emerald-400 font-mono">
            {formatBRL(paidAmount)}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${paidPercentage}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              {paidPercentage}%
            </span>
          </div>
        </div>

        {/* KPI 3: Pending Amount */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Fatura em Aberto</span>
            <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-amber-300 font-mono">
            {formatBRL(pendingAmount)}
          </p>
          <p className="text-[11px] text-amber-400/90 flex items-center gap-1">
            <span>Parcela 03 aguardando liquidação</span>
          </p>
        </div>

        {/* KPI 4: Final Handover Forecast */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Previsão Handover</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-zinc-200 font-mono">
            {formatBRL(24000)}
          </p>
          <p className="text-[11px] text-zinc-500">
            Parcela 04 (Go-Live e Deploy Produção)
          </p>
        </div>
      </div>

      {/* Invoices List / Milestone Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-100">
            Cronograma de Parcelas & Faturas
          </h2>
          <span className="text-xs text-zinc-400">
            Todas as faturas incluem emissão de Nota Fiscal Eletrônica (NF-e)
          </span>
        </div>

        <div className="space-y-4">
          {invoices.map((inv) => {
            const isPaid = inv.status === 'paid';
            const isPending = inv.status === 'pending';
            const isUpcoming = inv.status === 'upcoming';

            return (
              <div
                key={inv.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isPending
                    ? 'bg-zinc-900/90 border-cyan-500/40 shadow-xl shadow-cyan-950/20'
                    : isPaid
                    ? 'bg-zinc-900/50 border-zinc-800/80'
                    : 'bg-zinc-950/60 border-zinc-900 opacity-75'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Invoice Meta */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold">
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
                        {inv.percentage}% do contrato
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-400">
                        Vencimento: <strong className="text-zinc-300 font-medium">{inv.dueDate}</strong>
                      </span>

                      {/* Status badge */}
                      {isPaid && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pago
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3.5 h-3.5" /> Aguardando Pagamento
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                          Previsão Futura
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-zinc-100">
                      {inv.title}
                    </h3>

                    {/* Linked Deliverables */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-zinc-400">Entregáveis vinculados:</span>
                      {inv.deliverablesLinked.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {inv.notes && (
                      <p className="text-xs text-zinc-400 pt-1 leading-relaxed">
                        {inv.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: Amount & Action Triggers */}
                  <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-800">
                    <div className="text-left lg:text-right">
                      <p className="text-xs text-zinc-400 font-medium">Valor da Parcela</p>
                      <p className="text-2xl font-bold font-mono tracking-tight text-white mt-0.5">
                        {formatBRL(inv.amount)}
                      </p>
                      {inv.paidDate && (
                        <p className="text-[11px] text-emerald-400 mt-0.5">
                          Liquidado em {inv.paidDate}
                        </p>
                      )}
                    </div>

                    {/* Payment Triggers */}
                    <div className="flex items-center gap-2">
                      {isPending && (
                        <>
                          <button
                            onClick={() => openPaymentModal(inv, 'pix')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-950/40 active:scale-[0.98] transition-all"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Pagar via Pix</span>
                          </button>

                          <button
                            onClick={() => openPaymentModal(inv, 'boleto')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 font-medium text-xs transition-all"
                          >
                            <Barcode className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Gerar Boleto</span>
                          </button>
                        </>
                      )}

                      {isPaid && (
                        <button
                          onClick={() => handleDownloadReceipt(inv)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium transition-all"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Baixar NF-e & Recibo</span>
                        </button>
                      )}

                      {isUpcoming && (
                        <span className="text-xs text-zinc-400 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-850">
                          Disponível após homologação da Fase 04
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legal & Banking Details Box */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-400 leading-relaxed">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Condições Contratuais & Garantias</span>
          </div>
          <p>
            O faturamento segue o regime acordado no SOW Master #4981. O pagamento de cada marco autoriza o início da fase subsequente e a liberação das tags de versão no repositório de produção.
          </p>
          <p className="text-[11px] text-zinc-500">
            Dúvidas financeiras? Contate nosso time pelo e-mail{' '}
            <a href="mailto:financeiro@maiacode.dev" className="text-cyan-400 hover:underline">
              financeiro@maiacode.dev
            </a>
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Dados Bancários Oficiais (MaiaCode Studio)</span>
          </div>
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850 space-y-1 font-mono text-[11px] text-zinc-300">
            <p>Razão Social: MaiaCode Tecnologia e Design Ltda</p>
            <p>CNPJ: 45.192.839/0001-92 | Banco Inter (077)</p>
            <p>Agência: 0001 | Conta Corrente: 9182374-1</p>
            <p>Chave Pix CNPJ: 45192839000192</p>
          </div>
        </div>
      </div>
    </div>
  );
}
