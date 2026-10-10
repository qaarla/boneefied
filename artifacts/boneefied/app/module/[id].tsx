import { isAtlasAssetId } from '@/content/atlas-index';
import { skeletalGalleryByModule } from '@/content/skeletal-atlas-pack';
import { muscularGalleryByModule, isMuscularAtlasAssetId } from '@/content/muscular-atlas-pack';
import { BVIS04_MODULES, bvis04Gallery, isBvis04AssetId } from '@/content/bvis04-pack';
import { BVIS05_MODULES, bvis05Gallery, isBvis05AssetId } from '@/content/bvis05-pack';
import { BVIS06_MODULES, bvis06Gallery, isBvis06AssetId } from '@/content/bvis06-pack';
import React, { useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, View } from 'react-native';
import { Heading, Text, useTypographyLayout } from '@/components/ScaledText';
import { AdaptiveButton, AdaptiveCard, AdaptiveRow } from '@/components/AdaptiveLayout';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { AnatomyImageViewer } from '@/components/AnatomyImageViewer';
import { MuscularPlateContext } from '@/components/MuscularPlateContext';
import { Bvis04PlateContext } from '@/components/Bvis04PlateContext';
import { Bvis05PlateContext } from '@/components/Bvis05PlateContext';
import { Bvis06PlateContext } from '@/components/Bvis06PlateContext';
import { content } from '@/content/canonical';
import { resolvePublishedModule } from '@/content/study';
import type { Lesson, Structure } from '@/content/model';
import { useStudy } from '@/context/StudyContext';
import { useColors } from '@/hooks/useColors';
import { imageSources } from '@/content/imageSources';
import { useLocale } from '@/locales/useLocale';

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { language, t, number, module: localizeModule, lesson: localizeLesson, structure: localizeStructure, asset: localizeAsset, source: localizeSource } = useLocale();
  const { isLargeText, isCompactTextLayout } = useTypographyLayout();
  const reflow = isCompactTextLayout || isLargeText;
  const { bookmarks, toggleBookmark } = useStudy();
  const [mode, setMode] = useState<'learn' | 'recall'>('learn');
  const [expanded, setExpanded] = useState<string | null>(null);
  const resolvedModule = resolvePublishedModule(content, id);
  const activeAtlasAssetIds = resolvedModule && [...BVIS04_MODULES, ...BVIS05_MODULES, 'muscular-system'].includes(resolvedModule.id)
    ? new Set([...(resolvedModule.lessons ?? []).flatMap((l) => l.assetIds ?? []),
      ...content.questions.filter((q) => q.moduleId === resolvedModule.id && q.assetId).map((q) => q.assetId!)]) : undefined;
  const activeSourceIds = activeAtlasAssetIds ? new Set([
    ...content.structures.filter((s) => s.moduleId === resolvedModule!.id).map((s) => s.sourceId),
    ...content.questions.filter((q) => q.moduleId === resolvedModule!.id).map((q) => q.sourceId),
    ...content.assets.filter((a) => activeAtlasAssetIds.has(a.id)).map((a) => a.sourceId),
  ]) : undefined;
  // Keep archived sources in the catalog, but don't credit retired illustrations
  // as though they were the artwork currently displayed in this module.
  const module = resolvedModule && activeSourceIds
    ? { ...resolvedModule, sourceIds: resolvedModule.sourceIds.filter((sourceId) => activeSourceIds.has(sourceId)) }
    : resolvedModule;
  if (!module) return <><Stack.Screen options={{ title: t('module.unavailableTitle'), headerBackTitle: t('tabs.study') }} /><Screen>
    <EmptyState icon="alert-circle" title={t('module.unavailableTitle')} message={t('module.unavailableMessage')} />
        <AdaptiveButton onPress={() => router.replace('/(tabs)')} hitSlop={4} style={[styles.practice, { backgroundColor: colors.primary }]}>
      <Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>{t('module.returnToStudy')}</Text>
     </AdaptiveButton>
  </Screen></>;
  const localizedModule = localizeModule(module);
  const lessons = (module.lessons ?? []).map(localizeLesson);
  const structures = content.structures.filter((item) => item.moduleId === module.id);
  const assignedAssetIds = new Set((module.lessons ?? []).flatMap((lesson) => lesson.assetIds ?? []));
  const moduleAssets = content.assets.filter((asset) => assignedAssetIds.has(asset.id) && !isAtlasAssetId(asset.id));
  const galleryIds = BVIS06_MODULES.includes(module.id) ? bvis06Gallery(module.id) : BVIS05_MODULES.includes(module.id) ? bvis05Gallery(module.id) : BVIS04_MODULES.includes(module.id) ? bvis04Gallery(module.id) : muscularGalleryByModule[module.id] ?? skeletalGalleryByModule[module.id] ?? [];
  return <><Stack.Screen options={{ title: reflow ? t('module.responsiveNavigationTitle') : localizedModule.title, headerBackTitle: t('tabs.study') }} /><Screen>
    <View style={styles.heading}>
       <Text style={[styles.eyebrow, { color: colors.primary }]}>{localizedModule.system?.toUpperCase() ?? t('module.eyebrow')}</Text>
        <Heading style={[styles.title, { color: colors.foreground }]}>{localizedModule.title}</Heading>
       <Text style={[styles.intro, { color: colors.mutedForeground }]}>{localizedModule.summary ?? t('module.fallbackSummary')}</Text>
       <Text style={[styles.meta, { color: colors.mutedForeground }]}>{t(`module.structureCount.${structures.length === 1 ? 'one' : 'other'}`, { count: number(structures.length) })} · {t(`module.lessonCount.${lessons.length === 1 ? 'one' : 'other'}`, { count: number(lessons.length) })}</Text>
         <AdaptiveCard style={[styles.sources, { borderColor: colors.border, backgroundColor: colors.card }]}><Heading style={[styles.sourceHead, { color: colors.foreground }]}>{t('module.sourcesAndRights')}</Heading>{module.sourceIds.map((sourceId) => { const source = content.sources.find((item) => item.id === sourceId); const translatedSource = source && localizeSource(source); return source && translatedSource ? <View key={source.id} style={styles.sourceRow}><Text style={{ color: colors.mutedForeground }}>{translatedSource.title} · {translatedSource.attributionLicenseStatus.split(';')[0]}</Text><AdaptiveRow style={styles.sourceLinks}>{source.sourceUrl && <Pressable accessibilityRole="link" hitSlop={4} style={reflow && styles.sourceLinkLarge} onPress={() => Linking.openURL(source.sourceUrl!)}><Text style={{ color: colors.primary, fontSize: 12 }}>{t('module.sourceLink')}</Text></Pressable>}{source.licenseUrl && <Pressable accessibilityRole="link" hitSlop={4} style={reflow && styles.sourceLinkLarge} onPress={() => Linking.openURL(source.licenseUrl!)}><Text style={{ color: colors.primary, fontSize: 12 }}>{t('module.rightsLink')}</Text></Pressable>}</AdaptiveRow></View> : null; })}</AdaptiveCard>
    </View>
         <AdaptiveRow style={[styles.switcher, reflow && styles.switcherLarge, { backgroundColor: colors.secondary }]}>{(['learn', 'recall'] as const).map((item) => <AdaptiveButton key={item} accessibilityRole="tab" accessibilityState={{ selected: mode === item }} hitSlop={4} onPress={() => setMode(item)} style={[styles.switch, reflow && styles.switchLarge, mode === item && { backgroundColor: colors.card }]}><Text style={{ color: mode === item ? colors.foreground : colors.mutedForeground, fontWeight: '700' }}>{t(item === 'learn' ? 'module.learnMode' : 'module.recallMode')}</Text></AdaptiveButton>)}</AdaptiveRow>
       {galleryIds.length > 0 && <View style={styles.images}>
        <Heading style={[styles.detailHead, { color: colors.foreground }]}>{language === 'es' ? 'Láminas seleccionadas del atlas' : 'Selected atlas plates'}</Heading>
        {galleryIds.flatMap((id) => { const a = content.assets.find((item) => item.id === id); return a ? [localizeAsset(a)] : []; }).map((asset) => <View key={asset.id} style={styles.imageCard}>
          <AnatomyImageViewer source={imageSources[asset.id]} atlasLayout labels={asset.labels} revealLabels={mode === 'learn'} bakedLabels={false} imageAspectRatio={asset.imageAspectRatio} caption={mode === 'learn' ? asset.title : undefined} />
          {isMuscularAtlasAssetId(asset.id) && <MuscularPlateContext asset={asset} learn={mode === 'learn'} />}
          {isBvis04AssetId(asset.id) && <Bvis04PlateContext asset={asset} learn={mode === 'learn'} />}
          {isBvis05AssetId(asset.id) && <Bvis05PlateContext asset={asset} learn={mode === 'learn'} />}
          {isBvis06AssetId(asset.id) && <Bvis06PlateContext asset={asset} learn={mode === 'learn'} />}
        </View>)}
      </View>}
        {[...BVIS04_MODULES, ...BVIS05_MODULES].includes(module.id) && moduleAssets.some((a) => a.assetType === 'histology') && <Heading style={[styles.detailHead, { color: colors.foreground }]}>{language === 'es' ? 'Muestras reales — separadas de los esquemas' : 'Real specimens — separate from schematics'}</Heading>}
        {moduleAssets.length > 0 && <View style={styles.images}>
          {moduleAssets.filter((asset) => mode === 'learn' || asset.labelStatus === 'unlabeled').map((asset) => {
            const translatedAsset = localizeAsset(asset);
            return <View key={asset.id} style={styles.imageCard}>
              <AnatomyImageViewer source={imageSources[asset.id]} atlasLayout={isAtlasAssetId(asset.id)} labels={translatedAsset.labels} revealLabels={mode === 'learn'} bakedLabels={asset.labelStatus === 'labeled'} imageAspectRatio={asset.imageAspectRatio} caption={mode === 'learn' ? `${translatedAsset.title ?? t('module.verifiedCourseImage')} · ${translatedAsset.attributionLicense}` : undefined} />
              {BVIS04_MODULES.includes(module.id) && asset.assetType === 'histology' && <Bvis04PlateContext asset={translatedAsset} learn={mode === 'learn'} />}
              {BVIS05_MODULES.includes(module.id) && asset.assetType === 'histology' && <Bvis05PlateContext asset={translatedAsset} learn={mode === 'learn'} />}
              {BVIS06_MODULES.includes(module.id) && asset.assetType === 'histology' && <Bvis06PlateContext asset={translatedAsset} learn={mode === 'learn'} />}
              {asset.rightsUrl && <Pressable accessibilityRole="link" hitSlop={4} style={reflow && styles.sourceLinkLarge} onPress={() => Linking.openURL(asset.rightsUrl!)}><Text style={{ color: colors.primary, fontSize: 12 }}>{t('module.openSourceAndRightsPage')}</Text></Pressable>}
            </View>;
          })}
          {mode === 'recall' && !moduleAssets.some((asset) => asset.labelStatus === 'unlabeled') && <Text style={{ color: colors.mutedForeground }}>{t('module.noUnlabeledPlate')}</Text>}
        </View>}
       {lessons.map((item) => <LessonCard key={item.id} lesson={item} mode={mode} reflow={reflow} expanded={expanded === item.id} onToggle={() => setExpanded(expanded === item.id ? null : item.id)} colors={colors} bookmarks={bookmarks} onBookmark={toggleBookmark} t={t} localizeStructure={localizeStructure} />)}
        <AdaptiveButton onPress={() => router.push(`/(tabs)/practice?moduleId=${module.id}`)} style={[styles.practice, reflow && styles.practiceLarge, { backgroundColor: colors.primary }]}><Text style={[reflow && styles.practiceTextLarge, { color: colors.primaryForeground, fontWeight: '700' }]}>{t(`module.practiceCount.${content.questions.filter((item) => item.moduleId === module.id).length === 1 ? 'one' : 'other'}`, { count: number(content.questions.filter((item) => item.moduleId === module.id).length) })}</Text></AdaptiveButton>
       <AdaptiveButton onPress={() => router.back()} hitSlop={4} style={styles.back}><Text style={{ color: colors.primary, fontWeight: '700' }}>{t('module.returnToLibrary')}</Text></AdaptiveButton>
  </Screen></>;
}

function LessonCard({ lesson, mode, reflow, expanded, onToggle, colors, bookmarks, onBookmark, t, localizeStructure }: { lesson: Lesson; mode: 'learn' | 'recall'; reflow: boolean; expanded: boolean; onToggle: () => void; colors: any; bookmarks: string[]; onBookmark: (id: string) => void; t: (key: string, values?: Record<string, string | number>) => string; localizeStructure: (item: Structure) => Structure }) {
  const { asset: localizeAsset } = useLocale();
  const plates = (lesson.assetIds ?? []).filter((id) => isAtlasAssetId(id)).flatMap((id) => {
    const asset = content.assets.find((item) => item.id === id);
    return asset ? [localizeAsset(asset)] : [];
  });
  const first = lesson.structureIds[0];
   return <AdaptiveCard style={[styles.lesson, { backgroundColor: colors.card, borderColor: colors.border }]}>
       <AdaptiveButton onPress={onToggle} hitSlop={4} accessibilityRole="button" accessibilityState={{ expanded }} style={styles.lessonToggle}><Text style={[styles.lessonTitle, { color: colors.foreground }]}>{lesson.title}</Text><Text style={[styles.lessonSummary, { color: colors.mutedForeground }]}>{lesson.summary}</Text></AdaptiveButton>
       <View style={styles.chips}>{lesson.structureIds.slice(0, 6).map((id) => { const canonicalStructure = content.structures.find((item) => item.id === id); const structure = canonicalStructure && localizeStructure(canonicalStructure); return structure ? <AdaptiveButton key={id} accessibilityRole="button" accessibilityLabel={t(bookmarks.includes(id) ? 'bookmark.removeAccessibility' : 'bookmark.addAccessibility', { name: structure.canonicalName })} accessibilityState={{ selected: bookmarks.includes(id) }} hitSlop={4} style={reflow && styles.chipTargetLarge} onPress={() => onBookmark(id)}><Text style={[styles.chip, { color: colors.primary }]}>{bookmarks.includes(id) ? '★ ' : ''}{structure.canonicalName}</Text></AdaptiveButton> : null; })}</View>
    {expanded && <View style={styles.details}>
       {plates.map((asset) => <View key={asset.id} style={styles.imageCard}>
         <AnatomyImageViewer source={imageSources[asset.id]} atlasLayout labels={asset.labels} revealLabels={mode === 'learn'} bakedLabels={false} imageAspectRatio={asset.imageAspectRatio} caption={mode === 'learn' ? isMuscularAtlasAssetId(asset.id) ? asset.title : `${asset.title} · ${asset.attributionLicense}` : undefined} />
         {isMuscularAtlasAssetId(asset.id) && <MuscularPlateContext asset={asset} learn={mode === 'learn'} />}
         {isBvis04AssetId(asset.id) && <Bvis04PlateContext asset={asset} learn={mode === 'learn'} />}
         {isBvis05AssetId(asset.id) && <Bvis05PlateContext asset={asset} learn={mode === 'learn'} />}
         {isBvis06AssetId(asset.id) && <Bvis06PlateContext asset={asset} learn={mode === 'learn'} />}
       </View>)}
        <Heading style={[styles.detailHead, { color: colors.foreground }]}>{t('lesson.structuresInLesson')}</Heading>
       <Text style={{ color: colors.mutedForeground }}>{lesson.structureIds.map((id) => { const structure = content.structures.find((item) => item.id === id); return structure ? localizeStructure(structure).canonicalName : undefined; }).filter(Boolean).join(' · ')}</Text>
        <Heading style={[styles.detailHead, { color: colors.foreground }]}>{t(mode === 'learn' ? 'lesson.recognitionCues' : 'lesson.recallPrompt')}</Heading>
       {mode === 'learn' ? lesson.recognitionCues.map((text) => <Text key={text} style={{ color: colors.mutedForeground }}>• {text}</Text>) : <Text style={{ color: colors.mutedForeground }}>{t('lesson.recallByPosition', { structure: (() => { const structure = content.structures.find((item) => item.id === first); return structure ? localizeStructure(structure).canonicalName : ''; })() })}</Text>}
        {mode === 'learn' && <><Heading style={[styles.detailHead, { color: colors.foreground }]}>{t('lesson.landmarksAndRelationships')}</Heading>{[...lesson.landmarks, ...lesson.relationships].map((text) => <Text key={text} style={{ color: colors.mutedForeground }}>• {text}</Text>)}<Heading style={[styles.detailHead, { color: colors.foreground }]}>{t('lesson.commonConfusions')}</Heading>{lesson.commonConfusions.map((text) => <Text key={text} style={{ color: colors.mutedForeground }}>• {text}</Text>)}</>}
    </View>}
   </AdaptiveCard>;
}

const styles = StyleSheet.create({ heading:{gap:7},eyebrow:{fontSize:11,letterSpacing:1.3,fontWeight:'700'},title:{fontSize:29,fontWeight:'700'},intro:{fontSize:15,lineHeight:22},meta:{fontSize:12},sources:{borderWidth:1,borderRadius:12,padding:12,gap:8},sourceHead:{fontWeight:'700'},sourceRow:{gap:5},sourceLinks:{flexDirection:'row',gap:14,flexWrap:'wrap',rowGap:8},sourceLinkLarge:{minHeight:44,justifyContent:'center'},switcher:{borderRadius:12,padding:4,flexDirection:'row'},switcherLarge:{flexDirection:'column',gap:4},switch:{flex:1,alignItems:'center',paddingVertical:11,borderRadius:9},switchLarge:{alignSelf:'stretch',flex:0,minHeight:44,justifyContent:'center'},images:{gap:14},imageCard:{gap:7},lesson:{borderWidth:1,borderRadius:14,padding:15,gap:12},lessonToggle:{alignItems:'flex-start'},lessonTitle:{fontSize:17,fontWeight:'700'},lessonSummary:{fontSize:13,lineHeight:19,marginTop:4},chips:{flexDirection:'row',flexWrap:'wrap',gap:6},chipTargetLarge:{minHeight:44,justifyContent:'center'},chip:{fontSize:12,borderWidth:1,borderColor:'#00000020',borderRadius:99,paddingHorizontal:8,paddingVertical:5},details:{gap:7},detailHead:{fontSize:14,fontWeight:'700',marginTop:4},practice:{minHeight:48,borderRadius:12,justifyContent:'center',alignItems:'center'},practiceLarge:{alignSelf:'stretch',paddingHorizontal:12,paddingVertical:12},practiceTextLarge:{flexShrink:1,textAlign:'center'},back:{alignSelf:'center',padding:10}});