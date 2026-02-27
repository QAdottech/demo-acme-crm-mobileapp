import React from 'react';
import { Text, View } from 'react-native';
import { formatCurrency } from '@/lib/utils';

interface StageHeaderProps {
  label: string;
  color: string;
  dealCount: number;
  totalValue: number;
}

export function StageHeader({
  label,
  color,
  dealCount,
  totalValue,
}: StageHeaderProps) {
  return (
    <View className="mb-3">
      <View className="flex-row items-center mb-1">
        <View
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: color }}
        />
        <Text className="text-white font-bold text-base flex-1">{label}</Text>
        <View
          className="rounded-full px-2.5 py-0.5"
          style={{ backgroundColor: `${color}25` }}
        >
          <Text className="text-xs font-semibold" style={{ color }}>
            {dealCount}
          </Text>
        </View>
      </View>
      <Text className="text-slate-400 text-xs ml-5">
        {formatCurrency(totalValue)}
      </Text>
    </View>
  );
}
