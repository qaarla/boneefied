import { Link, Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { OrganicBackground } from '@/components/OrganicBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, useTypographyLayout } from '@/components/ScaledText';
import { useColors } from '@/hooks/useColors';
import { useLocale } from '@/locales/useLocale';

export default function NotFoundScreen() {
  const colors = useColors();
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const { isLargeText, isCompactTextLayout } = useTypographyLayout();
  const reflow = isLargeText || isCompactTextLayout;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <OrganicBackground />
      <ScrollView style={styles.container} contentContainerStyle={[styles.content, reflow && { paddingTop: 20 + insets.top, paddingBottom: 20 + insets.bottom }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t('notFound.message')}
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: colors.primary }]}>
            {t('notFound.goHome')}
          </Text>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
  },
});
