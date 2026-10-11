import React, { useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from './ScaledText';
import { useColors } from '@/hooks/useColors';
import { useLocale } from '@/locales/useLocale';
import { content } from '@/content/canonical';
import { collectModuleRights } from '@/content/module-rights';
import type { Module } from '@/content/model';

export function ModuleSourcesDisclosure({ module, galleryIds }: { module: Module; galleryIds: readonly string[] }) {
  const [expanded, setExpanded] = useState(false);
  const [focused, setFocused] = useState(false);
  const colors = useColors();
  const { t, language, source: localizeSource, asset: localizeAsset } = useLocale();
  const rights = collectModuleRights(content, module, galleryIds);
  const title = t('module.sourcesAndRights');
  return <View testID="module-sources-disclosure" style={[styles.card, { backgroundColor: colors.card, borderColor: focused ? colors.primary : colors.border }]}>
    <Pressable testID="module-sources-toggle" accessibilityRole="button" accessibilityLabel={title}
      accessibilityHint={language === 'es' ? 'Mostrar u ocultar las fuentes, los créditos y las licencias.' : 'Show or hide sources, credits and licenses.'}
      accessibilityState={{ expanded }} {...(Platform.OS === 'web' ? { 'aria-expanded': expanded } : {})}
      onPress={() => setExpanded((value) => !value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={styles.toggle}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <Feather accessible={false} accessibilityElementsHidden importantForAccessibility="no" name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
    </Pressable>
    {expanded && <View testID="module-sources-details" style={[styles.details, { borderTopColor: colors.border }]}>
      {rights.sources.map((canonical) => {
        const source = localizeSource(canonical);
        return <View key={source.id} testID={`rights-source-${source.id}`} style={styles.entry}>
          <Text style={[styles.entryTitle, { color: colors.foreground }]}>{source.title}</Text>
          {!!source.filename && <Text style={[styles.copy, { color: colors.mutedForeground }]}>{language === 'es' ? 'Archivo' : 'File'}: {source.filename}</Text>}
          <Text style={[styles.copy, { color: colors.mutedForeground }]}>{source.attributionLicenseStatus}</Text>
          {!!source.courseLabAssociation && <Text style={[styles.copy, { color: colors.mutedForeground }]}>{source.courseLabAssociation}</Text>}
          {!!source.notes && <Text style={[styles.copy, { color: colors.mutedForeground }]}>{source.notes}</Text>}
          <RightsLinks title={source.title} sourceUrl={canonical.sourceUrl} rightsUrl={canonical.licenseUrl} />
        </View>;
      })}
      {rights.assets.map((canonical) => {
        const asset = localizeAsset(canonical);
        const source = content.sources.find((item) => item.id === canonical.sourceId);
        return <View key={asset.id} testID={`rights-asset-${asset.id}`} style={styles.entry}>
          <Text style={[styles.entryTitle, { color: colors.foreground }]}>{asset.title ?? asset.id}</Text>
          <Text style={[styles.copy, { color: colors.mutedForeground }]}>{asset.attributionLicense}</Text>
          {!!asset.adaptationNote && <Text style={[styles.copy, { color: colors.mutedForeground }]}>{asset.adaptationNote}</Text>}
          <RightsLinks title={asset.title ?? asset.id} sourceUrl={canonical.sourceUrl ?? source?.sourceUrl} rightsUrl={canonical.rightsUrl ?? source?.licenseUrl} />
        </View>;
      })}
    </View>}
  </View>;
}

function RightsLinks({ title, sourceUrl, rightsUrl }: { title: string; sourceUrl?: string; rightsUrl?: string }) {
  const colors = useColors();
  const { t } = useLocale();
  return <View style={styles.links}>
    {sourceUrl && <Pressable accessibilityRole="link" accessibilityLabel={`${t('module.sourceLink')}: ${title}`} onPress={() => Linking.openURL(sourceUrl)} style={styles.link}>
      <Text style={{ color: colors.primary }}>{t('module.sourceLink')}</Text>
    </Pressable>}
    {rightsUrl && <Pressable accessibilityRole="link" accessibilityLabel={`${t('module.rightsLink')}: ${title}`} onPress={() => Linking.openURL(rightsUrl)} style={styles.link}>
      <Text style={{ color: colors.primary }}>{t('module.rightsLink')}</Text>
    </Pressable>}
  </View>;
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 12, minWidth: 0 },
  toggle: { minHeight: 48, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { flex: 1, minWidth: 0, fontSize: 14, fontWeight: '700' },
  details: { borderTopWidth: 1, padding: 12, gap: 18 },
  entry: { minWidth: 0, gap: 6 },
  entryTitle: { fontSize: 14, fontWeight: '700', maxWidth: '100%' },
  copy: { fontSize: 13, maxWidth: '100%', minWidth: 0 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  link: { minHeight: 44, justifyContent: 'center', maxWidth: '100%' },
});
