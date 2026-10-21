export type TabSection = 'study' | 'practice' | 'missed' | 'progress';
export type PracticeStage = 'setup' | 'quiz' | 'results';

export function practiceParent(phase: PracticeStage, categoryOpen: boolean): 'category' | 'root' | null {
  if (phase !== 'setup') return 'category';
  return categoryOpen ? 'root' : null;
}
export type StudyParent = {
  pathname: '/(tabs)/(study)' | '/glossary' | '/glossary/word-parts';
  params?: { system?: string; q?: string };
};

type ModuleCategory = { id: string; system?: string };
// Legacy Cytology predates system metadata but belongs to Cells & Tissues.
const categoryOverrides: Readonly<Record<string, string>> = { 'cytology-mitosis': 'cell' };
const explorerIds = new Set([
  'cell', 'skin', 'skeletal-system', 'joints', 'muscular', 'nervous',
  'nerves', 'senses', 'endocrine', 'cardiovascular', 'vessels', 'lymphatic',
  'respiratory', 'digestive', 'urinary', 'male-reproductive', 'female-reproductive',
]);

export function moduleMatchesCategory(module: ModuleCategory, system: string) {
  return categoryOverrides[module.id] === system || module.system === system || module.id === system || (system === 'nerves' && module.id === 'nervous-system');
}

export function moduleCategory(module: ModuleCategory, explicitParent?: string) {
  if (explicitParent && moduleMatchesCategory(module, explicitParent)) return explicitParent;
  if (categoryOverrides[module.id]) return categoryOverrides[module.id];
  if (explorerIds.has(module.id)) return module.id;
  if (module.system && explorerIds.has(module.system)) return module.system;
  return module.id;
}

/** Logical parents, independent of the stack's browsing history. */
export function studyParent(
  pathname: string,
  modules: readonly ModuleCategory[],
  params: { system?: string; q?: string } = {},
): StudyParent | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return null;
  const moduleId = path.match(/^\/module\/([^/]+)$/)?.[1];
  if (moduleId) {
    const module = modules.find(item => item.id === decodeURIComponent(moduleId));
    return module
      ? { pathname: '/(tabs)/(study)', params: { system: moduleCategory(module, params.system) } }
      : { pathname: '/(tabs)/(study)' };
  }
  if (/^\/glossary\/word-part\/[^/]+$/.test(path)) {
    return { pathname: '/glossary/word-parts', params: params.q ? { q: params.q } : undefined };
  }
  if (path.startsWith('/glossary/') && path !== '/glossary/word-parts') {
    return { pathname: '/glossary', params: params.q ? { q: params.q } : undefined };
  }
  // Glossary lists and Settings are overviews directly below the Study root.
  return { pathname: '/(tabs)/(study)' };
}
