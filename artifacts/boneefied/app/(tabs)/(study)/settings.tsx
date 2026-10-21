import React, { useState } from 'react';
import { Alert, Linking, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Heading, Text, useTypographyLayout } from '@/components/ScaledText';
import { AdaptiveButton, AdaptiveCard, AdaptiveRow } from '@/components/AdaptiveLayout';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/Screen';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';
import { useLocale } from '@/locales/useLocale';

export default function SettingsScreen() {
  const colors = useColors(); const { resetLocalState, preferences, updatePreferences, saveError, retrySave } = useStudy();
  const { language, setLanguage, hydrated, saveError: languageSaveError, retrySave: retryLanguageSave, t } = useLocale();
  const { isLargeText, isCompactTextLayout } = useTypographyLayout();
  const shouldReflow = isLargeText || isCompactTextLayout;
  const insets = useSafeAreaInsets();
  const [resetOpen, setResetOpen] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const openPrivacyPolicy = () => {
    void Linking.openURL('https://boneefied.com/site/privacy-policy').catch(() => {
      Alert.alert(t('settings.privacyPolicy.label'), t('settings.privacyPolicy.openError'));
    });
  };
  return <><Stack.Screen options={{ title: t('settings.navigationTitle') }} /><Screen>
    <Text style={[styles.eyebrow, { color: colors.primary }]}>{t('settings.eyebrow')}</Text><Heading style={[styles.title, { color: colors.foreground }]}>{t('settings.pageTitle')}</Heading>
    <AdaptiveCard style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Heading style={[styles.heading, { color: colors.foreground }]}>{t('settings.appearanceHeading')}</Heading>
      <View style={styles.choices}>{(['system', 'light', 'dark'] as const).map((theme) => {
        const selected = preferences.theme === theme;
        return <AdaptiveButton key={theme} accessibilityRole="radio" accessibilityLabel={t('settings.theme.accessibilityLabel', { theme: t(`settings.theme.${theme}`) })} accessibilityState={{ checked: selected }} aria-checked={selected} onPress={() => updatePreferences({ theme })} style={[styles.choice, shouldReflow && styles.choiceReflow, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.secondary : colors.card }]}><Text style={{ color: colors.foreground, fontWeight: selected ? '700' : '400' }}>{selected ? '✓ ' : ''}{t(`settings.theme.${theme}`)}</Text></AdaptiveButton>;
      })}</View>
      <View style={styles.choices}>{(['small', 'default', 'large'] as const).map((textScale) => {
        const selected = preferences.textScale === textScale;
        return <AdaptiveButton key={textScale} accessibilityRole="radio" accessibilityLabel={t('settings.textScale.label', { scale: t(`settings.textScale.${textScale}`) })} accessibilityState={{ checked: selected }} aria-checked={selected} onPress={() => updatePreferences({ textScale })} style={[styles.choice, shouldReflow && styles.choiceReflow, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.secondary : colors.card }]}><Text style={{ color: colors.foreground, fontWeight: selected ? '700' : '400' }}>{selected ? '✓ ' : ''}{t('settings.textScale.label', { scale: t(`settings.textScale.${textScale}`) })}</Text></AdaptiveButton>;
      })}</View>
      <View style={styles.language}>
        <Heading style={[styles.heading, { color: colors.foreground }]}>{t('settings.language.heading')}</Heading>
        <Text style={{ color: colors.mutedForeground }}>{t('settings.language.description')}</Text>
        <View style={styles.choices}>
          {([
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
          ] as const).map(({ value, label }) => {
            const selected = language === value;
            return <AdaptiveButton
              key={value}
              testID={`language-${value}`}
              disabled={!hydrated}
              accessibilityRole="radio"
              accessibilityLabel={label}
              accessibilityState={{ checked: selected, disabled: !hydrated }}
              aria-checked={selected}
              onPress={() => setLanguage(value)}
              style={[styles.choice, styles.languageChoice, shouldReflow && styles.choiceReflow, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.secondary : colors.card }]}
            >
              <Text style={{ color: colors.foreground, fontWeight: selected ? '700' : '400' }}>{selected ? '✓ ' : ''}{label}</Text>
            </AdaptiveButton>;
          })}
        </View>
      </View>
      <View style={styles.haptics}>
        <Heading style={[styles.heading, { color: colors.foreground }]}>{t('settings.haptics.heading')}</Heading>
        <Text style={{ color: colors.mutedForeground }}>{t('settings.haptics.description')}</Text>
        <View style={styles.choices}>
          {([true, false] as const).map((enabled) => {
            const selected = preferences.haptics === enabled;
            return <AdaptiveButton
              key={String(enabled)}
              testID={enabled ? 'haptics-on' : 'haptics-off'}
              accessibilityRole="radio"
              accessibilityLabel={t('settings.haptics.accessibilityLabel', { state: t(`settings.haptics.${enabled ? 'on' : 'off'}`) })}
              accessibilityState={{ checked: selected }}
              aria-checked={selected}
              onPress={() => updatePreferences({ haptics: enabled })}
              style={[styles.choice, styles.hapticsChoice, shouldReflow && styles.choiceReflow, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.secondary : colors.card }]}
            >
              <Text style={{ color: colors.foreground, fontWeight: selected ? '700' : '400' }}>{selected ? '✓ ' : ''}{t(`settings.haptics.${enabled ? 'on' : 'off'}`)}</Text>
            </AdaptiveButton>;
          })}
        </View>
      </View>
      {saveError && <AdaptiveButton onPress={retrySave}><Text style={{ color: colors.destructive }}>{saveError === 'Local save failed. Retry to protect your offline progress.' ? t('settings.saveError.initial') : saveError === 'Local save failed again.' ? t('settings.saveError.retryFailed') : saveError} {t('settings.saveError.retryPrompt')}</Text></AdaptiveButton>}
      {languageSaveError && <AdaptiveButton accessibilityRole="button" onPress={retryLanguageSave} style={styles.reset}><Text style={{ color: colors.destructive }}>{t('settings.language.saveError')}</Text></AdaptiveButton>}
      <AdaptiveButton testID="reset-local" onPress={() => setResetOpen(true)} style={[styles.reset, { borderColor: colors.destructive }]}><Text style={{ color: colors.destructive, fontWeight: '700' }}>{t('settings.resetLocalData.button')}</Text></AdaptiveButton>
    </AdaptiveCard>
    <AdaptiveCard style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <AdaptiveButton
        testID="settings-about-toggle"
        accessibilityRole="button"
        accessibilityLabel={t('settings.about.accessibilityLabel')}
        accessibilityState={{ expanded: aboutExpanded }}
        onPress={() => setAboutExpanded((current) => !current)}
        style={styles.aboutToggle}
      >
        <Text style={[styles.aboutToggleTitle, { color: colors.foreground }]}>{t('settings.about.toggleTitle')}</Text>
        <Feather name={aboutExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.mutedForeground} />
      </AdaptiveButton>
      <AdaptiveButton
        testID="settings-privacy-policy"
        accessibilityRole="link"
        accessibilityLabel={t('settings.privacyPolicy.accessibilityLabel')}
        onPress={openPrivacyPolicy}
        style={styles.aboutToggle}
      >
        <Text style={{ color: colors.primary }}>{t('settings.privacyPolicy.label')}</Text>
        <Feather name="external-link" size={18} color={colors.primary} />
      </AdaptiveButton>
      {aboutExpanded && <View style={styles.aboutContent}>
        <Heading style={[styles.heading, { color: colors.foreground }]}>{t('settings.about.heading')}</Heading>
        <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>{t('settings.about.description')}</Text>
        <Heading style={[styles.heading, { color: colors.foreground }]}>{t('settings.about.howItWorksHeading')}</Heading>
        <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>{t('settings.about.howItWorksDescription')}</Text>
        <Heading style={[styles.heading, { color: colors.foreground }]}>{t('settings.about.studyContentHeading')}</Heading>
        <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>{t('settings.about.studyContentDescription')}</Text>
      </View>}
    </AdaptiveCard>
  </Screen>
    <Modal visible={resetOpen} transparent animationType="fade" onRequestClose={() => setResetOpen(false)}>
      <ScrollView style={styles.modalOverlay} contentContainerStyle={[styles.modalBackdrop, shouldReflow && { paddingTop: Math.max(24, insets.top + 12), paddingBottom: Math.max(24, insets.bottom + 12) }]}>
        <AdaptiveCard accessibilityRole="alert" style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Heading style={[styles.heading, { color: colors.foreground }]}>{t('settings.resetConfirmation.title')}</Heading>
          <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>{t('settings.resetConfirmation.description')}</Text>
          <AdaptiveRow style={[styles.modalActions, shouldReflow && styles.modalActionsLarge]}>
            <AdaptiveButton accessibilityRole="button" onPress={() => setResetOpen(false)} style={[styles.modalButton, shouldReflow && styles.modalButtonLarge, { borderColor: colors.border }]}>
              <Text style={{ color: colors.foreground, fontWeight: '700' }}>{t('settings.resetConfirmation.cancel')}</Text>
            </AdaptiveButton>
            <AdaptiveButton accessibilityRole="button" onPress={() => { resetLocalState(); setResetOpen(false); }} style={[styles.modalButton, shouldReflow && styles.modalButtonLarge, { backgroundColor: colors.destructive, borderColor: colors.destructive }]}>
              <Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>{t('settings.resetConfirmation.confirm')}</Text>
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
  language: { gap: 8 },
  languageChoice: { minWidth: 112, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
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