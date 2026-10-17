import React, { useEffect, useRef } from 'react';
import { OrganicSurface } from '@/components/OrganicBackground';
import { useColors } from '@/hooks/useColors';
import {
  Animated,
  StyleSheet,
  Pressable,
  type AccessibilityRole,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export type AnswerFeedback = 'correct' | 'incorrect';

type Props = {
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  decorate?: boolean;
  disabled?: boolean;
  feedback?: AnswerFeedback;
  reduceMotion?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  hitSlop?: number;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
  };
  testID?: string;
  onPress?: () => void;
  onPressIn?: () => void;
};

export function AnimatedAnswerPressable({
  children,
  containerStyle,
  contentStyle,
  decorate = true,
  disabled = false,
  feedback,
  reduceMotion = false,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  hitSlop,
  accessibilityState,
  testID,
  onPress,
  onPressIn,
}: Props) {
  const colors = useColors();
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const useNativeDriver = false;

  useEffect(() => {
    translateX.stopAnimation();
    translateY.stopAnimation();
    translateX.setValue(0);
    translateY.setValue(0);
    if (!feedback || reduceMotion) return;
    const animation = feedback === 'correct'
      ? Animated.sequence([
        Animated.timing(translateY, { toValue: -4, duration: 85, useNativeDriver }),
        Animated.spring(translateY, { toValue: 0, speed: 24, bounciness: 5, useNativeDriver }),
      ])
      : Animated.sequence([
        Animated.timing(translateX, { toValue: -5, duration: 55, useNativeDriver }),
        Animated.timing(translateX, { toValue: 5, duration: 70, useNativeDriver }),
        Animated.timing(translateX, { toValue: -3, duration: 60, useNativeDriver }),
        Animated.timing(translateX, { toValue: 2, duration: 50, useNativeDriver }),
        Animated.timing(translateX, { toValue: 0, duration: 45, useNativeDriver }),
      ]);
    animation.start();
    return () => animation.stop();
  }, [feedback, reduceMotion, translateX, translateY, useNativeDriver]);

  const pressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 0.975,
      speed: 32,
      bounciness: 0,
      useNativeDriver,
    }).start();
    onPressIn?.();
  };
  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      speed: 28,
      bounciness: 2,
      useNativeDriver,
    }).start();
  };

  const flatC = StyleSheet.flatten(contentStyle) ?? {};
  const flatO = StyleSheet.flatten(containerStyle) ?? {};
  const opaque = (f: ViewStyle) => !!f.backgroundColor && f.backgroundColor !== 'transparent';
  const contentOpaque = opaque(flatC);
  const surface = decorate ? (contentOpaque ? flatC : opaque(flatO) ? flatO : null) : null;
  const material = surface ? <OrganicSurface
    radius={typeof surface.borderRadius === 'number' ? surface.borderRadius : 0}
    ink={surface.backgroundColor === colors.primary ? colors.primaryForeground
      : surface.backgroundColor === colors.destructive ? colors.destructiveForeground : colors.primary}
  /> : null;
  return <Pressable
    accessibilityLabel={accessibilityLabel}
    accessibilityHint={accessibilityHint}
    accessibilityRole={accessibilityRole}
    hitSlop={hitSlop}
    accessibilityState={{ ...accessibilityState, disabled }}
    disabled={disabled}
    onPress={onPress}
    onPressIn={pressIn}
    onPressOut={pressOut}
    style={({ pressed }) => [containerStyle, pressed && !disabled && { transform: [{ scale: 0.975 }] }]}
    testID={testID}
  >
    {!contentOpaque && material}
    <Animated.View style={[{ alignSelf: 'stretch', minWidth: 0 }, contentStyle, { transform: [{ scale }, { translateX }, { translateY }] }]}>
      {contentOpaque && material}
      {children}
    </Animated.View>
  </Pressable>;
}