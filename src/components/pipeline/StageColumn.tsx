import React from 'react';
import { ScrollView, View } from 'react-native';
import { StageHeader } from './StageHeader';
import { DealCard } from './DealCard';
import type { Deal, StageConfig } from '@/lib/types';

interface StageColumnProps {
  stage: StageConfig;
  deals: Deal[];
  onDealPress: (dealId: string) => void;
}

export function StageColumn({ stage, deals, onDealPress }: StageColumnProps) {
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <View className="w-72 mr-4">
      <StageHeader
        label={stage.label}
        color={stage.color}
        dealCount={deals.length}
        totalValue={totalValue}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            stageColor={stage.color}
            onPress={() => onDealPress(deal.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
