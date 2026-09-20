import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Screen } from '@/components/Screen';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';

export default function SettingsScreen() {
  const colors = useColors(); const { resetLocalState, preferences, updatePreferences, saveError, retrySave } = useStudy();
  const [resetOpen, setResetOpen] = useState(false);
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
      <Pressable testID="reset-local" onPress={() => setResetOpen(true)} style={[styles.reset, { borderColor: colors.destructive }]}><Text style={{ color: colors.destructive, fontWeight: '700' }}>Reset local study data</Text></Pressable>
    </View>
  </Screen>
    <Modal visible={resetOpen} transparent animationType="fade" onRequestClose={() => setResetOpen(false)}>
      <View style={styles.modalBackdrop}>
        <View accessibilityRole="alert" style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.heading, { color: colors.foreground }]}>Reset local data?</Text>
          <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>This clears attempts, misses, bookmarks, and progress on this device.</Text>
          <View style={styles.modalActions}>
            <Pressable accessibilityRole="button" onPress={() => setResetOpen(false)} style={[styles.modalButton, { borderColor: colors.border }]}>
              <Text style={{ color: colors.foreground, fontWeight: '700' }}>Cancel</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => { resetLocalState(); setResetOpen(false); }} style={[styles.modalButton, { backgroundColor: colors.destructive, borderColor: colors.destructive }]}>
              <Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Reset</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  </>;
}
const styles = StyleSheet.create({ eyebrow:{fontSize:11,letterSpacing:1.5,fontWeight:'700'},title:{fontSize:28,fontWeight:'700'},panel:{borderWidth:1,borderRadius:16,padding:16,gap:16},heading:{fontSize:17,fontWeight:'700'},choices:{flexDirection:'row',gap:8,flexWrap:'wrap'},choice:{borderWidth:1,borderRadius:10,padding:10},reset:{borderWidth:1,borderRadius:12,padding:14,alignItems:'center'},modalBackdrop:{flex:1,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',padding:24},modalCard:{width:'100%',maxWidth:420,borderWidth:1,borderRadius:16,padding:20,gap:14},modalActions:{flexDirection:'row',justifyContent:'flex-end',gap:10},modalButton:{minWidth:96,minHeight:44,borderWidth:1,borderRadius:10,alignItems:'center',justifyContent:'center',paddingHorizontal:16} });