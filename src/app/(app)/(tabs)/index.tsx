import { Header } from '@/components/layout/Header';
import { PipelineBoard } from '@/components/pipeline/PipelineBoard';
import { Card } from '@/components/ui/Card';
import { usePipeline } from '@/context/PipelineContext';
import { formatCurrency } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function PipelineScreen() {
  const router = useRouter();
  const { deals, getTotalValue, getDealsWon } = usePipeline();

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

      {/* Pipeline Board */}
      <PipelineBoard
        onDealPress={(dealId) =>
          router.push(`/(app)/deal/${dealId}` as `/${string}`)
        }
      />
    </View>
  );
}
