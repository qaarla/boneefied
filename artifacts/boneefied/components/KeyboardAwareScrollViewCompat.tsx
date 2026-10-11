import { Platform, ScrollView, ScrollViewProps } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-controller';

type Props = KeyboardAwareScrollViewProps & ScrollViewProps & { viewerScrollRef?: React.Ref<ScrollView> };

export function KeyboardAwareScrollViewCompat({
  children,
  keyboardShouldPersistTaps = 'handled',
  viewerScrollRef,
  ...props
}: Props) {
  const attachScroll = (node: ScrollView | null) => {
    if (typeof viewerScrollRef === 'function') viewerScrollRef(node);
    else if (viewerScrollRef) viewerScrollRef.current = node;
  };
  if (Platform.OS === 'web') {
    return (
      <ScrollView
        ref={attachScroll}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <KeyboardAwareScrollView
      ref={attachScroll}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
