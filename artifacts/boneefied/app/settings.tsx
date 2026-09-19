import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Screen } from '@/components/Screen';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';

export default function SettingsScreen() {
  const colors = useColors(); const { resetLocalState, preferences, updatePreferences, saveError, retrySave } = useStudy();
  return <><Stack.Screen options={{ title: 'Settings' }} /><Screen>
    <Text style={[styles.eyebrow, { color: colors.primary }]}>PREFERENCES</Text><Text style={[styles.title, { color: colors.foreground }]}>Settings & help</Text>
    <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.heading, { color: colors.foreground }]}>About Boneefied</Text>
      <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>Study and practice are offline-first. Attempts, misses, bookmarks, and progress stay on this device. No account or backend is required.</Text>
      <Text style={[styles.heading, { color: colors.foreground }]}>How it works</Text>
      <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>Learn reveals source-supported cues. Recall hides cues. Incorrect submitted answers enter Missed; opening an answer never earns mastery. Progress separates accuracy from curriculum coverage.</Text>
      <Text style={[styles.heading, { color: colors.foreground }]}>Sources</Text>
      <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>Cytology lessons use user-supplied transcribed excerpts from Lab 2 pp. 5–8 (printed 35–38) and Quizes(2) pp. 11–12. Original PDFs are not claimed to be present in this runtime.</Text>
      <Text style={[styles.heading, { color: colors.foreground }]}>Appearance</Text>
      <View style={styles.choices}>{(['system', 'light', 'dark'] as const).map((theme) => <Pressable key={theme} onPress={() => updatePreferences({ theme })} style={[styles.choice, { borderColor: preferences.theme === theme ? colors.primary : colors.border }]}><Text style={{ color: colors.foreground }}>{theme[0].toUpperCase() + theme.slice(1)}</Text></Pressable>)}</View>
      <View style={styles.choices}>{(['small', 'default', 'large'] as const).map((textScale) => <Pressable key={textScale} onPress={() => updatePreferences({ textScale })} style={[styles.choice, { borderColor: preferences.textScale === textScale ? colors.primary : colors.border }]}><Text style={{ color: colors.foreground }}>Text {textScale}</Text></Pressable>)}</View>
      <Pressable onPress={() => updatePreferences({ haptics: !preferences.haptics })}><Text style={{ color: colors.primary }}>Haptics: {preferences.haptics ? 'On' : 'Off'}</Text></Pressable>
      {saveError && <Pressable onPress={retrySave}><Text style={{ color: colors.destructive }}>{saveError} Tap to retry.</Text></Pressable>}
      <Pressable testID="reset-local" onPress={() => Alert.alert('Reset local data?', 'This clears attempts, misses, bookmarks, and progress on this device.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive', onPress: resetLocalState }])} style={[styles.reset, { borderColor: colors.destructive }]}><Text style={{ color: colors.destructive, fontWeight: '700' }}>Reset local study data</Text></Pressable>
    </View>
  </Screen></>;
}
const styles = StyleSheet.create({ eyebrow:{fontSize:11,letterSpacing:1.5,fontWeight:'700'},title:{fontSize:28,fontWeight:'700'},panel:{borderWidth:1,borderRadius:16,padding:16,gap:16},heading:{fontSize:17,fontWeight:'700'},choices:{flexDirection:'row',gap:8,flexWrap:'wrap'},choice:{borderWidth:1,borderRadius:10,padding:10},reset:{borderWidth:1,borderRadius:12,padding:14,alignItems:'center'} });