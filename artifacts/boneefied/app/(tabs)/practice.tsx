import { isAtlasAssetId } from '@/content/atlas-index';
import { formatAnswerForDisplay } from '@/content/answer-display';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Heading, Text, TextInput, useTypographyLayout } from '@/components/ScaledText';
import { AdaptiveButton, AdaptiveCard, AdaptiveRow } from '@/components/AdaptiveLayout';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { content } from '@/content/canonical';
import { answerIsCorrect, createPracticeSession } from '@/content/study';
import type { Question } from '@/content/model';
import { useStudy } from '@/context/StudyContext';
import { useColors } from '@/hooks/useColors';
import { AnatomyImageViewer } from '@/components/AnatomyImageViewer';
import { VisualStudyContext } from '@/components/VisualStudyContext';
import { imageSources } from '@/content/imageSources';
import { isMuscularAtlasAssetId } from '@/content/muscular-atlas-pack';
import { isBvis04AssetId } from '@/content/bvis04-pack';
import { isBvis06AssetId } from '@/content/bvis06-pack';
import { AnimatedAnswerPressable, type AnswerFeedback } from '@/components/AnimatedAnswerPressable';
import { useLocale } from '@/locales/useLocale';
import { spanishResponseForScoring } from '@/locales/es';
import { optionsForQuestion } from '@/components/questionInputPolicy';

type Phase = 'setup' | 'quiz' | 'results';
const supported = new Set(['multiple-choice', 'typed-recall', 'image-identification', 'hotspot', 'histology-identification', 'ordered-sequence', 'select-all', 'bone-laterality', 'function-relationship', 'muscle-action', 'muscle-origin-insertion']);
function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);
  return reduceMotion;
}
function selectionHaptic(enabled: boolean) {
  if (enabled && Platform.OS !== 'web') void Haptics.selectionAsync();
}
function resultHaptic(enabled: boolean, correct: boolean) {
  if (enabled && Platform.OS !== 'web') void Haptics.notificationAsync(
    correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
  );
}
export default function PracticeScreen() {
  const colors = useColors(); const router = useRouter(); const study = useStudy();
  const locale = useLocale();
  const { isCompactTextLayout, isLargeText } = useTypographyLayout();
  const shouldReflow = isCompactTextLayout || isLargeText;
  const reduceMotion = useReduceMotion();
  const { moduleId: requestedModuleId, questionId: requestedQuestionId, retryId } = useLocalSearchParams<{ moduleId?: string; questionId?: string; retryId?: string }>();
  const [selectedModuleId, setSelectedModuleId] = useState(requestedModuleId ?? (requestedQuestionId ? content.questions.find((item) => item.id === requestedQuestionId)?.moduleId : undefined) ?? 'cytology-mitosis');
  const pool = useMemo(() => content.questions.filter((q) => q.moduleId === selectedModuleId && supported.has(q.taskType) && (!requestedQuestionId || q.id === requestedQuestionId)), [selectedModuleId, requestedQuestionId]);
  const [phase, setPhase] = useState<Phase>('setup'); const [count, setCount] = useState(Math.min(5, pool.length));
  const [questions, setQuestions] = useState<Question[]>([]); const [position, setPosition] = useState(0);
  const [answer, setAnswer] = useState<string | string[]>(''); const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(0); const [answers, setAnswers] = useState<boolean[]>([]); const [currentCorrect, setCurrentCorrect] = useState(false); const [sessionId, setSessionId] = useState('');
  const submissionGuard = useRef(false);
  const activeSession = requestedQuestionId ? undefined : study.sessions.find((session) => session.status !== 'completed' && session.moduleId === selectedModuleId);
  useEffect(() => {
    if (!requestedQuestionId || !study.hydrated) return;
    const requested = content.questions.find((item) => item.id === requestedQuestionId && supported.has(item.taskType));
    if (!requested) return;
    const session = createPracticeSession(requested.moduleId, [requested.id], 'missed');
    study.saveSession(session);
    setSelectedModuleId(requested.moduleId);
    setSessionId(session.id);
    setQuestions([requested]);
    setPosition(0);
    setAnswer('');
    submissionGuard.current = false;
    setSubmitted(false);
    setCurrentCorrect(false);
    setCorrect(0);
    setAnswers([]);
    setPhase('quiz');
  }, [requestedQuestionId, retryId, study.hydrated]);
  useEffect(() => {
    if (activeSession && phase === 'setup') {
      const resumed = activeSession.questionIds.map((id) => content.questions.find((item) => item.id === id)).filter((item): item is Question => !!item);
      if (resumed.length) {
        const last = activeSession.answers.at(-1);
        const awaitingFinish = activeSession.position >= resumed.length && last?.questionId === resumed[resumed.length - 1].id;
        setSessionId(activeSession.id);
        setQuestions(resumed);
        setPosition(Math.min(activeSession.position, resumed.length - 1));
        setAnswers(activeSession.answers.map((item) => item.outcome === 'correct'));
        setCorrect(activeSession.answers.filter((item) => item.outcome === 'correct').length);
        const draft = activeSession.draft;
        setAnswer(awaitingFinish ? last?.answer ?? '' : draft?.questionId === resumed[activeSession.position]?.id ? draft.answer : '');
        setSubmitted(awaitingFinish);
        setCurrentCorrect(awaitingFinish && last.outcome === 'correct');
        submissionGuard.current = awaitingFinish;
        setPhase('quiz');
      }
    }
  }, [activeSession?.id]);
  const start = () => {
    if (!study.hydrated) return;
    const attemptsByStructure = new Map<string, number>();
    study.attempts.forEach((item) => attemptsByStructure.set(item.structureId ?? '', (attemptsByStructure.get(item.structureId ?? '') ?? 0) + 1));
    const ordered = [...pool].sort((a, b) =>
      (attemptsByStructure.get(a.structureIds[0]) ?? 0) - (attemptsByStructure.get(b.structureIds[0]) ?? 0));
    const seen = new Set<string>();
    const distinct = ordered.filter((item) => {
      const key = item.structureIds[0];
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
    const selected = [...distinct, ...ordered.filter((item) => !distinct.includes(item))]
      .slice(0, Math.max(1, Math.min(count, pool.length)));
    const session = createPracticeSession(selectedModuleId, selected.map((item) => item.id));
    study.saveSession(session); setSessionId(session.id); setQuestions(selected); setPhase('quiz'); setPosition(0); setCorrect(0); setAnswers([]); setAnswer(''); submissionGuard.current = false; setSubmitted(false); setCurrentCorrect(false);
  };
  const underpracticed = useMemo(() => {
    const attempts = new Map<string, number>();
    study.attempts.forEach((attempt) => attempts.set(attempt.structureId ?? '', (attempts.get(attempt.structureId ?? '') ?? 0) + 1));
    return content.structures.filter((structure) => structure.moduleId === selectedModuleId && pool.some((question) => question.structureIds[0] === structure.id))
      .sort((a, b) => (attempts.get(a.id) ?? 0) - (attempts.get(b.id) ?? 0)).slice(0, 5);
  }, [selectedModuleId, study.attempts, pool]);
  const startFocused = () => {
    if (!study.hydrated) return;
    const targets = new Set(underpracticed.map((item) => item.id));
    const selected = pool.filter((item) => targets.has(item.structureIds[0]))
      .filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index)
      .slice(0, Math.max(1, Math.min(count, pool.length)));
    if (selected.length) {
      const session = createPracticeSession(selectedModuleId, selected.map((item) => item.id));
      study.saveSession(session); setSessionId(session.id); setQuestions(selected); setPhase('quiz'); setPosition(0); setCorrect(0); setAnswers([]); setAnswer(''); submissionGuard.current = false; setSubmitted(false); setCurrentCorrect(false);
    }
  };
  const q = questions[position];
  const saveDraft = (value: string | string[]) => {
    if (!q || submitted || !sessionId) return;
    const session = study.sessions.find((item) => item.id === sessionId);
    if (!session || session.status === 'completed') return;
    const empty = value === '' || Array.isArray(value) && value.length === 0;
    study.saveSession({
      ...session, draft: empty ? undefined : { questionId: q.id, answer: value },
      updatedAt: new Date().toISOString(),
    });
  };
  const updateAnswer = (value: string | string[]) => { setAnswer(value); saveDraft(value); };
  const localizedQuestion = q ? locale.question(q) : undefined;
  const selectedModule = content.modules.find((item) => item.id === selectedModuleId);
  const citation = (sourceId: string, page: number | null) => locale.citation(sourceId, page);
  const scoreAnswer = (candidate: string | string[], question: Question) =>
    answerIsCorrect(spanishResponseForScoring(question, candidate), question);
  const correctAnswerText = (question: Question) => {
    const localized = locale.question(question).answer;
    return formatAnswerForDisplay(question, localized, (id) => {
      const structure = content.structures.find((s) => s.id === id);
      // Legacy questions can already contain a localized display name, not an ID.
      return structure ? locale.structure(structure).canonicalName : id;
    }, isBvis06AssetId(question.assetId));
  };
  const submit = () => {
    if (submitted || submissionGuard.current || !q || !study.sessions.some((session) => session.id === sessionId && session.status !== 'completed')) return;
    submissionGuard.current = true;
    const isCorrect = scoreAnswer(answer, q); setCurrentCorrect(isCorrect); setSubmitted(true); setAnswers((items) => [...items, isCorrect]); if (isCorrect) setCorrect((n) => n + 1);
    resultHaptic(study.preferences.haptics, isCorrect);
    study.submitSessionAnswer(sessionId, { questionId: q.id, answer, outcome: isCorrect ? 'correct' : 'wrong', submittedAt: new Date().toISOString() }, { questionId: q.id, structureId: q.structureIds[0], correct: isCorrect, answer });
  };
  const next = () => { if (!submitted) return; if (position + 1 >= questions.length) { study.completeSession(sessionId); setPhase('results'); } else { setPosition((n) => n + 1); setAnswer(''); submissionGuard.current = false; setSubmitted(false); setCurrentCorrect(false); } };
  if (!study.hydrated) return <Screen><Text style={{ color: colors.mutedForeground }}>{locale.t('practice.loadingSavedProgress')}</Text></Screen>;
  if (phase !== 'setup' && !study.sessions.some((session) => session.id === sessionId)) return <Screen><Text style={{ color: colors.mutedForeground }}>{locale.t('practice.preparingSavedSession')}</Text></Screen>;
  if (phase === 'setup') return <Screen>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{locale.t('practice.eyebrow')}</Text><Heading style={[styles.title, shouldReflow && styles.reflowTitle, { color: colors.foreground }]}>{selectedModule ? locale.module(selectedModule).title : locale.t('practice.titleFallback')}</Heading>
      <Text style={[styles.intro, { color: colors.mutedForeground }]}>{locale.t('practice.intro')}</Text>
      <AdaptiveCard style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}><Heading style={[styles.panelTitle, { color: colors.foreground }]}>{locale.t('practice.sessionSetup')}</Heading>
         {content.modules.filter((item) => item.published).length > 1 && <View style={styles.counts}>{content.modules.filter((item) => item.published).map((item) => <AdaptiveButton key={item.id} onPress={() => { setSelectedModuleId(item.id); setPhase('setup'); }} style={[styles.count, { borderColor: selectedModuleId === item.id ? colors.primary : colors.border, backgroundColor: selectedModuleId === item.id ? colors.secondary : colors.card }]}><Text style={{ color: colors.foreground }}>{locale.module(item).title}</Text></AdaptiveButton>)}</View>}
        <Text style={{ color: colors.mutedForeground }}>{locale.t('practice.eligibleQuestions', { count: locale.number(pool.length) })}</Text>
        <View style={styles.counts}>{[3, 5, pool.length].filter((n, i, a) => n > 0 && a.indexOf(n) === i).map((n) => <AdaptiveButton key={n} onPress={() => setCount(Math.min(n, pool.length))} style={[styles.count, { borderColor: count === Math.min(n, pool.length) ? colors.primary : colors.border, backgroundColor: count === Math.min(n, pool.length) ? colors.secondary : colors.card }]}><Text style={{ color: colors.foreground }}>{locale.t(n === 1 ? 'practice.questionCount.one' : 'practice.questionCount.other', { count: locale.number(n) })}</Text></AdaptiveButton>)}</View>
        {activeSession ? <AdaptiveButton testID="resume-practice" onPress={() => setPhase('quiz')} style={[styles.primaryContent, { backgroundColor: colors.primary }]}><Text style={[{ color: colors.primaryForeground, fontWeight: '700' }, styles.reflowRetryText]}>{locale.t('practice.resumeSavedSession')}</Text></AdaptiveButton> : <AdaptiveButton testID="start-practice" onPress={start} style={[styles.primaryContent, { backgroundColor: colors.primary }]}><Text style={[{ color: colors.primaryForeground, fontWeight: '700' }, styles.reflowRetryText]}>{locale.t('practice.start')}</Text></AdaptiveButton>}
     </AdaptiveCard>
       <AdaptiveCard style={[styles.panel, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Heading style={[styles.panelTitle, { color: colors.foreground }]}>{locale.t('practice.focusedHeading')}</Heading>
         <Text style={{ color: colors.mutedForeground }}>{locale.t('practice.lowestAttemptStructures', { structures: underpracticed.map((item) => locale.structure(item).canonicalName).join(' · ') || locale.t('practice.noneYet') })}</Text>
          <AdaptiveButton testID="start-focused-practice" onPress={startFocused} disabled={!underpracticed.length} style={[styles.primaryContent, { borderWidth: 1, borderColor: colors.primary, opacity: underpracticed.length ? 1 : 0.5 }]}><Text style={[{ color: colors.primary, fontWeight: '700' }, styles.reflowRetryText]}>{locale.t('practice.startFocused')}</Text></AdaptiveButton>
       </AdaptiveCard>
       <Text style={[styles.note, { color: colors.mutedForeground }]}>{locale.t('practice.supportedTypes')}</Text>
  </Screen>;
  if (phase === 'results') return <Screen>
       <Text style={[styles.eyebrow, { color: colors.primary }]}>{locale.t('practice.sessionComplete')}</Text><Heading style={[styles.title, shouldReflow && styles.reflowTitle, { color: colors.foreground }]}>{locale.t('practice.results')}</Heading>
       <AdaptiveCard style={[styles.result, { backgroundColor: colors.card, borderColor: colors.border }]}>{shouldReflow ? <View style={styles.reflowScore}><Text style={[styles.big, { color: colors.foreground }]}>{locale.number(correct)}</Text><Text style={[styles.resultTotal, { color: colors.mutedForeground }]}>{locale.t('practice.scoreOutOf', { total: locale.number(questions.length) })}</Text></View> : <Text style={[styles.big, { color: colors.foreground }]}>{locale.number(correct)}/{locale.number(questions.length)}</Text>}<Text style={{ color: colors.mutedForeground }}>{locale.t('practice.accuracy', { percent: locale.number(Math.round(correct / Math.max(questions.length, 1) * 100)) })}</Text></AdaptiveCard>
       {questions.map((item, index) => { const display = locale.question(item); return <View key={item.id} style={styles.review}><Text style={[styles.reviewText, shouldReflow && styles.reflowText, { color: colors.foreground }]}>{locale.number(index + 1)}. {locale.t(answers[index] ? 'practice.correct' : 'practice.wrongOrUnanswered')} · {display.prompt}</Text><Text style={[styles.reviewDetail, shouldReflow && styles.reflowText, { color: colors.mutedForeground }]}>{display.explanation} · {citation(item.sourceId, item.sourcePage)}</Text></View>; })}
     <Text style={{ color: colors.mutedForeground }}>{locale.t('practice.savedMissedNotice')}</Text>
       <AdaptiveButton onPress={start} style={[styles.primaryContent, { backgroundColor: colors.primary }]}><Text style={[{ color: colors.primaryForeground, fontWeight: '700' }, styles.reflowRetryText]}>{locale.t('practice.retryModule')}</Text></AdaptiveButton>
      <AdaptiveButton onPress={() => router.replace('/(tabs)')} style={styles.link}><Text style={{ color: colors.primary, fontWeight: '700' }}>{locale.t('practice.returnToStudy')}</Text></AdaptiveButton>
  </Screen>;
  if (!q || !localizedQuestion) return null;
  return <Screen keyboardAware>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{locale.t('practice.questionPosition', { position: locale.number(position + 1), total: locale.number(questions.length) })}</Text><Heading style={[styles.title, shouldReflow && styles.reflowTitle, { color: colors.foreground }]}>{localizedQuestion.prompt}</Heading>
      <AdaptiveButton accessibilityLabel={locale.t('practice.saveAndExit.accessibility')} onPress={() => { if (!submitted) saveDraft(answer); setPhase('setup'); }} style={shouldReflow ? styles.reflowSaveExit : undefined}><Text style={{ color: colors.primary }}>{locale.t('practice.saveAndExit.visible')}</Text></AdaptiveButton>
     <QuestionInput question={q} value={answer} setValue={updateAnswer} disabled={submitted} colors={colors} reduceMotion={reduceMotion} hapticsEnabled={study.preferences.haptics} />
      {submitted && <View style={[styles.feedback, { backgroundColor: currentCorrect ? colors.secondary : colors.card, borderColor: colors.border }]}><Text style={{ color: colors.foreground, fontWeight: '700' }}>{locale.t(currentCorrect ? 'practice.correctFeedback' : 'practice.incorrectFeedback')}</Text>{!currentCorrect && <Text style={{ color: colors.foreground, fontWeight: '600' }}>{locale.t('practice.correctAnswer', { answer: correctAnswerText(q) })}</Text>}<Text style={{ color: colors.mutedForeground }}>{localizedQuestion.explanation}</Text><Text style={{ color: colors.mutedForeground }}>{locale.t('practice.source', { citation: citation(q.sourceId, q.sourcePage) })}</Text></View>}
    <AnimatedAnswerPressable
      testID="submit-answer"
      onPress={submit}
      disabled={submitted || answer === '' || (Array.isArray(answer) && answer.length === 0)}
      feedback={submitted ? (currentCorrect ? 'correct' : 'incorrect') : undefined}
      reduceMotion={reduceMotion}
       accessibilityLabel={submitted ? locale.t(currentCorrect ? 'practice.answerSubmitted.correct' : 'practice.answerSubmitted.incorrect') : locale.t('practice.submitAnswer.accessibility')}
      containerStyle={styles.primary}
      contentStyle={[styles.primaryContent, { backgroundColor: submitted ? (currentCorrect ? colors.success : colors.destructive) : answer === '' || (Array.isArray(answer) && answer.length === 0) ? colors.muted : colors.primary }]}
     ><Text style={{ color: submitted ? (currentCorrect ? colors.successForeground : colors.destructiveForeground) : colors.primaryForeground, fontWeight: '700' }}>{submitted ? locale.t(currentCorrect ? 'practice.submission.correct' : 'practice.submission.incorrect') : locale.t('practice.submitAnswer.visible')}</Text></AnimatedAnswerPressable>
     {submitted && <AnimatedAnswerPressable testID="next-answer" onPress={next} onPressIn={() => selectionHaptic(study.preferences.haptics)} reduceMotion={reduceMotion} containerStyle={styles.primary} contentStyle={[styles.primaryContent, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>{locale.t(position + 1 === questions.length ? 'practice.seeResults' : 'practice.nextQuestion')}</Text></AnimatedAnswerPressable>}
  </Screen>;
}

function QuestionInput({ question, value, setValue, disabled, colors, reduceMotion, hapticsEnabled }: { question: Question; value: string | string[]; setValue: (v: string | string[]) => void; disabled: boolean; colors: any; reduceMotion: boolean; hapticsEnabled: boolean }) {
  const locale = useLocale();
  const { isCompactTextLayout, isLargeText } = useTypographyLayout();
  const shouldReflow = isCompactTextLayout || isLargeText;
  const canonicalAsset = question.assetId ? content.assets.find((item) => item.id === question.assetId) : undefined;
  const asset = canonicalAsset ? locale.asset(canonicalAsset) : undefined;
  const localizedQuestion = locale.question(question);
   const options = optionsForQuestion(question);
  const localizedAnswers = Array.isArray(localizedQuestion.answer) ? localizedQuestion.answer : [localizedQuestion.answer];
  const labels = options.map((option, index) => {
    const structure = question.taskType === 'ordered-sequence' ? content.structures.find((s) => s.id === option) : undefined;
    return structure ? locale.structure(structure).canonicalName : localizedQuestion.options?.[index] ?? localizedAnswers[index] ?? option;
  });
  const scoreAnswer = (candidate: string | string[]) => answerIsCorrect(spanishResponseForScoring(question, candidate), question);
  const muscularPlate = !!asset && isMuscularAtlasAssetId(asset.id);
  const bvis04Plate = !!asset && isBvis04AssetId(asset.id);
  const bvis06Plate = !!asset && isBvis06AssetId(asset.id);
  const actionMarker = muscularPlate && question.taskType === 'muscle-action' && question.id.startsWith('q-muscular-atlas-');
   const imageIdMarker = (muscularPlate || bvis04Plate || bvis06Plate) && question.taskType === 'image-identification';
  const bvis04ChoiceMarker = bvis04Plate && (question.taskType === 'function-relationship' || question.taskType === 'multiple-choice');
  const readOnlyMarker = actionMarker || imageIdMarker || bvis04ChoiceMarker || (bvis06Plate && question.taskType === 'ordered-sequence');
  const numberedTargets = question.id.startsWith('q-skeletal-atlas-') || ((muscularPlate || bvis04Plate || bvis06Plate) && question.taskType === 'hotspot') || readOnlyMarker;
  const targets = readOnlyMarker ? question.hotspots : question.taskType === 'image-identification' ? [] : question.hotspots ?? asset?.hotspots;
  const canSelectTarget = question.taskType !== 'image-identification' && !readOnlyMarker;
  const image = asset ? <View style={{ gap: 8 }}>
    <AnatomyImageViewer source={imageSources[asset.id]} atlasLayout={isAtlasAssetId(asset.id)} questionHotspotCallouts={numberedTargets} hotspots={targets} labels={(disabled || (question.taskType === 'image-identification' && !imageIdMarker)) ? asset.labels?.filter((label) => question.structureIds.includes(label.structureId)) : []} revealLabels={disabled} bakedLabels={asset.labelStatus === 'labeled'} imageAspectRatio={asset.imageAspectRatio} caption={disabled ? asset.title : undefined} onHotspotPress={canSelectTarget ? (hotspot) => { selectionHaptic(hapticsEnabled); setValue(hotspot.structureId); } : undefined} selectedHotspotId={typeof value === 'string' ? value : undefined} correctHotspotId={question.structureIds[0]} submitted={disabled && !readOnlyMarker} reduceMotion={reduceMotion} />
    {disabled && <VisualStudyContext asset={asset} learn />}
  </View> : null;
   if (question.taskType === 'hotspot') return <View style={{ gap: 10 }}>{image}<Text style={{ color: colors.mutedForeground }}>{locale.t('practice.hotspotInstruction')}</Text></View>;
     if (question.taskType === 'typed-recall' || question.taskType === 'image-identification') return <View style={{ gap: 10 }}>{image}<TextInput testID="typed-answer" accessibilityLabel={disabled ? locale.t(scoreAnswer(value) ? 'practice.correctTypedAnswer' : 'practice.incorrectTypedAnswer') : locale.t('practice.imageIdentificationAnswer')} value={typeof value === 'string' ? value : ''} onChangeText={setValue} editable={!disabled} onSubmitEditing={Keyboard.dismiss} placeholder={locale.t('practice.answerPlaceholder')} placeholderTextColor={colors.mutedForeground} multiline={shouldReflow} submitBehavior={shouldReflow ? 'blurAndSubmit' : undefined} style={[styles.input, shouldReflow && styles.largeInput, { color: colors.foreground, borderColor: disabled ? (scoreAnswer(value) ? colors.success : colors.destructive) : colors.border, backgroundColor: colors.card }]} returnKeyType="done" /></View>;
  if (question.taskType === 'ordered-sequence') {
    const selected = Array.isArray(value) ? value : [];
    const move = (index: number, delta: number) => { const next = [...selected]; const target = index + delta; if (target >= 0 && target < next.length) [next[index], next[target]] = [next[target], next[index]]; setValue(next); };
     return <View style={{ gap: 10 }}>{image}<View style={styles.options}>{options.map((option, optionIndex) => {
      const index = selected.indexOf(option);
      const expected = question.answer as string[];
      const label = labels[optionIndex];
      const feedback: AnswerFeedback | undefined = disabled ? (index >= 0 && expected[index] === option ? 'correct' : 'incorrect') : undefined;
        return <AdaptiveRow key={option} style={[styles.orderRow, shouldReflow && styles.largeOrderRow]}>
          <AnimatedAnswerPressable disabled={disabled} onPressIn={() => selectionHaptic(hapticsEnabled)} onPress={() => setValue(index >= 0 ? selected.filter((x) => x !== option) : [...selected, option])} feedback={feedback} reduceMotion={reduceMotion} accessibilityLabel={`${label}${feedback === 'correct' ? locale.t('practice.correctPosition') : feedback === 'incorrect' ? locale.t('practice.incorrectPosition', { position: locale.number(expected.indexOf(option) + 1) }) : ''}`} accessibilityState={{ selected: index >= 0 }} containerStyle={shouldReflow ? { alignSelf: 'stretch' } : { flex: 1 }} contentStyle={[styles.option, { borderColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : index >= 0 ? colors.primary : colors.border, backgroundColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : index >= 0 ? colors.secondary : colors.card }]}>
           <Text style={{ color: feedback ? (feedback === 'correct' ? colors.successForeground : colors.destructiveForeground) : colors.foreground }}>{feedback === 'correct' ? '✓ ' : feedback === 'incorrect' ? '✕ ' : ''}{index >= 0 ? `${index + 1}. ` : ''}{label}</Text>
        </AnimatedAnswerPressable>
           {index >= 0 && !disabled && <View style={shouldReflow ? styles.largeOrderActions : undefined}><Pressable accessibilityRole="button" accessibilityLabel={locale.t('practice.moveOptionUp', { option: label })} onPress={() => { selectionHaptic(hapticsEnabled); move(index, -1); }} style={shouldReflow ? styles.largeOrderArrow : undefined}><Text style={{ color: colors.primary }}>↑</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={locale.t('practice.moveOptionDown', { option: label })} onPress={() => { selectionHaptic(hapticsEnabled); move(index, 1); }} style={shouldReflow ? styles.largeOrderArrow : undefined}><Text style={{ color: colors.primary }}>↓</Text></Pressable></View>}
       </AdaptiveRow>;
    })}</View></View>;
  }
  const selected = Array.isArray(value) ? value : [];
  const expected = Array.isArray(question.answer) ? question.answer : [question.answer];
   return <View style={{ gap: 10 }}>{image}<View style={styles.options}>{options.map((option, optionIndex) => {
     const label = labels[optionIndex];
     const active = question.taskType === 'select-all' ? selected.includes(option) : value === option;
    const feedback: AnswerFeedback | undefined = disabled
      ? expected.includes(option) ? 'correct' : active ? 'incorrect' : undefined
      : undefined;
     return <AnimatedAnswerPressable key={option} disabled={disabled} onPressIn={() => selectionHaptic(hapticsEnabled)} onPress={() => setValue(question.taskType === 'select-all' ? (active ? selected.filter((x) => x !== option) : [...selected, option]) : option)} feedback={feedback} reduceMotion={reduceMotion} accessibilityLabel={`${label}${feedback === 'correct' ? locale.t('practice.correctAnswerOption') : feedback === 'incorrect' ? locale.t('practice.incorrectSelection') : ''}`} accessibilityState={{ selected: active }} contentStyle={[styles.option, { borderColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : active ? colors.primary : colors.border, backgroundColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : active ? colors.secondary : colors.card }]}>
       <Text style={{ color: feedback ? (feedback === 'correct' ? colors.successForeground : colors.destructiveForeground) : colors.foreground }}>{feedback === 'correct' ? '✓ ' : feedback === 'incorrect' ? '✕ ' : active ? '✓ ' : ''}{label}</Text>
    </AnimatedAnswerPressable>;
  })}</View></View>;
}
const styles = StyleSheet.create({ eyebrow:{fontSize:11,letterSpacing:1.5,fontWeight:'700'},title:{fontSize:27,fontWeight:'700'},reflowTitle:{width:'100%',flexShrink:1},intro:{fontSize:15,lineHeight:22},panel:{borderWidth:1,borderRadius:16,padding:16,gap:16},focus:{borderWidth:1,borderRadius:14,padding:14,gap:9},panelTitle:{fontSize:17,fontWeight:'700'},counts:{gap:8},count:{borderWidth:1,borderRadius:10,padding:13},primary:{minHeight:48,borderRadius:12},primaryContent:{minHeight:48,borderRadius:12,alignItems:'center',justifyContent:'center',paddingHorizontal:16},reflowRetry:{alignItems:'center',justifyContent:'center',paddingHorizontal:16},reflowRetryText:{paddingVertical:12,textAlign:'center',flexShrink:1},secondary:{minHeight:40,borderWidth:1,borderRadius:10,alignItems:'center',justifyContent:'center',paddingHorizontal:12},reflowSaveExit:{minHeight:44,justifyContent:'center',alignSelf:'flex-start'},note:{fontSize:13,lineHeight:20},options:{gap:10},orderRow:{flexDirection:'row',alignItems:'center',gap:8},largeOrderRow:{flexDirection:'column',alignItems:'stretch',gap:4},largeOrderActions:{flexDirection:'row',alignSelf:'flex-end',gap:8},largeOrderArrow:{minWidth:44,minHeight:44,alignItems:'center',justifyContent:'center'},option:{borderWidth:1,borderRadius:12,padding:15,minHeight:48,justifyContent:'center'},input:{borderWidth:2,borderRadius:12,padding:14,fontSize:16,minHeight:50},largeInput:{minHeight:96,textAlignVertical:'top'},feedback:{borderWidth:1,borderRadius:14,padding:15,gap:8},result:{borderWidth:1,borderRadius:16,padding:22,alignItems:'center',gap:8},reflowScore:{alignItems:'center'},resultTotal:{fontSize:20,fontWeight:'600'},review:{borderBottomWidth:1,paddingVertical:10,gap:4},reviewText:{width:'100%',flexShrink:1},reviewDetail:{width:'100%',flexShrink:1},reflowText:{alignSelf:'stretch'},big:{fontSize:40,fontWeight:'700'},link:{alignItems:'center',padding:12} });