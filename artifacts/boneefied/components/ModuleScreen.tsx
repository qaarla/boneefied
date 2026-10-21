import { OrganicSurface } from '@/components/OrganicBackground';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, type NativeStackHeaderProps } from 'expo-router';
import { HeaderBackButton } from 'expo-router/build/react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/Screen';
import { useTypographyLayout } from '@/components/ScaledText';
import { APP_FONTS } from '@/context/typeface';
import { useColors } from '@/hooks/useColors';
import { useLocale } from '@/locales/useLocale';

/** The header owns the status-bar inset; content owns only the reading gap. */
export function ModuleScreen({ title, children }: { title: string; children: React.ReactNode }) {
  const { t } = useLocale();
  return <>
    <Stack.Screen options={{
      title,
      headerBackTitle: t('tabs.study'),
      headerShown: true,
      headerTransparent: false,
      headerLargeTitle: false,
      header: (props) => <ModuleHeader {...props} />,
    }} />
    <Screen belowHeader>{children}</Screen>
  </>;
}

function ModuleHeader({ navigation, back, options }: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { shouldReflow } = useTypographyLayout();
  return <View style={{ backgroundColor: colors.background, paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }}>
    <OrganicSurface />
    <View style={styles.headerRow}>
      <View style={styles.back}>
        {back && <HeaderBackButton
          label={options.headerBackTitle ?? back.title}
          href={back.href}
          displayMode={shouldReflow ? 'minimal' : 'default'}
          tintColor={colors.primary}
          labelStyle={{ fontFamily: APP_FONTS.bold, fontWeight: 'normal' }}
          onPress={() => navigation.goBack()}
        />}
      </View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', minHeight: 44, paddingHorizontal: 8, paddingVertical: 6, gap: 8 },
  back: { minWidth: 44, flexShrink: 0 },
});
