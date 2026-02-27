export type PipelineStage =
  | 'new'
  | 'lead'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'customer';

export interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: PipelineStage;
  probability: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  expectedCloseDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface StageConfig {
  id: PipelineStage;
  label: string;
  color: string;
  order: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
}

export interface Activity {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'stage_change';
  description: string;
  date: string;
  user: string;
}
