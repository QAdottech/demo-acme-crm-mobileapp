import type { Deal } from '@/lib/types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function searchDeals(deals: Deal[], query: string): Deal[] {
  const q = query.trim().toLowerCase();
  if (!q) return deals;

  return deals.filter((deal) =>
    [deal.name, deal.company, deal.contactName, deal.contactEmail].some(
      (field) => field.toLowerCase().includes(q)
    )
  );
}

export function isDealOverdue(deal: Deal, now: Date = new Date()): boolean {
  if (deal.stage === 'customer') return false;
  const close = new Date(`${deal.expectedCloseDate}T00:00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return close < today;
}

export function toTelUrl(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function toMailtoUrl(email: string, subject?: string): string {
  const params = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${email}${params}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}
