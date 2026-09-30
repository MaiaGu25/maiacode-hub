'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { InvoiceMilestone } from '@/types';
import {
  X,
  QrCode,
  Barcode,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Zap,
  Clock,
} from 'lucide-react';

interface PaymentTargetProps {
  target: {
    invoice: InvoiceMilestone;
    initialTab: 'pix' | 'boleto';
  };
}

function PaymentModalContent({ target }: PaymentTargetProps) {
  const { closePaymentModal, simulateInvoicePayment, addToast } = useProject();
  const [activeTab, setActiveTab] = useState<'pix' | 'boleto'>(target.initialTab);
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedBoleto, setCopiedBoleto] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { invoice } = target;

  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(invoice.amount);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(invoice.pixCode);
    setCopiedPix(true);
    addToast('Chave Pix Copiada!', 'Código Pix Copia e Cola transferido para sua área de transferência.', 'info');
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleCopyBoleto = () => {
    navigator.clipboard.writeText(invoice.boletoBarcode);
    setCopiedBoleto(true);
    addToast('Linha Digitável Copiada!', 'Código de barras do boleto copiado com sucesso.', 'info');
    setTimeout(() => setCopiedBoleto(false), 3000);
  };

  const handleSimulatePayment = (method: 'pix' | 'boleto') => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      simulateInvoicePayment(invoice.id, method);
      closePaymentModal();
    }, 1200);
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
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {invoice.invoiceNumber}
              </span>
              <span className="text-xs text-zinc-400">Vencimento: {invoice.dueDate}</span>
            </div>
            <h3 className="text-base font-semibold text-zinc-100 mt-1">
              Liquidação de Fatura do Projeto
            </h3>
          </div>
          <button
            onClick={closePaymentModal}
            className="text-zinc-400 hover:text-zinc-200 p-2 rounded-xl hover:bg-zinc-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Amount Hero Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">{invoice.title}</p>
              <p className="text-2xl font-bold tracking-tight text-white mt-1">
                {formattedAmount}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Clock className="w-3 h-3" /> Aguardando Pagamento
              </span>
            </div>
          </div>

          {/* Payment Method Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('pix')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'pix'
                  ? 'bg-zinc-800 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              Pix Instantâneo (Compensação Imediata)
            </button>
            <button
              onClick={() => setActiveTab('boleto')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'boleto'
                  ? 'bg-zinc-800 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Barcode className="w-4 h-4 text-cyan-400" />
              Boleto Bancário (D+1)
            </button>
          </div>

          {/* Tab Content: PIX */}
          {activeTab === 'pix' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col items-center justify-center p-5 bg-zinc-950 border border-zinc-850 rounded-xl">
                {/* Visual SVG QR Code */}
                <div className="w-44 h-44 p-3 bg-white rounded-xl shadow-lg flex items-center justify-center relative group">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-black fill-current"
                  >
                    {/* Top-left marker */}
                    <rect x="0" y="0" width="30" height="30" rx="3" fill="#000" />
                    <rect x="5" y="5" width="20" height="20" rx="2" fill="#fff" />
                    <rect x="9" y="9" width="12" height="12" rx="1" fill="#000" />

                    {/* Top-right marker */}
                    <rect x="70" y="0" width="30" height="30" rx="3" fill="#000" />
                    <rect x="75" y="5" width="20" height="20" rx="2" fill="#fff" />
                    <rect x="79" y="9" width="12" height="12" rx="1" fill="#000" />

                    {/* Bottom-left marker */}
                    <rect x="0" y="70" width="30" height="30" rx="3" fill="#000" />
                    <rect x="5" y="75" width="20" height="20" rx="2" fill="#fff" />
                    <rect x="9" y="79" width="12" height="12" rx="1" fill="#000" />

                    {/* Pix matrix pattern dots */}
                    <rect x="36" y="8" width="6" height="6" fill="#000" />
                    <rect x="48" y="14" width="8" height="6" fill="#000" />
                    <rect x="40" y="24" width="16" height="6" fill="#000" />
                    <rect x="10" y="38" width="16" height="6" fill="#000" />
                    <rect x="32" y="36" width="6" height="6" fill="#06b6d4" />
                    <rect x="42" y="38" width="14" height="6" fill="#000" />
                    <rect x="62" y="36" width="10" height="8" fill="#000" />
                    <rect x="78" y="40" width="14" height="6" fill="#000" />

                    {/* Center Pix symbol accent */}
                    <rect x="44" y="44" width="12" height="12" rx="3" fill="#0891b2" />
                    <circle cx="50" cy="50" r="3" fill="#fff" />

                    <rect x="12" y="50" width="8" height="8" fill="#000" />
                    <rect x="26" y="52" width="10" height="6" fill="#000" />
                    <rect x="62" y="50" width="16" height="6" fill="#000" />
                    <rect x="84" y="52" width="8" height="8" fill="#000" />

                    <rect x="36" y="66" width="12" height="6" fill="#000" />
                    <rect x="54" y="68" width="8" height="8" fill="#000" />
                    <rect x="70" y="66" width="22" height="6" fill="#000" />

                    <rect x="36" y="80" width="8" height="12" fill="#000" />
                    <rect x="50" y="82" width="14" height="8" fill="#000" />
                    <rect x="72" y="78" width="8" height="14" fill="#000" />
                    <rect x="86" y="84" width="8" height="8" fill="#000" />
                  </svg>
                </div>
                <p className="text-[11px] text-zinc-400 mt-2 font-medium">
                  Escaneie com o app de qualquer instituição bancária
                </p>
              </div>

              {/* Pix Copia e Cola field */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Pix Copia e Cola
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={invoice.pixCode}
                    className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-400 focus:outline-none select-all"
                  />
                  <button
                    onClick={handleCopyPix}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                      copiedPix
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                    }`}
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPix ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* Instant Simulator Action for Testing */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleSimulatePayment('pix')}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-950/40 active:scale-[0.99] transition-all disabled:opacity-60"
                >
                  <Zap className="w-4 h-4 text-cyan-200 fill-current" />
                  {isProcessing ? 'Confirmando no Banco Central...' : 'Simular Liquidação Imediata Pix (Ambiente Demo)'}
                </button>
                <p className="text-[11px] text-center text-zinc-500 mt-1.5">
                  O valor será debitado e a fatura passará para o status &quot;Pago&quot; em tempo real.
                </p>
              </div>
            </div>
          )}

          {/* Tab Content: BOLETO */}
          {activeTab === 'boleto' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Barcode representation */}
              <div className="p-5 bg-zinc-950 border border-zinc-850 rounded-xl flex flex-col items-center">
                <div className="w-full max-w-sm py-4 px-6 bg-white rounded-lg flex flex-col items-center gap-2">
                  <div className="w-full flex items-center justify-between h-14 overflow-hidden px-2">
                    {/* Simulated vertical bars */}
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full bg-black ${
                          i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-0.5'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-zinc-700 tracking-widest font-semibold">
                    {invoice.boletoBarcode}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-3 font-medium">
                  Banco Itaú Unibanco S.A. | Vencimento em {invoice.dueDate}
                </p>
              </div>

              {/* Linha Digitável */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Linha Digitável (Código de Barras)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={invoice.boletoBarcode}
                    className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-400 focus:outline-none select-all"
                  />
                  <button
                    onClick={handleCopyBoleto}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                      copiedBoleto
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                    }`}
                  >
                    {copiedBoleto ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedBoleto ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* PDF Download and Simulator */}
              <div className="space-y-2 pt-2">
                <a
                  href="#download-boleto"
                  onClick={(e) => {
                    e.preventDefault();
                    addToast('Boleto Baixado', 'O PDF do boleto bancário foi gerado para impressão.', 'info');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-medium transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar Boleto em Formato PDF
                </a>
                <button
                  type="button"
                  onClick={() => handleSimulatePayment('boleto')}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-750 hover:border-cyan-500/50 hover:bg-zinc-855 text-cyan-300 font-medium text-xs transition-all disabled:opacity-60"
                >
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {isProcessing ? 'Processando compensação...' : 'Simular Compensação de Boleto (Demo D+1)'}
                </button>
              </div>
            </div>
          )}

          {/* Security footnote */}
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Ambiente de pagamento seguro MaiaCode Studio & NexusPay. Emissão de NF-e automática após a liquidação.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentModal() {
  const { paymentModalTarget } = useProject();

  if (!paymentModalTarget) return null;

  return (
    <PaymentModalContent
      key={paymentModalTarget.invoice.id + '-' + paymentModalTarget.initialTab}
      target={paymentModalTarget}
    />
  );
}
