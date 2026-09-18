import { Header } from '@/components/layout/Header';
import { PipelineBoard } from '@/components/pipeline/PipelineBoard';
import { Card } from '@/components/ui/Card';
import { usePipeline } from '@/context/PipelineContext';
import { formatCurrency, isDealOverdue } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function PipelineScreen() {
  const router = useRouter();
  const { deals, getTotalValue, getDealsWon } = usePipeline();
  const overdueCount = deals.filter((deal) => isDealOverdue(deal)).length;

  const stats = [
    {
      label: 'Total Deals',
      value: deals.length.toString(),
      icon: 'briefcase-outline' as const,
      color: '#6366F1',
    },
    {
      label: 'Pipeline Value',
      value: formatCurrency(getTotalValue()),
      icon: 'trending-up-outline' as const,
      color: '#10B981',
    },
    {
      label: 'Won',
      value: getDealsWon().toString(),
      icon: 'trophy-outline' as const,
      color: '#F59E0B',
    },
  ];

  return (
    <View className="flex-1 bg-brand-900">
      <Header />

      {/* Stats Row */}
      <View className="flex-row px-4 py-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex-1 py-3 px-3">
            <View className="flex-row items-center mb-1">
              <Ionicons name={stat.icon} size={14} color={stat.color} />
              <Text className="text-slate-400 text-[10px] ml-1">
                {stat.label}
              </Text>
            </View>
            <Text
              className="text-white font-bold"
              style={{ fontSize: stat.label === 'Pipeline Value' ? 14 : 18 }}
              numberOfLines={1}
            >
              {stat.value}
            </Text>
          </Card>
        ))}
      </View>

      {overdueCount > 0 && (
        <Pressable
          onPress={() =>
            router.push({ pathname: '/search', params: { filter: 'overdue' } })
          }
          accessibilityLabel="View overdue deals"
          className="mx-4 mb-2 flex-row items-center bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 active:opacity-80"
        >
          <Ionicons name="alert-circle" size={16} color="#F87171" />
          <Text className="text-red-300 text-sm font-medium ml-2 flex-1">
            {overdueCount} {overdueCount === 1 ? 'deal is' : 'deals are'} past
            expected close
          </Text>
          <Text className="text-red-400 text-xs font-semibold">Review</Text>
        </Pressable>
      )}

      {/* Pipeline Board */}
      <PipelineBoard
        onDealPress={(dealId) => router.push(`/deal/${dealId}`)}
      />
    </View>
  );
}
