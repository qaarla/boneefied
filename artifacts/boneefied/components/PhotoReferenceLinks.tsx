import React, { useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from '@/components/ScaledText';
import { useColors } from '@/hooks/useColors';
import { useLocale } from '@/locales/useLocale';
import { photoReferenceLabel, photoReferencesForAsset, tryOpenPhotoReference } from '@/content/real-photo-references';

/** A footer sibling of the gesture surface, never an overlay or in-app browser.
 * Opening the OS browser/new tab does not navigate or remount the study screen.
 */
export function PhotoReferenceLinks({ assetId, visible }: { assetId?: string; visible: boolean }) {
  const colors = useColors();
  const { language } = useLocale();
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const references = visible ? photoReferencesForAsset(assetId) : [];
  if (!references.length) return null;

  async function open(url: string) {
    setFailedUrl(null);
    // In the web preview a disconnected browser cannot load an external page.
    // Leave the locally available lesson in place and allow a later retry.
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.onLine === false) {
      setFailedUrl(url);
      return;
    }
    const opened = await tryOpenPhotoReference(url, async (destination) => {
      if (Platform.OS === 'web') {
        // Keep a real href for link semantics/modifier clicks. For a normal tap,
        // detect blocked popups; noopener window features return null even on success.
        const tab = window.open(destination, '_blank');
        if (!tab) throw new Error('Browser did not open');
        tab.opener = null;
      } else {
        await Linking.openURL(destination);
      }
    });
    if (!opened) setFailedUrl(url);
  }

  return <View testID={`photo-references-${assetId}`} style={styles.footer}>
    {references.map((reference) => {
      const label = photoReferenceLabel(reference, language);
      const webLink = Platform.OS === 'web' ? {
        href: reference.url, hrefAttrs: { target: '_blank', rel: 'noopener noreferrer' },
      } : {};
      return <View key={reference.url}>
        <Pressable {...webLink} testID={`real-photo-link-${assetId}`}
          accessibilityRole="link" accessibilityLabel={label}
          accessibilityHint={language === 'es' ? 'Abre la página original en el navegador. Requiere internet.' : 'Opens the original source page in your browser. Requires internet.'}
          onPress={(event) => {
            const modifiers = event.nativeEvent as { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean; altKey?: boolean };
            if (Platform.OS === 'web' && (modifiers.ctrlKey || modifiers.metaKey || modifiers.shiftKey || modifiers.altKey)) return;
            event.preventDefault();
            void open(reference.url);
          }}
          style={({ pressed }) => [styles.link, { opacity: pressed ? 0.65 : 1 }]}>
          <Text style={[styles.label, { color: colors.primary }]}>{label}</Text>
          <Feather name="external-link" size={13} color={colors.primary} accessible={false} />
        </Pressable>
        {failedUrl === reference.url && <Text accessibilityRole="alert" accessibilityLiveRegion="polite"
          style={[styles.error, { color: colors.mutedForeground }]}>
          {language === 'es' ? 'No se pudo abrir. Revisa tu conexión y toca el enlace de nuevo.' : 'Couldn’t open the link. Check your connection and tap it again.'}
        </Text>}
      </View>;
    })}
  </View>;
}

const styles = StyleSheet.create({
  footer: { paddingHorizontal: 8, paddingBottom: 4 },
  link: { minHeight: 44, paddingHorizontal: 4, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 7 },
  label: { flexShrink: 1, fontSize: 13, textDecorationLine: 'underline' },
  error: { fontSize: 12, paddingHorizontal: 4, paddingBottom: 8 },
});
