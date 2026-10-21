import React, { createContext, useCallback, useContext, useRef } from 'react';
import { router, useFocusEffect, useGlobalSearchParams, usePathname } from 'expo-router';
import { content } from '@/content/canonical';
import { studyParent, type TabSection } from '@/navigation/tabHierarchy';

type UpAction = () => void;
type Hierarchy = {
  up: (section: TabSection) => void;
  register: (section: TabSection, action: UpAction) => () => void;
};
const TabHierarchy = createContext<Hierarchy | null>(null);

export function TabHierarchyProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useGlobalSearchParams<{ system?: string; q?: string }>();
  const actions = useRef(new Map<TabSection, UpAction>());
  const register = useCallback((section: TabSection, action: UpAction) => {
    actions.current.set(section, action);
    return () => { if (actions.current.get(section) === action) actions.current.delete(section); };
  }, []);
  const up = useCallback((section: TabSection) => {
    const action = actions.current.get(section);
    if (action) return action();
    if (section !== 'study') return; // Missed and Progress currently have only a root.
    const parent = studyParent(pathname, content.modules, {
      system: typeof params.system === 'string' ? params.system : undefined,
      q: typeof params.q === 'string' ? params.q : undefined,
    });
    // Expo Router resolves hydrated state and handles a parent absent on cold links.
    if (parent) router.dismissTo(parent);
  }, [pathname, params.system, params.q]);
  return <TabHierarchy.Provider value={{ up, register }}>{children}</TabHierarchy.Provider>;
}

export function useTabHierarchy() {
  const context = useContext(TabHierarchy);
  if (!context) throw new Error('Tab hierarchy requires its provider');
  return context;
}

/** Only the focused leaf owns an active tab's upward action. */
export function useTabUpAction(section: TabSection, action: UpAction) {
  const { register } = useTabHierarchy();
  const latest = useRef(action);
  latest.current = action;
  useFocusEffect(useCallback(() => register(section, () => latest.current()), [section, register]));
}
