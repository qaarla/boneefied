export type VerificationStatus = 'verified' | 'draft' | 'unresolved' | 'blocked';
export type MasteryState = 'New' | 'Learning' | 'Needs Review' | 'Strong' | 'Mastered';
export type AssetType = 'diagram' | 'model' | 'histology' | 'cadaver' | 'syndaver' | 'gross specimen' | 'worksheet';
export type QuestionType =
  | 'image-identification' | 'hotspot' | 'letter-number-identification' | 'multiple-choice'
  | 'select-all' | 'typed-recall' | 'matching' | 'ordered-sequence' | 'bone-laterality'
  | 'muscle-action' | 'muscle-origin-insertion' | 'function-relationship' | 'histology-identification';

export interface SourceRecord {
  id: string;
  filename: string;
  hash: string;
  pageCount: number | null;
  title: string;
  courseLabAssociation: string | null;
  sourceType: 'brief' | 'image' | 'text';
  attributionLicenseStatus: string;
  notes: string;
  verificationStatus: VerificationStatus;
}
export interface Module {
  id: string;
  labNumber?: string;
  title: string;
  ordering: number;
  sourceIds: string[];
  visible: boolean;
  published: boolean;
  contentStatus: 'available' | 'content-blocked';
}
export interface Structure {
  id: string;
  canonicalName: string;
  acceptedAliases: string[];
  moduleId: string;
  category: string;
  sourceId: string;
  sourcePage: number | null;
  examPriority: boolean;
  verificationStatus: VerificationStatus;
}
export interface Asset {
  id: string;
  sourceId: string;
  sourcePage: number | null;
  localAssetPath: string | null;
  assetType: AssetType;
  labelStatus: 'labeled' | 'unlabeled' | 'not-applicable';
  attributionLicense: string;
  verificationStatus: VerificationStatus;
}
export interface NormalizedHotspot {
  x: number;
  y: number;
  radius: number;
  structureId: string;
}
export interface Question {
  id: string;
  moduleId: string;
  structureIds: string[];
  taskType: QuestionType;
  prompt: string;
  assetId?: string;
  answer: string | string[];
  acceptedAliases: string[];
  options?: string[];
  explanation?: string;
  sourceId: string;
  sourcePage: number | null;
  examPriority: boolean;
  verificationStatus: VerificationStatus;
  hotspots?: NormalizedHotspot[];
}
export interface Pathway {
  id: string;
  moduleId: string;
  title: string;
  structureIds: string[];
  sourceId: string;
  sourcePage: number | null;
  verificationStatus: VerificationStatus;
}
export interface Attempt {
  id: string;
  questionId: string;
  structureId?: string;
  correct: boolean;
  answer: string | string[];
  createdAt: string;
}
export interface MissedItem {
  questionId: string;
  structureId?: string;
  incorrectCount: number;
  lastAttemptAt: string;
}
export interface MasteryRecord {
  structureId: string;
  state: MasteryState;
  attempts: number;
  correct: number;
  incorrect: number;
  updatedAt: string;
}
export type PracticeSessionStatus = 'active' | 'paused' | 'completed';
export type PracticeEntryPoint = 'practice' | 'missed' | 'study';
export interface SessionAnswer {
  questionId: string;
  answer?: string | string[];
  outcome: 'correct' | 'wrong' | 'skipped' | 'unanswered';
  submittedAt?: string;
}
export interface PracticeSession {
  id: string;
  moduleId: string;
  mode: 'practice' | 'recall';
  entryPoint: PracticeEntryPoint;
  questionIds: string[];
  position: number;
  answers: SessionAnswer[];
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  status: PracticeSessionStatus;
}
export interface ContentCatalog {
  sources: SourceRecord[];
  modules: Module[];
  structures: Structure[];
  assets: Asset[];
  questions: Question[];
  pathways: Pathway[];
}

export const QUESTION_TYPES: ReadonlyArray<{ id: QuestionType; label: string }> = [
  { id: 'image-identification', label: 'Image identification' },
  { id: 'hotspot', label: 'Hotspot / tap the structure' },
  { id: 'letter-number-identification', label: 'Letter or number identification' },
  { id: 'multiple-choice', label: 'Multiple choice' },
  { id: 'select-all', label: 'Select all that apply' },
  { id: 'typed-recall', label: 'Typed recall' },
  { id: 'matching', label: 'Matching' },
  { id: 'ordered-sequence', label: 'Ordered sequence / pathway' },
  { id: 'bone-laterality', label: 'Bone laterality' },
  { id: 'muscle-action', label: 'Muscle action' },
  { id: 'muscle-origin-insertion', label: 'Muscle origin / insertion' },
  { id: 'function-relationship', label: 'Function / relationship' },
  { id: 'histology-identification', label: 'Histology identification' },
];