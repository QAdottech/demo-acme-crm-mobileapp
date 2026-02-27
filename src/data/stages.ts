import type { StageConfig } from '@/lib/types';

export const PIPELINE_STAGES: StageConfig[] = [
  { id: 'new', label: 'New', color: '#3B82F6', order: 0 },
  { id: 'lead', label: 'Lead', color: '#8B5CF6', order: 1 },
  { id: 'qualified', label: 'Qualified', color: '#F59E0B', order: 2 },
  { id: 'proposal', label: 'Proposal', color: '#F97316', order: 3 },
  { id: 'negotiation', label: 'Negotiation', color: '#EC4899', order: 4 },
  { id: 'customer', label: 'Customer', color: '#10B981', order: 5 },
];
