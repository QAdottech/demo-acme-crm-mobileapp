import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, isDealOverdue } from '@/lib/utils';
import type { Deal } from '@/lib/types';

interface DealCardProps {
  deal: Deal;
  stageColor: string;
  onPress: () => void;
}

export function DealCard({ deal, stageColor, onPress }: DealCardProps) {
  return (
    <Card onPress={onPress} className="mb-3">
      <Text className="text-white font-semibold text-sm" numberOfLines={1}>
        {deal.company}
      </Text>
      <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
        {deal.name}
      </Text>

      <Text className="text-white font-bold text-lg mt-2">
        {formatCurrency(deal.value)}
      </Text>

      <View className="flex-row items-center mt-3">
        <Avatar initials={deal.contactName.split(' ').map((n) => n[0]).join('')} size="sm" />
        <Text className="text-slate-300 text-xs ml-2 flex-1" numberOfLines={1}>
          {deal.contactName}
        </Text>
        {isDealOverdue(deal) && (
          <Text className="text-red-400 text-[10px] font-semibold">Overdue</Text>
        )}
      </View>

      {/* Probability bar */}
      <View className="mt-3">
        <View className="flex-row justify-between mb-1">
          <Text className="text-slate-500 text-[10px]">Probability</Text>
          <Text className="text-slate-400 text-[10px] font-medium">
            {deal.probability}%
          </Text>
        </View>
        <View className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${deal.probability}%`,
              backgroundColor: stageColor,
            }}
          />
        </View>
      </View>
    </Card>
  );
}
