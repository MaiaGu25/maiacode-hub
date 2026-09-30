export type ProjectStatus = 'planning' | 'in_progress' | 'homologation' | 'completed';

export type DeliverableStatus = 'pending' | 'approved' | 'changes_requested';

export type DeliverableCategory = 'design' | 'architecture' | 'frontend' | 'backend' | 'qa' | 'deployment';

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface FeedbackEntry {
  id: string;
  author: string;
  role: string;
  date: string;
  comment: string;
  type: 'approval' | 'request_changes';
  priority?: 'low' | 'medium' | 'high';
}

export interface DeliverableAttachment {
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  category: DeliverableCategory;
  version: string;
  status: DeliverableStatus;
  submittedAt: string;
  reviewedAt?: string;
  milestoneId: string;
  previewUrl?: string;
  figmaUrl?: string;
  githubUrl?: string;
  attachments: DeliverableAttachment[];
  checklist: ChecklistItem[];
  feedbackHistory: FeedbackEntry[];
}

export interface Milestone {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progressPercentage: number;
  startDate: string;
  endDate: string;
  deliverablesCount: number;
  completedDeliverablesCount: number;
  tags: string[];
}

export type AssetCategory = 'design' | 'contracts' | 'builds' | 'credentials';

export interface CredentialField {
  label: string;
  value: string;
  isSecret?: boolean;
}

export interface AssetItem {
  id: string;
  title: string;
  description: string;
  category: AssetCategory;
  fileName: string;
  fileSize: string;
  updatedAt: string;
  version?: string;
  downloadUrl?: string;
  externalUrl?: string;
  badge?: string;
  credentials?: CredentialField[];
}

export type InvoiceStatus = 'paid' | 'pending' | 'upcoming';

export interface InvoiceMilestone {
  id: string;
  invoiceNumber: string;
  title: string;
  percentage: number;
  amount: number; // in BRL cents or float
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  pixCode: string;
  pixQrCodeUrl?: string;
  boletoBarcode: string;
  boletoPdfUrl?: string;
  receiptPdfUrl?: string;
  deliverablesLinked: string[];
  notes?: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  type: 'approval' | 'comment' | 'build' | 'deploy' | 'payment';
}

export interface ProjectMeta {
  id: string;
  code: string;
  title: string;
  client: {
    name: string;
    company: string;
    avatar: string;
    portalAccessUser: string;
  };
  agency: {
    name: string;
    leadName: string;
    leadRole: string;
    contactEmail: string;
    contactPhone: string;
    whatsappUrl: string;
    slackChannel: string;
  };
  overallProgress: number;
  currentPhase: string;
  currentSprint: string;
  totalSprints: number;
  daysRemaining: number;
  startDate: string;
  targetDeliveryDate: string;
  stagingUrl: string;
  repositoryBranch: string;
  contractTotalValue: number;
}
