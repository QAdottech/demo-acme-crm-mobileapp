import { SearchResultRow } from '@/components/search/SearchResultRow';
import { usePipeline } from '@/context/PipelineContext';
import { PIPELINE_STAGES } from '@/data/stages';
import type { PipelineStage } from '@/lib/types';
import { isDealOverdue, searchDeals } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SearchFilter = 'all' | 'overdue' | PipelineStage;

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { deals } = usePipeline();
  const params = useLocalSearchParams<{ filter?: string | string[] }>();
  const filterParam = Array.isArray(params.filter)
    ? params.filter[0]
    : params.filter;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilter>(
    filterParam === 'overdue' ? 'overdue' : 'all'
  );

  useEffect(() => {
    if (filterParam === 'overdue') {
      setFilter('overdue');
    }
  }, [filterParam]);

  const overdueCount = useMemo(
    () => deals.filter((deal) => isDealOverdue(deal)).length,
    [deals]
  );

  const results = useMemo(() => {
    let next = searchDeals(deals, query);

    if (filter === 'overdue') {
      next = next.filter((deal) => isDealOverdue(deal));
    } else if (filter !== 'all') {
      next = next.filter((deal) => deal.stage === filter);
    }

    return [...next].sort((a, b) =>
      a.expectedCloseDate.localeCompare(b.expectedCloseDate)
    );
  }, [deals, query, filter]);

  const chips: { id: SearchFilter; label: string; count?: number }[] = [
    { id: 'all', label: 'All' },
    { id: 'overdue', label: 'Overdue', count: overdueCount },
    ...PIPELINE_STAGES.map((stage) => ({
      id: stage.id as SearchFilter,
      label: stage.label,
    })),
  ];

  return (
    <View className="flex-1 bg-brand-900">
      <View className="px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
        <Text className="text-white text-2xl font-bold mb-4">Search</Text>

        <View className="flex-row items-center bg-slate-800 rounded-xl border border-slate-600 px-4">
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            className="flex-1 text-white text-base py-3.5 ml-3"
            placeholder="Search companies, deals, or contacts"
            placeholderTextColor="#64748B"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search deals"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              accessibilityLabel="Clear search"
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={18} color="#64748B" />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 12,
          alignItems: 'center',
        }}
      >
        {chips.map((chip) => {
          const selected = filter === chip.id;
          const isOverdue = chip.id === 'overdue';

          return (
            <Pressable
              key={chip.id}
              onPress={() => setFilter(chip.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={{ height: 36, alignSelf: 'center' }}
              className={`mr-2 rounded-full px-3.5 flex-row items-center ${
                selected
                  ? isOverdue
                    ? 'bg-red-500/20 border border-red-500/40'
                    : 'bg-brand-500'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  selected
                    ? isOverdue
                      ? 'text-red-300'
                      : 'text-white'
                    : 'text-slate-300'
                }`}
              >
                {chip.label}
              </Text>
              {chip.count != null && (
                <View
                  className={`ml-1.5 rounded-full px-1.5 min-w-[18px] items-center ${
                    selected ? 'bg-red-500/30' : 'bg-slate-700'
                  }`}
                >
                  <Text
                    className={`text-[11px] font-bold ${
                      selected ? 'text-red-200' : 'text-slate-300'
                    }`}
                  >
                    {chip.count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        className="flex-1 px-4"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <Text className="text-slate-400 text-xs mb-3">
          {results.length} {results.length === 1 ? 'deal' : 'deals'}
        </Text>

        {results.length === 0 ? (
          <View className="items-center mt-16 px-6">
            <Ionicons name="search-outline" size={40} color="#475569" />
            <Text className="text-white text-base font-semibold mt-3 text-center">
              No matching deals
            </Text>
            <Text className="text-slate-400 text-sm mt-1 text-center">
              Try a company, deal name, or contact — or clear filters.
            </Text>
          </View>
        ) : (
          results.map((deal) => (
            <SearchResultRow
              key={deal.id}
              deal={deal}
            onPress={() => router.push(`/deal/${deal.id}`)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
