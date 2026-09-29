/**
 * Spanish display copy is keyed by immutable English catalog IDs. None of
 * these values replace canonical answers, source facts, or persisted study data.
 */
export interface SpanishLesson {
  title: string;
  summary: string;
  recognitionCues: readonly string[];
  landmarks: readonly string[];
  relationships: readonly string[];
  commonConfusions: readonly string[];
}

export interface SpanishStructure {
  name: string;
  category: string;
  aliases: readonly string[];
}

export interface SpanishQuestion {
  prompt: string;
  explanation?: string;
  answer: string | readonly string[];
  options?: readonly string[];
  acceptedAliases: readonly string[];
}

export interface SpanishModule {
  module: {
    title: string;
    summary?: string;
    system?: string;
    category?: string;
  };
  lessons: Readonly<Record<string, SpanishLesson>>;
  structures: Readonly<Record<string, SpanishStructure>>;
  questions: Readonly<Record<string, SpanishQuestion>>;
}

export interface SpanishAsset {
  title?: string;
  description?: string;
  attributionLicense: string;
  adaptationNote?: string;
  organism?: string;
  specimenNote?: string;
  labels?: readonly string[];
}

export interface SpanishSource {
  title: string;
  notes: string;
  attributionLicenseStatus: string;
  courseLabAssociation?: string;
}

export interface SpanishUiMessage {
  en: string;
  es: string;
}