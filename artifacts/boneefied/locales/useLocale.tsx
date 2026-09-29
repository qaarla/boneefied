import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Asset, Lesson, Module, Question, SourceRecord, Structure } from '@/content/model';
import { content } from '@/content/canonical';
import { sourceCitation } from '@/content/sources';
import {
  spanishAssets, spanishGlossary, spanishModules, spanishSources, spanishUi,
} from './es/index';
import type { SpanishLesson, SpanishQuestion, SpanishStructure } from './es/types';

export type Language = 'en' | 'es';
const LANGUAGE_KEY = '@boneefied/language-v1';
const spanishLessons = Object.assign({}, ...Object.values(spanishModules).map((item) => item.lessons)) as Readonly<Record<string, SpanishLesson>>;
const spanishStructures = Object.assign({}, ...Object.values(spanishModules).map((item) => item.structures)) as Readonly<Record<string, SpanishStructure>>;

type Values = Record<string, string | number>;
type LocaleValue = {
  language: Language;
  hydrated: boolean;
  setLanguage: (language: Language) => void;
  saveError: boolean;
  retrySave: () => void;
  t: (key: string, values?: Values) => string;
  module: (item: Module) => Module;
  lesson: (item: Lesson) => Lesson;
  structure: (item: Structure) => Structure;
  question: (item: Question) => SpanishQuestion;
  asset: (item: Asset) => Asset;
  source: (item: SourceRecord) => SourceRecord;
  citation: (sourceId: string, page?: number | null) => string;
  definition: (structureId: string, english: string) => string;
  number: (value: number, options?: Intl.NumberFormatOptions) => string;
  date: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => string;
};

const LocaleContext = createContext<LocaleValue | null>(null);

function requireCopy<T>(record: Readonly<Record<string, T>>, id: string, kind: string): T {
  const copy = record[id];
  if (!copy) throw new Error(`Spanish ${kind} missing for ${id}`);
  return copy;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setCurrentLanguage] = useState<Language>('en');
  const [hydrated, setHydrated] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const writeQueue = useRef(Promise.resolve());
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(LANGUAGE_KEY).then((saved) => {
      if (mounted) {
        if (saved === 'es') setCurrentLanguage('es');
        setHydrated(true);
      }
    }).catch(() => { if (mounted) { setSaveError(true); setHydrated(true); } });
    return () => { mounted = false; };
  }, []);
  const setLanguage = useCallback((next: Language) => {
    if (!hydrated) return;
    setCurrentLanguage(next);
    writeQueue.current = writeQueue.current.catch(() => undefined)
      .then(() => AsyncStorage.setItem(LANGUAGE_KEY, next))
      .then(() => setSaveError(false))
      .catch(() => setSaveError(true));
  }, [hydrated]);
  const retrySave = useCallback(() => {
    writeQueue.current = writeQueue.current.catch(() => undefined)
      .then(() => AsyncStorage.setItem(LANGUAGE_KEY, language))
      .then(() => setSaveError(false))
      .catch(() => setSaveError(true));
  }, [language]);

  const value = useMemo<LocaleValue>(() => ({
    language, hydrated, setLanguage, saveError, retrySave,
    t: (key, values) => {
      const message = requireCopy(spanishUi, key, 'interface message');
      const template = language === 'es' ? message.es : message.en;
      return template.replace(/\{([a-zA-Z]\w*)\}/g, (token, name: string) =>
        values && Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : token);
    },
    module: (item) => language === 'en' ? item : { ...item, ...requireCopy(spanishModules, item.id, 'module').module },
    lesson: (item) => {
      if (language === 'en') return item;
      const copy = requireCopy(spanishLessons, item.id, 'lesson');
      return {
        ...item, title: copy.title, summary: copy.summary,
        recognitionCues: [...copy.recognitionCues], landmarks: [...copy.landmarks],
        relationships: [...copy.relationships], commonConfusions: [...copy.commonConfusions],
      };
    },
    structure: (item) => {
      if (language === 'en') return item;
      const copy = requireCopy(spanishStructures, item.id, 'structure');
      return { ...item, canonicalName: copy.name, category: copy.category, acceptedAliases: [...copy.aliases] };
    },
    question: (item) => language === 'en'
      ? { prompt: item.prompt, answer: item.answer, options: item.options, explanation: item.explanation, acceptedAliases: item.acceptedAliases }
      : requireCopy(spanishModules, item.moduleId, 'module').questions[item.id] ?? (() => { throw new Error(`Spanish question missing for ${item.id}`); })(),
    asset: (item) => {
      if (language === 'en') return item;
      const copy = requireCopy(spanishAssets, item.id, 'asset');
      return { ...item, ...copy, labels: item.labels?.map((label, index) => ({ ...label, displayLabel: copy.labels![index] })) };
    },
    source: (item) => language === 'en' ? item : { ...item, ...requireCopy(spanishSources, item.id, 'source') },
    citation: (sourceId, page = null) => {
      if (language === 'en') return sourceCitation(content, sourceId, page);
      const original = content.sources.find((item) => item.id === sourceId);
      if (!original) throw new Error(`Source missing for ${sourceId}`);
      const translated = { ...original, ...requireCopy(spanishSources, sourceId, 'source') };
      const title = translated.courseLabAssociation
        ? `${translated.title} · ${translated.courseLabAssociation}` : translated.title;
      const license = translated.attributionLicenseStatus.split(';')[0];
      return `${title} · ${license}${page == null ? '' : ` · p.${new Intl.NumberFormat('es-ES').format(page)}`}`;
    },
    definition: (id, english) => language === 'en' ? english : requireCopy(spanishGlossary, id, 'definition'),
    number: (amount, options) => new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', options).format(amount),
    date: (input, options) => new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', options).format(new Date(input)),
  }), [language, hydrated, setLanguage, saveError, retrySave]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}