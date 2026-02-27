import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { usePipeline } from '@/context/PipelineContext';
import { PIPELINE_STAGES } from '@/data/stages';
import { formatCurrency, formatDate, getTimeAgo } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACTIVITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  note: 'document-text-outline',
  call: 'call-outline',
  email: 'mail-outline',
  meeting: 'people-outline',
  stage_change: 'swap-horizontal-outline',
};

export default function DealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getDealById, getActivitiesForDeal, moveDealToNextStage } =
    usePipeline();

  const deal = getDealById(id!);
  const activities = getActivitiesForDeal(id!);

  if (!deal) {
    return (
      <View className="flex-1 bg-brand-900 items-center justify-center">
        <Text className="text-slate-400 text-base">Deal not found</Text>
      </View>
    );
  }

  const stage = PIPELINE_STAGES.find((s) => s.id === deal.stage);
  const nextStage = PIPELINE_STAGES.find(
    (s) => s.order === (stage?.order ?? 0) + 1
  );
  const isLastStage = !nextStage;

  const handleMoveToNextStage = () => {
    if (!nextStage) return;
    Alert.alert(
      'Move Deal',
      `Move "${deal.name}" to ${nextStage.label}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Move',
          onPress: () => {
            moveDealToNextStage(deal.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-brand-900"
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
    >
      {/* Header Info */}
      <View className="px-4 pt-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white text-2xl font-bold flex-1" numberOfLines={2}>
            {deal.company}
          </Text>
        </View>
        <Text className="text-slate-400 text-base mb-3">{deal.name}</Text>
        {stage && <Badge label={stage.label} color={stage.color} />}
      </View>

      {/* Key Metrics */}
      <View className="flex-row px-4 mt-4 gap-3">
        <Card className="flex-1">
          <Text className="text-slate-400 text-xs mb-1">Deal Value</Text>
          <Text className="text-white text-xl font-bold">
            {formatCurrency(deal.value)}
          </Text>
        </Card>
        <Card className="flex-1">
          <Text className="text-slate-400 text-xs mb-1">Probability</Text>
          <Text className="text-white text-xl font-bold">
            {deal.probability}%
          </Text>
        </Card>
      </View>

      <View className="px-4 mt-3">
        <Card>
          <Text className="text-slate-400 text-xs mb-1">Expected Close</Text>
          <Text className="text-white text-base font-semibold">
            {formatDate(deal.expectedCloseDate)}
          </Text>
        </Card>
      </View>

      {/* Contact Info */}
      <View className="px-4 mt-6">
        <Text className="text-white text-lg font-bold mb-3">Contact</Text>
        <Card>
          <View className="flex-row items-center">
            <Avatar
              initials={deal.contactName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            />
            <View className="ml-3 flex-1">
              <Text className="text-white font-semibold text-base">
                {deal.contactName}
              </Text>
              <Text className="text-slate-400 text-sm">
                {deal.contactEmail}
              </Text>
              <Text className="text-slate-500 text-sm">
                {deal.contactPhone}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Notes */}
      <View className="px-4 mt-6">
        <Text className="text-white text-lg font-bold mb-3">Notes</Text>
        <Card>
          <Text className="text-slate-300 text-sm leading-5">
            {deal.notes}
          </Text>
        </Card>
      </View>

      {/* Activity Timeline */}
      {activities.length > 0 && (
        <View className="px-4 mt-6">
          <Text className="text-white text-lg font-bold mb-3">Activity</Text>
          {activities.map((activity, index) => (
            <View key={activity.id} className="flex-row mb-4">
              {/* Timeline line */}
              <View className="items-center mr-3">
                <View className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 items-center justify-center">
                  <Ionicons
                    name={ACTIVITY_ICONS[activity.type] ?? 'ellipse-outline'}
                    size={14}
                    color="#94A3B8"
                  />
                </View>
                {index < activities.length - 1 && (
                  <View className="w-0.5 flex-1 bg-slate-700 mt-1" />
                )}
              </View>
              {/* Content */}
              <View className="flex-1 pb-2">
                <Text className="text-slate-300 text-sm">
                  {activity.description}
                </Text>
                <Text className="text-slate-500 text-xs mt-1">
                  {getTimeAgo(activity.date)} &middot; {activity.user}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Action Button */}
      {!isLastStage && (
        <View className="px-4 mt-6">
          <Button
            title={`Move to ${nextStage?.label}`}
            onPress={handleMoveToNextStage}
          />
        </View>
      )}
    </ScrollView>
  );
}
