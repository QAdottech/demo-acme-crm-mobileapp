import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PIPELINE_STAGES } from '@/data/stages';
import type { Deal } from '@/lib/types';
import { formatCurrency, formatDate, isDealOverdue } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface SearchResultRowProps {
  deal: Deal;
  onPress: () => void;
}

export function SearchResultRow({ deal, onPress }: SearchResultRowProps) {
  const stage = PIPELINE_STAGES.find((s) => s.id === deal.stage);
  const overdue = isDealOverdue(deal);

  return (
    <Card onPress={onPress} className="mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-white font-semibold text-base" numberOfLines={1}>
            {deal.company}
          </Text>
          <Text className="text-slate-400 text-sm mt-0.5" numberOfLines={1}>
            {deal.name}
          </Text>
        </View>
        <Text className="text-white font-bold text-base">
          {formatCurrency(deal.value)}
        </Text>
      </View>

      <View className="flex-row items-center mt-3">
        {stage && <Badge label={stage.label} color={stage.color} />}
        <View className="flex-row items-center ml-auto">
          <Ionicons
            name={overdue ? 'alert-circle' : 'calendar-outline'}
            size={14}
            color={overdue ? '#F87171' : '#64748B'}
          />
          <Text
            className={`text-xs ml-1 ${overdue ? 'text-red-400 font-semibold' : 'text-slate-400'}`}
          >
            {overdue ? 'Overdue · ' : ''}
            {formatDate(deal.expectedCloseDate)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mt-3">
        <Avatar
          initials={deal.contactName
            .split(' ')
            .map((n) => n[0])
            .join('')}
          size="sm"
        />
        <Text className="text-slate-300 text-xs ml-2 flex-1" numberOfLines={1}>
          {deal.contactName}
        </Text>
      </View>
    </Card>
  );
}
