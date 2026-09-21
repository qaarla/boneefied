import React, { useEffect, useRef } from 'react';
import {
  Animated,
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
  disabled?: boolean;
  feedback?: AnswerFeedback;
  reduceMotion?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
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
  disabled = false,
  feedback,
  reduceMotion = false,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
  testID,
  onPress,
  onPressIn,
}: Props) {
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

  return <Pressable
    accessibilityLabel={accessibilityLabel}
    accessibilityRole={accessibilityRole}
    accessibilityState={{ ...accessibilityState, disabled }}
    disabled={disabled}
    onPress={onPress}
    onPressIn={pressIn}
    onPressOut={pressOut}
    style={({ pressed }) => [containerStyle, pressed && !disabled && { transform: [{ scale: 0.975 }] }]}
    testID={testID}
  >
    <Animated.View style={[{ flex: 1 }, contentStyle, { transform: [{ scale }, { translateX }, { translateY }] }]}>
      {children}
    </Animated.View>
  </Pressable>;
}