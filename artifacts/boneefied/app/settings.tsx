import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Heading, Text, useTypographyLayout } from '@/components/ScaledText';
import { AdaptiveButton, AdaptiveCard, AdaptiveRow } from '@/components/AdaptiveLayout';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/Screen';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';

export default function SettingsScreen() {
  const colors = useColors(); const { resetLocalState, preferences, updatePreferences, saveError, retrySave } = useStudy();
  const { isLargeText, isCompactTextLayout } = useTypographyLayout();
  const shouldReflow = isLargeText || isCompactTextLayout;
  const insets = useSafeAreaInsets();
  const [resetOpen, setResetOpen] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  return <><Stack.Screen options={{ title: 'Settings' }} /><Screen>
    <Text style={[styles.eyebrow, { color: colors.primary }]}>PREFERENCES</Text><Heading style={[styles.title, { color: colors.foreground }]}>Settings & help</Heading>
    <AdaptiveCard style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Heading style={[styles.heading, { color: colors.foreground }]}>Appearance</Heading>
      <View style={styles.choices}>{(['system', 'light', 'dark'] as const).map((theme) => <AdaptiveButton key={theme} accessibilityRole="radio" accessibilityLabel={`${theme} theme`} accessibilityState={{ checked: preferences.theme === theme }} aria-checked={preferences.theme === theme} onPress={() => updatePreferences({ theme })} style={[styles.choice, shouldReflow && styles.choiceReflow, { borderColor: preferences.theme === theme ? colors.primary : colors.border }]}><Text style={{ color: colors.foreground }}>{theme[0].toUpperCase() + theme.slice(1)}</Text></AdaptiveButton>)}</View>
      <View style={styles.choices}>{(['small', 'default', 'large'] as const).map((textScale) => <AdaptiveButton key={textScale} accessibilityRole="radio" accessibilityLabel={`Text ${textScale}`} accessibilityState={{ checked: preferences.textScale === textScale }} aria-checked={preferences.textScale === textScale} onPress={() => updatePreferences({ textScale })} style={[styles.choice, shouldReflow && styles.choiceReflow, { borderColor: preferences.textScale === textScale ? colors.primary : colors.border }]}><Text style={{ color: colors.foreground }}>Text {textScale}</Text></AdaptiveButton>)}</View>
      <View style={styles.haptics}>
        <Heading style={[styles.heading, { color: colors.foreground }]}>Haptics</Heading>
        <Text style={{ color: colors.mutedForeground }}>Vibration feedback for practice answers.</Text>
        <View style={styles.choices}>
          {([true, false] as const).map((enabled) => {
            const selected = preferences.haptics === enabled;
            return <AdaptiveButton
              key={String(enabled)}
              testID={enabled ? 'haptics-on' : 'haptics-off'}
              accessibilityRole="radio"
              accessibilityLabel={`Haptics ${enabled ? 'on' : 'off'}`}
              accessibilityState={{ checked: selected }}
              aria-checked={selected}
              onPress={() => updatePreferences({ haptics: enabled })}
              style={[styles.choice, styles.hapticsChoice, shouldReflow && styles.choiceReflow, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.secondary : colors.card }]}
            >
              <Text style={{ color: colors.foreground, fontWeight: selected ? '700' : '400' }}>{selected ? '✓ ' : ''}{enabled ? 'On' : 'Off'}</Text>
            </AdaptiveButton>;
          })}
        </View>
      </View>
      {saveError && <AdaptiveButton onPress={retrySave}><Text style={{ color: colors.destructive }}>{saveError} Tap to retry.</Text></AdaptiveButton>}
      <AdaptiveButton testID="reset-local" onPress={() => setResetOpen(true)} style={[styles.reset, { borderColor: colors.destructive }]}><Text style={{ color: colors.destructive, fontWeight: '700' }}>Reset local study data</Text></AdaptiveButton>
    </AdaptiveCard>
    <AdaptiveCard style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <AdaptiveButton
        testID="settings-about-toggle"
        accessibilityRole="button"
        accessibilityLabel="About Boneefied & how it works"
        accessibilityState={{ expanded: aboutExpanded }}
        onPress={() => setAboutExpanded((current) => !current)}
        style={styles.aboutToggle}
      >
        <Text style={[styles.aboutToggleTitle, { color: colors.foreground }]}>About Boneefied &amp; how it works</Text>
        <Feather name={aboutExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.mutedForeground} />
      </AdaptiveButton>
      {aboutExpanded && <View style={styles.aboutContent}>
        <Heading style={[styles.heading, { color: colors.foreground }]}>About Boneefied</Heading>
        <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>Boneefied helps you study anatomy with lessons, practice, and progress tracking. Your bookmarks and study activity stay on this device, even when you&apos;re offline.</Text>
        <Heading style={[styles.heading, { color: colors.foreground }]}>How it works</Heading>
        <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>Learn shows helpful cues; Recall hides them so you can test yourself. Questions you answer incorrectly appear in Missed for another try. Progress shows your accuracy and what you&apos;ve covered.</Text>
        <Heading style={[styles.heading, { color: colors.foreground }]}>Study content</Heading>
        <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>Explore anatomy by system, learn key structures and relationships, and revisit topics through practice at your own pace.</Text>
      </View>}
    </AdaptiveCard>
  </Screen>
    <Modal visible={resetOpen} transparent animationType="fade" onRequestClose={() => setResetOpen(false)}>
      <ScrollView style={styles.modalOverlay} contentContainerStyle={[styles.modalBackdrop, shouldReflow && { paddingTop: Math.max(24, insets.top + 12), paddingBottom: Math.max(24, insets.bottom + 12) }]}>
        <AdaptiveCard accessibilityRole="alert" style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Heading style={[styles.heading, { color: colors.foreground }]}>Reset local data?</Heading>
          <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>This clears attempts, misses, bookmarks, and progress on this device.</Text>
          <AdaptiveRow style={[styles.modalActions, shouldReflow && styles.modalActionsLarge]}>
            <AdaptiveButton accessibilityRole="button" onPress={() => setResetOpen(false)} style={[styles.modalButton, shouldReflow && styles.modalButtonLarge, { borderColor: colors.border }]}>
              <Text style={{ color: colors.foreground, fontWeight: '700' }}>Cancel</Text>
            </AdaptiveButton>
            <AdaptiveButton accessibilityRole="button" onPress={() => { resetLocalState(); setResetOpen(false); }} style={[styles.modalButton, shouldReflow && styles.modalButtonLarge, { backgroundColor: colors.destructive, borderColor: colors.destructive }]}>
              <Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Reset</Text>
            </AdaptiveButton>
          </AdaptiveRow>
        </AdaptiveCard>
      </ScrollView>
    </Modal>
  </>;
}
const styles = StyleSheet.create({
  eyebrow: { fontSize: 11, letterSpacing: 1.5, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '700' },
  panel: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 16 },
  heading: { fontSize: 17, fontWeight: '700' },
  choices: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  choice: { borderWidth: 1, borderRadius: 10, padding: 10 },
  choiceReflow: { minHeight: 44, justifyContent: 'center' },
  haptics: { gap: 8 },
  hapticsChoice: { minWidth: 96, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  reset: { borderWidth: 1, borderRadius: 12, padding: 14, alignItems: 'center' },
  aboutCard: { borderWidth: 1, borderRadius: 16, padding: 16 },
  aboutToggle: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 12 },
  aboutToggleTitle: { flex: 1, minWidth: 0, fontSize: 16, fontWeight: '700' },
  aboutContent: { gap: 12, paddingTop: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  modalBackdrop: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { width: '100%', maxWidth: 420, borderWidth: 1, borderRadius: 16, padding: 20, gap: 14 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  modalActionsLarge: { flexDirection: 'column', alignItems: 'stretch' },
  modalButton: { minWidth: 96, minHeight: 44, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  modalButtonLarge: { width: '100%', paddingVertical: 12 },
});