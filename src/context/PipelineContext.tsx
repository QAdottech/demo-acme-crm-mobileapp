import { MOCK_DEALS, MOCK_ACTIVITIES } from '@/data/deals';
import { PIPELINE_STAGES } from '@/data/stages';
import type { Activity, Deal, PipelineStage, StageConfig } from '@/lib/types';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface PipelineContextType {
  deals: Deal[];
  stages: StageConfig[];
  getDealsByStage: (stage: PipelineStage) => Deal[];
  getDealById: (id: string) => Deal | undefined;
  getActivitiesForDeal: (dealId: string) => Activity[];
  moveDealToNextStage: (dealId: string) => void;
  getTotalValue: () => number;
  getDealsWon: () => number;
}

const PipelineContext = createContext<PipelineContextType | null>(null);

export function usePipeline() {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
}

export function PipelineProvider({ children }: { children: React.ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);

  const getDealsByStage = useCallback(
    (stage: PipelineStage) => deals.filter((d) => d.stage === stage),
    [deals]
  );

  const getDealById = useCallback(
    (id: string) => deals.find((d) => d.id === id),
    [deals]
  );

  const getActivitiesForDeal = useCallback((dealId: string): Activity[] => {
    return MOCK_ACTIVITIES[dealId] ?? [];
  }, []);

  const moveDealToNextStage = useCallback(
    (dealId: string) => {
      setDeals((prev) =>
        prev.map((deal) => {
          if (deal.id !== dealId) return deal;
          const currentStageIndex = PIPELINE_STAGES.findIndex(
            (s) => s.id === deal.stage
          );
          const nextStage = PIPELINE_STAGES[currentStageIndex + 1];
          if (!nextStage) return deal;
          return {
            ...deal,
            stage: nextStage.id,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const getTotalValue = useCallback(
    () => deals.reduce((sum, d) => sum + d.value, 0),
    [deals]
  );

  const getDealsWon = useCallback(
    () => deals.filter((d) => d.stage === 'customer').length,
    [deals]
  );

  return (
    <PipelineContext.Provider
      value={{
        deals,
        stages: PIPELINE_STAGES,
        getDealsByStage,
        getDealById,
        getActivitiesForDeal,
        moveDealToNextStage,
        getTotalValue,
        getDealsWon,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
}
