import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Heading, Text } from '@/components/ScaledText';
import { AdaptiveButton } from '@/components/AdaptiveLayout';
import { Screen } from '@/components/Screen';
import { useColors } from '@/hooks/useColors';
import { useLocale } from '@/locales/useLocale';
import type { StudyLoadError } from '@/context/studyStorage';

export function StudyStorageRecovery({ error, onRetry }: { error: StudyLoadError['kind'] | null; onRetry: () => void }) {
  const colors = useColors();
  const { language } = useLocale();
  const es = language === 'es';
  return <Screen><View testID="study-storage-recovery" style={styles.box}>
    <Heading style={{ color: colors.foreground }}>{error
      ? (es ? 'No se pudo cargar tu progreso' : 'Unable to load saved progress')
      : (es ? 'Cargando tu progreso guardado…' : 'Loading saved progress…')}</Heading>
    {error && <>
      <Text accessibilityRole="alert" style={{ color: colors.foreground }}>{error === 'invalid'
        ? (es ? 'El registro guardado tiene un formato dañado o no compatible.' : 'The saved record has a damaged or unsupported format.')
        : (es ? 'No se pudo leer el almacenamiento del dispositivo. Puedes volver a intentarlo.' : 'Device storage could not be read. You can try loading again.')}</Text>
      <Text style={{ color: colors.mutedForeground }}>{es
        ? 'No se ha reemplazado tu progreso guardado. No se guardarán cambios hasta que se cargue correctamente.'
        : 'Your saved record has not been replaced. Saving is paused until it can be loaded safely.'}</Text>
      <AdaptiveButton testID="study-retry-load" accessibilityRole="button" onPress={onRetry}
        style={[styles.retry, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Text style={{ color: colors.primary }}>{es ? 'Reintentar carga' : 'Retry Load'}</Text>
      </AdaptiveButton>
    </>}
  </View></Screen>;
}

const styles = StyleSheet.create({
  box: { gap: 16, paddingVertical: 24 },
  retry: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 12, padding: 14, minHeight: 44 },
});
