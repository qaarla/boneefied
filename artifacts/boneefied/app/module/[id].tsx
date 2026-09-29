import React, { useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, View } from 'react-native';
import { Heading, Text, useTypographyLayout } from '@/components/ScaledText';
import { AdaptiveButton, AdaptiveCard, AdaptiveRow } from '@/components/AdaptiveLayout';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { AnatomyImageViewer } from '@/components/AnatomyImageViewer';
import { content } from '@/content/canonical';
import { resolvePublishedModule } from '@/content/study';
import type { Asset, Lesson } from '@/content/model';
import { useStudy } from '@/context/StudyContext';
import { useColors } from '@/hooks/useColors';
import { imageSources } from '@/content/imageSources';

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { isLargeText, isCompactTextLayout } = useTypographyLayout();
  const reflow = isCompactTextLayout || isLargeText;
  const { bookmarks, toggleBookmark } = useStudy();
  const [mode, setMode] = useState<'learn' | 'recall'>('learn');
  const [expanded, setExpanded] = useState<string | null>(null);
  const module = resolvePublishedModule(content, id);
  if (!module) return <><Stack.Screen options={{ title: 'Module unavailable', headerBackTitle: 'Study' }} /><Screen>
    <EmptyState icon="alert-circle" title="Module unavailable" message="This study module does not exist or is not published." />
        <AdaptiveButton onPress={() => router.replace('/(tabs)')} hitSlop={4} style={[styles.practice, { backgroundColor: colors.primary }]}>
      <Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Return to Study</Text>
     </AdaptiveButton>
  </Screen></>;
  const lessons = module.lessons ?? [];
  const structures = content.structures.filter((item) => item.moduleId === module.id);
  const assignedAssetIds = new Set((module.lessons ?? []).flatMap((lesson) => lesson.assetIds ?? []));
  const moduleAssets = content.assets.filter((asset) => assignedAssetIds.has(asset.id));
  return <><Stack.Screen options={{ title: reflow ? 'Module' : module.title, headerBackTitle: 'Study' }} /><Screen>
    <View style={styles.heading}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{module.system?.toUpperCase() ?? 'STUDY MODULE'}</Text>
       <Heading style={[styles.title, { color: colors.foreground }]}>{module.title}</Heading>
      <Text style={[styles.intro, { color: colors.mutedForeground }]}>{module.summary ?? 'Source-linked learning content with recognition cues and relationships.'}</Text>
      <Text style={[styles.meta, { color: colors.mutedForeground }]}>{structures.length} structures · {lessons.length} learning lessons</Text>
        <AdaptiveCard style={[styles.sources, { borderColor: colors.border, backgroundColor: colors.card }]}><Heading style={[styles.sourceHead, { color: colors.foreground }]}>Sources and rights</Heading>{module.sourceIds.map((sourceId) => { const source = content.sources.find((item) => item.id === sourceId); return source ? <View key={source.id} style={styles.sourceRow}><Text style={{ color: colors.mutedForeground }}>{source.title} · {source.attributionLicenseStatus.split(';')[0]}</Text><AdaptiveRow style={styles.sourceLinks}>{source.sourceUrl && <Pressable accessibilityRole="link" hitSlop={4} style={reflow && styles.sourceLinkLarge} onPress={() => Linking.openURL(source.sourceUrl!)}><Text style={{ color: colors.primary, fontSize: 12 }}>Source</Text></Pressable>}{source.licenseUrl && <Pressable accessibilityRole="link" hitSlop={4} style={reflow && styles.sourceLinkLarge} onPress={() => Linking.openURL(source.licenseUrl!)}><Text style={{ color: colors.primary, fontSize: 12 }}>Rights</Text></Pressable>}</AdaptiveRow></View> : null; })}</AdaptiveCard>
    </View>
        <AdaptiveRow style={[styles.switcher, reflow && styles.switcherLarge, { backgroundColor: colors.secondary }]}>{(['learn', 'recall'] as const).map((item) => <AdaptiveButton key={item} accessibilityRole="tab" accessibilityState={{ selected: mode === item }} hitSlop={4} onPress={() => setMode(item)} style={[styles.switch, reflow && styles.switchLarge, mode === item && { backgroundColor: colors.card }]}><Text style={{ color: mode === item ? colors.foreground : colors.mutedForeground, fontWeight: '700' }}>{item === 'learn' ? 'Learn' : 'Recall'}</Text></AdaptiveButton>)}</AdaptiveRow>
      {moduleAssets.length > 0 && <View style={styles.images}>{moduleAssets.filter((asset) => mode === 'learn' || asset.labelStatus === 'unlabeled').map((asset) => <View key={asset.id} style={styles.imageCard}><AnatomyImageViewer source={imageSources[asset.id]} labels={asset.labels} revealLabels={mode === 'learn'} bakedLabels={asset.labelStatus === 'labeled'} imageAspectRatio={asset.imageAspectRatio} caption={mode === 'learn' ? `${asset.title ?? 'Verified course image'} · ${asset.attributionLicense}` : undefined} />{asset.rightsUrl && <Pressable accessibilityRole="link" hitSlop={4} style={reflow && styles.sourceLinkLarge} onPress={() => Linking.openURL(asset.rightsUrl!)}><Text style={{ color: colors.primary, fontSize: 12 }}>Open source and rights page</Text></Pressable>}</View>)}{mode === 'recall' && !moduleAssets.some((asset) => asset.labelStatus === 'unlabeled') && <Text style={{ color: colors.mutedForeground }}>No unlabeled plate for this module yet. Use Practice for available text questions.</Text>}</View>}
      {lessons.map((item) => <LessonCard key={item.id} lesson={item} mode={mode} reflow={reflow} expanded={expanded === item.id} onToggle={() => setExpanded(expanded === item.id ? null : item.id)} colors={colors} bookmarks={bookmarks} onBookmark={toggleBookmark} />)}
       <AdaptiveButton onPress={() => router.push(`/(tabs)/practice?moduleId=${module.id}`)} style={[styles.practice, reflow && styles.practiceLarge, { backgroundColor: colors.primary }]}><Text style={[reflow && styles.practiceTextLarge, { color: colors.primaryForeground, fontWeight: '700' }]}>Practice this module · {content.questions.filter((item) => item.moduleId === module.id).length} questions</Text></AdaptiveButton>
      <AdaptiveButton onPress={() => router.back()} hitSlop={4} style={styles.back}><Text style={{ color: colors.primary, fontWeight: '700' }}>Return to library</Text></AdaptiveButton>
  </Screen></>;
}

function LessonCard({ lesson, mode, reflow, expanded, onToggle, colors, bookmarks, onBookmark }: { lesson: Lesson; mode: 'learn' | 'recall'; reflow: boolean; expanded: boolean; onToggle: () => void; colors: any; bookmarks: string[]; onBookmark: (id: string) => void }) {
  const first = lesson.structureIds[0];
   return <AdaptiveCard style={[styles.lesson, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <AdaptiveButton onPress={onToggle} hitSlop={4} accessibilityRole="button" accessibilityState={{ expanded }} style={styles.lessonToggle}><Text style={[styles.lessonTitle, { color: colors.foreground }]}>{lesson.title}</Text><Text style={[styles.lessonSummary, { color: colors.mutedForeground }]}>{lesson.summary}</Text></AdaptiveButton>
      <View style={styles.chips}>{lesson.structureIds.slice(0, 6).map((id) => { const structure = content.structures.find((item) => item.id === id); return structure ? <AdaptiveButton key={id} accessibilityRole="button" accessibilityLabel={`${bookmarks.includes(id) ? 'Remove bookmark for' : 'Bookmark'} ${structure.canonicalName}`} accessibilityState={{ selected: bookmarks.includes(id) }} hitSlop={4} style={reflow && styles.chipTargetLarge} onPress={() => onBookmark(id)}><Text style={[styles.chip, { color: colors.primary }]}>{bookmarks.includes(id) ? '★ ' : ''}{structure.canonicalName}</Text></AdaptiveButton> : null; })}</View>
    {expanded && <View style={styles.details}>
       <Heading style={[styles.detailHead, { color: colors.foreground }]}>Structures in this lesson</Heading>
      <Text style={{ color: colors.mutedForeground }}>{lesson.structureIds.map((id) => content.structures.find((item) => item.id === id)?.canonicalName).filter(Boolean).join(' · ')}</Text>
       <Heading style={[styles.detailHead, { color: colors.foreground }]}>{mode === 'learn' ? 'Recognition cues' : 'Recall prompt'}</Heading>
      {mode === 'learn' ? lesson.recognitionCues.map((text) => <Text key={text} style={{ color: colors.mutedForeground }}>• {text}</Text>) : <Text style={{ color: colors.mutedForeground }}>Can you identify {content.structures.find((item) => item.id === first)?.canonicalName} by position, landmarks, and nearby relationships?</Text>}
       {mode === 'learn' && <><Heading style={[styles.detailHead, { color: colors.foreground }]}>Landmarks and relationships</Heading>{[...lesson.landmarks, ...lesson.relationships].map((text) => <Text key={text} style={{ color: colors.mutedForeground }}>• {text}</Text>)}<Heading style={[styles.detailHead, { color: colors.foreground }]}>Common confusions</Heading>{lesson.commonConfusions.map((text) => <Text key={text} style={{ color: colors.mutedForeground }}>• {text}</Text>)}</>}
    </View>}
   </AdaptiveCard>;
}

const styles = StyleSheet.create({ heading:{gap:7},eyebrow:{fontSize:11,letterSpacing:1.3,fontWeight:'700'},title:{fontSize:29,fontWeight:'700'},intro:{fontSize:15,lineHeight:22},meta:{fontSize:12},sources:{borderWidth:1,borderRadius:12,padding:12,gap:8},sourceHead:{fontWeight:'700'},sourceRow:{gap:5},sourceLinks:{flexDirection:'row',gap:14,flexWrap:'wrap',rowGap:8},sourceLinkLarge:{minHeight:44,justifyContent:'center'},switcher:{borderRadius:12,padding:4,flexDirection:'row'},switcherLarge:{flexDirection:'column',gap:4},switch:{flex:1,alignItems:'center',paddingVertical:11,borderRadius:9},switchLarge:{alignSelf:'stretch',flex:0,minHeight:44,justifyContent:'center'},images:{gap:14},imageCard:{gap:7},lesson:{borderWidth:1,borderRadius:14,padding:15,gap:12},lessonToggle:{alignItems:'flex-start'},lessonTitle:{fontSize:17,fontWeight:'700'},lessonSummary:{fontSize:13,lineHeight:19,marginTop:4},chips:{flexDirection:'row',flexWrap:'wrap',gap:6},chipTargetLarge:{minHeight:44,justifyContent:'center'},chip:{fontSize:12,borderWidth:1,borderColor:'#00000020',borderRadius:99,paddingHorizontal:8,paddingVertical:5},details:{gap:7},detailHead:{fontSize:14,fontWeight:'700',marginTop:4},practice:{minHeight:48,borderRadius:12,justifyContent:'center',alignItems:'center'},practiceLarge:{alignSelf:'stretch',paddingHorizontal:12,paddingVertical:12},practiceTextLarge:{flexShrink:1,textAlign:'center'},back:{alignSelf:'center',padding:10}});