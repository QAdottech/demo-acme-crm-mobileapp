import React from 'react';
import { ScrollView } from 'react-native';
import { StageColumn } from './StageColumn';
import { usePipeline } from '@/context/PipelineContext';

interface PipelineBoardProps {
  onDealPress: (dealId: string) => void;
}

export function PipelineBoard({ onDealPress }: PipelineBoardProps) {
  const { stages, getDealsByStage } = usePipeline();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
      decelerationRate="fast"
      snapToInterval={304} // 288 (w-72) + 16 (mr-4)
    >
      {stages.map((stage) => (
        <StageColumn
          key={stage.id}
          stage={stage}
          deals={getDealsByStage(stage.id)}
          onDealPress={onDealPress}
        />
      ))}
    </ScrollView>
  );
}
