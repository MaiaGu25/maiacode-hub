'use client';

import React, { useState, useMemo } from 'react';
import { useProject } from '@/context/ProjectContext';
import { AssetItem, AssetCategory } from '@/types';
import { mockAssets } from '@/data/mock-project';
import { CredentialModal } from '@/components/modals/CredentialModal';
import {
  Search,
  Download,
  ExternalLink,
  KeyRound,
  FileText,
  Layers,
  Upload,
  Eye,
  Package,
} from 'lucide-react';

export default function AssetsPage() {
  const { addToast } = useProject();
  const [assets] = useState<AssetItem[]>(mockAssets);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCredentialModalItem, setActiveCredentialModalItem] = useState<AssetItem | null>(null);

  const categories = [
    { id: 'all', label: 'Todos os Arquivos', count: assets.length },
    {
      id: 'design',
      label: 'Design & UI Assets',
      count: assets.filter((a) => a.category === 'design').length,
    },
    {
      id: 'contracts',
      label: 'Contratos & Jurídico',
      count: assets.filter((a) => a.category === 'contracts').length,
    },
    {
      id: 'builds',
      label: 'Builds & Código',
      count: assets.filter((a) => a.category === 'builds').length,
    },
    {
      id: 'credentials',
      label: 'Credenciais & Acessos',
      count: assets.filter((a) => a.category === 'credentials').length,
    },
  ];

  const filteredAssets = useMemo(() => {
    return assets.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesFile = item.fileName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesFile) return false;
      }
      return true;
    });
  }, [assets, selectedCategory, searchQuery]);

  const handleDownload = (item: AssetItem) => {
    addToast(
      'Download Solicitado',
      `O download do arquivo "${item.fileName}" foi iniciado.`,
      'info'
    );
  };

  const handleRequestAsset = () => {
    addToast(
      'Solicitação Registrada',
      'A equipe técnica foi notificada sobre a solicitação de um novo pacote de arquivos.',
      'info'
    );
  };

  const getCategoryIcon = (category: AssetCategory) => {
    switch (category) {
      case 'design':
        return <Layers className="w-5 h-5 text-purple-400" />;
      case 'contracts':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'builds':
        return <Package className="w-5 h-5 text-emerald-400" />;
      case 'credentials':
        return <KeyRound className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Arquivos & Repositório de Entregáveis
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {assets.length} Itens
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Repositório central de documentos contratuais, arquivos de design, executáveis de staging e credenciais seguras.
          </p>
        </div>

        <button
          onClick={handleRequestAsset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-750 text-xs font-medium transition-all shrink-0"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>Solicitar Arquivo Específico</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-zinc-950 text-zinc-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome, formato..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/60"
          />
        </div>
      </div>

      {/* Grid of Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAssets.map((item) => {
          const isCredential = item.category === 'credentials';

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/80 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:shadow-zinc-950/40"
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* File Meta Box */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-850 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="truncate max-w-[180px] font-mono text-zinc-300">
                      {item.fileName}
                    </span>
                    <span className="font-mono text-zinc-500">{item.fileSize}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                    <span>Atualizado em: {item.updatedAt}</span>
                    {item.version && <span>{item.version}</span>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-zinc-800/80">
                {isCredential ? (
                  <button
                    onClick={() => setActiveCredentialModalItem(item)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 text-xs font-medium transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visualizar Chaves de Acesso</span>
                  </button>
                ) : item.externalUrl ? (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-medium transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Abrir no Navegador</span>
                  </a>
                ) : (
                  <button
                    onClick={() => handleDownload(item)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-medium transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Baixar Arquivo</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sensitive Credential Modal */}
      <CredentialModal
        item={activeCredentialModalItem}
        onClose={() => setActiveCredentialModalItem(null)}
      />
    </div>
  );
}
