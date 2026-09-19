import React, { useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { AnatomyImageViewer } from '@/components/AnatomyImageViewer';
import { content } from '@/content/canonical';
import type { Asset, Lesson } from '@/content/model';
import { useStudy } from '@/context/StudyContext';
import { useColors } from '@/hooks/useColors';

const imageSources: Record<string, number> = {
  'asset-skull-front': require('@/assets/images/anatomy/gray190-skull-front.png'),
  'asset-skull-lateral': require('@/assets/images/anatomy/gray188-skull-lateral.png'),
  'asset-vertebral-column': require('@/assets/images/anatomy/gray111-vertebral-column.png'),
  'asset-cervical-vertebra': require('@/assets/images/anatomy/gray84-cervical-vertebra.png'),
};

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { bookmarks, toggleBookmark } = useStudy();
  const [mode, setMode] = useState<'learn' | 'recall'>('learn');
  const [expanded, setExpanded] = useState<string | null>(null);
  const module = content.modules.find((item) => item.id === id) ?? content.modules[0];
  const lessons = module.lessons ?? [];
  const structures = content.structures.filter((item) => item.moduleId === module.id);
  const moduleAssets = content.assets.filter((asset) => module.sourceIds.includes(asset.sourceId));
  return <><Stack.Screen options={{ title: module.title, headerBackTitle: 'Study' }} /><Screen>
    <View style={styles.heading}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{module.system?.toUpperCase() ?? 'STUDY MODULE'}</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>{module.title}</Text>
      <Text style={[styles.intro, { color: colors.mutedForeground }]}>{module.summary ?? 'Source-linked learning content with recognition cues and relationships.'}</Text>
      <Text style={[styles.meta, { color: colors.mutedForeground }]}>{structures.length} structures · {lessons.length} learning lessons</Text>
      <View style={[styles.sources, { borderColor: colors.border, backgroundColor: colors.card }]}><Text style={[styles.sourceHead, { color: colors.foreground }]}>Sources and rights</Text>{module.sourceIds.map((sourceId) => { const source = content.sources.find((item) => item.id === sourceId); return source ? <View key={source.id} style={styles.sourceRow}><Text style={{ color: colors.mutedForeground }}>{source.title} · {source.attributionLicenseStatus.split(';')[0]}</Text><View style={styles.sourceLinks}>{source.sourceUrl && <Pressable onPress={() => Linking.openURL(source.sourceUrl!)}><Text style={{ color: colors.primary, fontSize: 12 }}>Source</Text></Pressable>}{source.licenseUrl && <Pressable onPress={() => Linking.openURL(source.licenseUrl!)}><Text style={{ color: colors.primary, fontSize: 12 }}>Rights</Text></Pressable>}</View></View> : null; })}</View>
    </View>
    <View style={[styles.switcher, { backgroundColor: colors.secondary }]}>{(['learn', 'recall'] as const).map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: mode === item }} onPress={() => setMode(item)} style={[styles.switch, mode === item && { backgroundColor: colors.card }]}><Text style={{ color: mode === item ? colors.foreground : colors.mutedForeground, fontWeight: '700' }}>{item === 'learn' ? 'Learn' : 'Recall'}</Text></Pressable>)}</View>
    {moduleAssets.length > 0 && <View style={styles.images}>{moduleAssets.map((asset) => <View key={asset.id} style={styles.imageCard}><AnatomyImageViewer source={imageSources[asset.id]} revealLabels={mode === 'learn'} caption={`${asset.title} · Public domain · ${asset.sourceUrl}`} /><Pressable onPress={() => asset.rightsUrl && Linking.openURL(asset.rightsUrl)}><Text style={{ color: colors.primary, fontSize: 12 }}>Open source and rights page</Text></Pressable></View>)}</View>}
    {lessons.map((item) => <LessonCard key={item.id} lesson={item} mode={mode} expanded={expanded === item.id} onToggle={() => setExpanded(expanded === item.id ? null : item.id)} colors={colors} bookmarks={bookmarks} onBookmark={toggleBookmark} />)}
    <Pressable onPress={() => router.push(`/(tabs)/practice?moduleId=${module.id}`)} style={[styles.practice, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Practice this module · {content.questions.filter((item) => item.moduleId === module.id).length} questions</Text></Pressable>
    <Pressable onPress={() => router.back()} style={styles.back}><Text style={{ color: colors.primary, fontWeight: '700' }}>Return to library</Text></Pressable>
  </Screen></>;
}

function LessonCard({ lesson, mode, expanded, onToggle, colors, bookmarks, onBookmark }: { lesson: Lesson; mode: 'learn' | 'recall'; expanded: boolean; onToggle: () => void; colors: any; bookmarks: string[]; onBookmark: (id: string) => void }) {
  const first = lesson.structureIds[0];
  return <View style={[styles.lesson, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <Pressable onPress={onToggle} accessibilityRole="button" accessibilityState={{ expanded }}><Text style={[styles.lessonTitle, { color: colors.foreground }]}>{lesson.title}</Text><Text style={[styles.lessonSummary, { color: colors.mutedForeground }]}>{lesson.summary}</Text></Pressable>
    <View style={styles.chips}>{lesson.structureIds.slice(0, 6).map((id) => { const structure = content.structures.find((item) => item.id === id); return structure ? <Pressable key={id} onPress={() => onBookmark(id)}><Text style={[styles.chip, { color: colors.primary }]}>{bookmarks.includes(id) ? '★ ' : ''}{structure.canonicalName}</Text></Pressable> : null; })}</View>
    {expanded && <View style={styles.details}>
      <Text style={[styles.detailHead, { color: colors.foreground }]}>{mode === 'learn' ? 'Recognition cues' : 'Recall prompt'}</Text>
      {mode === 'learn' ? lesson.recognitionCues.map((text) => <Text key={text} style={{ color: colors.mutedForeground }}>• {text}</Text>) : <Text style={{ color: colors.mutedForeground }}>Can you identify {content.structures.find((item) => item.id === first)?.canonicalName} by position, landmarks, and nearby relationships?</Text>}
      {mode === 'learn' && <><Text style={[styles.detailHead, { color: colors.foreground }]}>Landmarks and relationships</Text>{[...lesson.landmarks, ...lesson.relationships].map((text) => <Text key={text} style={{ color: colors.mutedForeground }}>• {text}</Text>)}<Text style={[styles.detailHead, { color: colors.foreground }]}>Common confusions</Text>{lesson.commonConfusions.map((text) => <Text key={text} style={{ color: colors.mutedForeground }}>• {text}</Text>)}</>}
    </View>}
  </View>;
}

const styles = StyleSheet.create({ heading:{gap:7},eyebrow:{fontSize:11,letterSpacing:1.3,fontWeight:'700'},title:{fontSize:29,fontWeight:'700'},intro:{fontSize:15,lineHeight:22},meta:{fontSize:12},sources:{borderWidth:1,borderRadius:12,padding:12,gap:8},sourceHead:{fontWeight:'700'},sourceRow:{gap:5},sourceLinks:{flexDirection:'row',gap:14},switcher:{borderRadius:12,padding:4,flexDirection:'row'},switch:{flex:1,alignItems:'center',paddingVertical:11,borderRadius:9},images:{gap:14},imageCard:{gap:7},lesson:{borderWidth:1,borderRadius:14,padding:15,gap:12},lessonTitle:{fontSize:17,fontWeight:'700'},lessonSummary:{fontSize:13,lineHeight:19,marginTop:4},chips:{flexDirection:'row',flexWrap:'wrap',gap:6},chip:{fontSize:12,borderWidth:1,borderColor:'#00000020',borderRadius:99,paddingHorizontal:8,paddingVertical:5},details:{gap:7},detailHead:{fontSize:14,fontWeight:'700',marginTop:4},practice:{minHeight:48,borderRadius:12,justifyContent:'center',alignItems:'center'},back:{alignSelf:'center',padding:10}});