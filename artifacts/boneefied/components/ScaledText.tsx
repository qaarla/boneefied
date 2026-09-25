import React, { createContext, forwardRef, useContext } from 'react';
import {
  StyleSheet,
  Text as NativeText,
  TextInput as NativeTextInput,
  type TextProps,
  type TextInputProps,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { useStudy } from '@/context/StudyContext';
import { typographyMetrics, type TextScale } from '@/context/typographyScale';

const TypographyContext = createContext<TextScale>('default');

export function TypographyProvider({ children }: { children: React.ReactNode }) {
  const { preferences } = useStudy();
  return <TypographyContext.Provider value={preferences.textScale}>{children}</TypographyContext.Provider>;
}

function scaledStyle(style: StyleProp<TextStyle>, scale: TextScale) {
  const flattened = StyleSheet.flatten(style);
  return [style, typographyMetrics(flattened?.fontSize ?? 14, flattened?.lineHeight, scale)];
}

export const Text = forwardRef<NativeText, TextProps>(function Text({ style, ...props }, ref) {
  const scale = useContext(TypographyContext);
  return <NativeText ref={ref} {...props} style={scaledStyle(style, scale)} />;
});

export const TextInput = forwardRef<NativeTextInput, TextInputProps>(function TextInput({ style, ...props }, ref) {
  const scale = useContext(TypographyContext);
  return <NativeTextInput ref={ref} {...props} style={scaledStyle(style, scale)} />;
});