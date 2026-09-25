import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ScaledText';
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
      <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>Boneefied helps you study anatomy with lessons, practice, and progress tracking. Your bookmarks and study activity stay on this device, even when you&apos;re offline.</Text>
      <Text style={[styles.heading, { color: colors.foreground }]}>How it works</Text>
      <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>Learn shows helpful cues; Recall hides them so you can test yourself. Questions you answer incorrectly appear in Missed for another try. Progress shows your accuracy and what you&apos;ve covered.</Text>
      <Text style={[styles.heading, { color: colors.foreground }]}>Study content</Text>
      <Text style={{ color: colors.mutedForeground, lineHeight: 20 }}>Explore anatomy by system, learn key structures and relationships, and revisit topics through practice at your own pace.</Text>
      <Text style={[styles.heading, { color: colors.foreground }]}>Appearance</Text>
      <View style={styles.choices}>{(['system', 'light', 'dark'] as const).map((theme) => <Pressable key={theme} onPress={() => updatePreferences({ theme })} style={[styles.choice, { borderColor: preferences.theme === theme ? colors.primary : colors.border }]}><Text style={{ color: colors.foreground }}>{theme[0].toUpperCase() + theme.slice(1)}</Text></Pressable>)}</View>
      <View style={styles.choices}>{(['small', 'default', 'large'] as const).map((textScale) => <Pressable key={textScale} onPress={() => updatePreferences({ textScale })} style={[styles.choice, { borderColor: preferences.textScale === textScale ? colors.primary : colors.border }]}><Text style={{ color: colors.foreground }}>Text {textScale}</Text></Pressable>)}</View>
      <View style={styles.haptics}>
        <Text style={[styles.heading, { color: colors.foreground }]}>Haptics</Text>
        <Text style={{ color: colors.mutedForeground }}>Vibration feedback for practice answers.</Text>
        <View style={styles.choices}>
          {([true, false] as const).map((enabled) => {
            const selected = preferences.haptics === enabled;
            return <Pressable
              key={String(enabled)}
              testID={enabled ? 'haptics-on' : 'haptics-off'}
              accessibilityRole="radio"
              accessibilityLabel={`Haptics ${enabled ? 'on' : 'off'}`}
              accessibilityState={{ checked: selected }}
              aria-checked={selected}
              onPress={() => updatePreferences({ haptics: enabled })}
              style={[styles.choice, styles.hapticsChoice, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.secondary : colors.card }]}
            >
              <Text style={{ color: colors.foreground, fontWeight: selected ? '700' : '400' }}>{selected ? '✓ ' : ''}{enabled ? 'On' : 'Off'}</Text>
            </Pressable>;
          })}
        </View>
      </View>
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
const styles = StyleSheet.create({ eyebrow:{fontSize:11,letterSpacing:1.5,fontWeight:'700'},title:{fontSize:28,fontWeight:'700'},panel:{borderWidth:1,borderRadius:16,padding:16,gap:16},heading:{fontSize:17,fontWeight:'700'},choices:{flexDirection:'row',gap:8,flexWrap:'wrap'},choice:{borderWidth:1,borderRadius:10,padding:10},haptics:{gap:8},hapticsChoice:{minWidth:96,minHeight:44,alignItems:'center',justifyContent:'center'},reset:{borderWidth:1,borderRadius:12,padding:14,alignItems:'center'},modalBackdrop:{flex:1,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',padding:24},modalCard:{width:'100%',maxWidth:420,borderWidth:1,borderRadius:16,padding:20,gap:14},modalActions:{flexDirection:'row',justifyContent:'flex-end',gap:10},modalButton:{minWidth:96,minHeight:44,borderWidth:1,borderRadius:10,alignItems:'center',justifyContent:'center',paddingHorizontal:16} });