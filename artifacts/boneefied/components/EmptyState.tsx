import React from 'react';
import { StyleSheet } from 'react-native';
import { Heading, Text } from '@/components/ScaledText';
import { AdaptiveCard } from '@/components/AdaptiveLayout';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
export function EmptyState({ icon, title, message }: { icon: keyof typeof Feather.glyphMap; title: string; message: string }) {
  const colors = useColors();
  return <AdaptiveCard style={[styles.box, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name={icon} size={24} color={colors.primary} /><Heading style={[styles.title, { color: colors.foreground }]}>{title}</Heading><Text style={[styles.message, { color: colors.mutedForeground }]}>{message}</Text></AdaptiveCard>;
}
const styles = StyleSheet.create({ box: { borderWidth: 1, borderRadius: 16, padding: 24, alignItems: 'center', gap: 10 }, title: { fontSize: 16, fontWeight: '700' }, message: { fontSize: 13, lineHeight: 20, textAlign: 'center' } });