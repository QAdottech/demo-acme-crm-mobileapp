export const BRAND_COLORS = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#334155',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
} as const;

export const STAGE_COLORS: Record<string, string> = {
  new: '#3B82F6',
  lead: '#8B5CF6',
  qualified: '#F59E0B',
  proposal: '#F97316',
  negotiation: '#EC4899',
  customer: '#10B981',
};
