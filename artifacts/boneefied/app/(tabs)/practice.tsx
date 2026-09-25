import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from '@/components/ScaledText';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { content } from '@/content/canonical';
import { answerIsCorrect, createPracticeSession } from '@/content/study';
import type { Question } from '@/content/model';
import { useStudy } from '@/context/StudyContext';
import { useColors } from '@/hooks/useColors';
import { sourceCitation } from '@/content/sources';
import { AnatomyImageViewer } from '@/components/AnatomyImageViewer';
import { imageSources } from '@/content/imageSources';
import { AnimatedAnswerPressable, type AnswerFeedback } from '@/components/AnimatedAnswerPressable';

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
function correctAnswerText(question: Question) {
  if (!Array.isArray(question.answer)) return question.answer;
  return question.answer.join(question.taskType === 'ordered-sequence' ? ' → ' : ' · ');
}
export default function PracticeScreen() {
  const colors = useColors(); const router = useRouter(); const study = useStudy();
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
      if (resumed.length) { setSessionId(activeSession.id); setQuestions(resumed); setPosition(Math.min(activeSession.position, resumed.length - 1)); setAnswers(activeSession.answers.map((item) => item.outcome === 'correct')); setCorrect(activeSession.answers.filter((item) => item.outcome === 'correct').length); setPhase('quiz'); }
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
  const submit = () => {
    if (submitted || submissionGuard.current || !q || !study.sessions.some((session) => session.id === sessionId && session.status !== 'completed')) return;
    submissionGuard.current = true;
    const isCorrect = answerIsCorrect(answer, q); setCurrentCorrect(isCorrect); setSubmitted(true); setAnswers((items) => [...items, isCorrect]); if (isCorrect) setCorrect((n) => n + 1);
    resultHaptic(study.preferences.haptics, isCorrect);
    study.submitSessionAnswer(sessionId, { questionId: q.id, answer, outcome: isCorrect ? 'correct' : 'wrong', submittedAt: new Date().toISOString() }, { questionId: q.id, structureId: q.structureIds[0], correct: isCorrect, answer });
  };
  const next = () => { if (!submitted) return; if (position + 1 >= questions.length) { study.completeSession(sessionId); setPhase('results'); } else { setPosition((n) => n + 1); setAnswer(''); submissionGuard.current = false; setSubmitted(false); setCurrentCorrect(false); } };
  if (!study.hydrated) return <Screen><Text style={{ color: colors.mutedForeground }}>Loading saved study progress…</Text></Screen>;
  if (phase !== 'setup' && !study.sessions.some((session) => session.id === sessionId)) return <Screen><Text style={{ color: colors.mutedForeground }}>Preparing saved practice session…</Text></Screen>;
  if (phase === 'setup') return <Screen>
     <Text style={[styles.eyebrow, { color: colors.primary }]}>PRACTICE</Text><Text style={[styles.title, { color: colors.foreground }]}>{content.modules.find((item) => item.id === selectedModuleId)?.title ?? 'Anatomy practice'}</Text>
     <Text style={[styles.intro, { color: colors.mutedForeground }]}>Practice uses the same source-linked structures and explanations as Study. Image questions appear only when answer mapping is verified.</Text>
    <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.panelTitle, { color: colors.foreground }]}>Session setup</Text>
       {content.modules.filter((item) => item.published).length > 1 && <View style={styles.counts}>{content.modules.filter((item) => item.published).map((item) => <Pressable key={item.id} onPress={() => { setSelectedModuleId(item.id); setPhase('setup'); }} style={[styles.count, { borderColor: selectedModuleId === item.id ? colors.primary : colors.border, backgroundColor: selectedModuleId === item.id ? colors.secondary : colors.card }]}><Text style={{ color: colors.foreground }}>{item.title}</Text></Pressable>)}</View>}
       <Text style={{ color: colors.mutedForeground }}>Eligible questions: {pool.length}. No duplicate padding.</Text>
      <View style={styles.counts}>{[3, 5, pool.length].filter((n, i, a) => n > 0 && a.indexOf(n) === i).map((n) => <Pressable key={n} onPress={() => setCount(Math.min(n, pool.length))} style={[styles.count, { borderColor: count === Math.min(n, pool.length) ? colors.primary : colors.border, backgroundColor: count === Math.min(n, pool.length) ? colors.secondary : colors.card }]}><Text style={{ color: colors.foreground }}>{n} questions</Text></Pressable>)}</View>
      {activeSession ? <Pressable testID="resume-practice" onPress={() => setPhase('quiz')} style={[styles.primary, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Resume saved session</Text></Pressable> : <Pressable testID="start-practice" onPress={start} style={[styles.primary, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Start practice</Text></Pressable>}
    </View>
      <View style={[styles.focus, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Text style={{ color: colors.foreground, fontWeight: '700' }}>Focused practice</Text>
        <Text style={{ color: colors.mutedForeground }}>Lowest-attempt structures: {underpracticed.map((item) => item.canonicalName).join(' · ') || 'none yet'}</Text>
        <Pressable testID="start-focused-practice" onPress={startFocused} disabled={!underpracticed.length} style={[styles.secondary, { borderColor: colors.primary, opacity: underpracticed.length ? 1 : 0.5 }]}><Text style={{ color: colors.primary, fontWeight: '700' }}>Start focused practice</Text></Pressable>
      </View>
      <Text style={[styles.note, { color: colors.mutedForeground }]}>Supported here: multiple choice, image identification, hotspot recall, typed recall, select-all, ordered sequence, bone laterality, muscle action/attachments, and relationship questions.</Text>
  </Screen>;
  if (phase === 'results') return <Screen>
    <Text style={[styles.eyebrow, { color: colors.primary }]}>SESSION COMPLETE</Text><Text style={[styles.title, { color: colors.foreground }]}>Results</Text>
    <View style={[styles.result, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.big, { color: colors.foreground }]}>{correct}/{questions.length}</Text><Text style={{ color: colors.mutedForeground }}>{Math.round(correct / Math.max(questions.length, 1) * 100)}% accuracy</Text></View>
     {questions.map((item, index) => <View key={item.id} style={styles.review}><Text style={{ color: colors.foreground }}>{index + 1}. {answers[index] ? 'Correct' : 'Wrong / unanswered'} · {item.prompt}</Text><Text style={{ color: colors.mutedForeground }}>{item.explanation} · {sourceCitation(content, item.sourceId, item.sourcePage)}</Text></View>)}
    <Text style={{ color: colors.mutedForeground }}>Incorrect answers remain in Missed for later review; completed attempts are saved locally.</Text>
    <Pressable onPress={start} style={[styles.primary, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Retry module</Text></Pressable>
    <Pressable onPress={() => router.replace('/(tabs)')} style={styles.link}><Text style={{ color: colors.primary, fontWeight: '700' }}>Return to Study</Text></Pressable>
  </Screen>;
  return <Screen>
    <Text style={[styles.eyebrow, { color: colors.primary }]}>QUESTION {position + 1} OF {questions.length}</Text><Text style={[styles.title, { color: colors.foreground }]}>{q.prompt}</Text>
    <Pressable accessibilityLabel="Save and exit practice" onPress={() => setPhase('setup')}><Text style={{ color: colors.primary }}>Save & exit</Text></Pressable>
    <QuestionInput question={q} value={answer} setValue={setAnswer} disabled={submitted} colors={colors} reduceMotion={reduceMotion} hapticsEnabled={study.preferences.haptics} />
     {submitted && <View style={[styles.feedback, { backgroundColor: currentCorrect ? colors.secondary : colors.card, borderColor: colors.border }]}><Text style={{ color: colors.foreground, fontWeight: '700' }}>{currentCorrect ? '✓ Correct' : '✕ Review this one'}</Text>{!currentCorrect && <Text style={{ color: colors.foreground, fontWeight: '600' }}>Correct answer: {correctAnswerText(q)}</Text>}<Text style={{ color: colors.mutedForeground }}>{q.explanation}</Text><Text style={{ color: colors.mutedForeground }}>Source: {sourceCitation(content, q.sourceId, q.sourcePage)}</Text></View>}
    <AnimatedAnswerPressable
      testID="submit-answer"
      onPress={submit}
      disabled={submitted || answer === '' || (Array.isArray(answer) && answer.length === 0)}
      feedback={submitted ? (currentCorrect ? 'correct' : 'incorrect') : undefined}
      reduceMotion={reduceMotion}
      accessibilityLabel={submitted ? (currentCorrect ? 'Correct answer submitted' : 'Incorrect answer submitted') : 'Submit answer'}
      containerStyle={styles.primary}
      contentStyle={[styles.primaryContent, { backgroundColor: submitted ? (currentCorrect ? colors.success : colors.destructive) : answer === '' || (Array.isArray(answer) && answer.length === 0) ? colors.muted : colors.primary }]}
    ><Text style={{ color: submitted ? (currentCorrect ? colors.successForeground : colors.destructiveForeground) : colors.primaryForeground, fontWeight: '700' }}>{submitted ? (currentCorrect ? '✓ Correct' : '✕ Incorrect') : 'Submit answer'}</Text></AnimatedAnswerPressable>
    {submitted && <AnimatedAnswerPressable testID="next-answer" onPress={next} onPressIn={() => selectionHaptic(study.preferences.haptics)} reduceMotion={reduceMotion} containerStyle={styles.primary} contentStyle={[styles.primaryContent, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>{position + 1 === questions.length ? 'See results' : 'Next question'}</Text></AnimatedAnswerPressable>}
  </Screen>;
}

function QuestionInput({ question, value, setValue, disabled, colors, reduceMotion, hapticsEnabled }: { question: Question; value: string | string[]; setValue: (v: string | string[]) => void; disabled: boolean; colors: any; reduceMotion: boolean; hapticsEnabled: boolean }) {
  const asset = question.assetId ? content.assets.find((item) => item.id === question.assetId) : undefined;
  const image = asset ? <AnatomyImageViewer source={imageSources[asset.id]} hotspots={question.taskType === 'image-identification' ? [] : question.hotspots ?? asset.hotspots} labels={(disabled || question.taskType === 'image-identification') ? asset.labels?.filter((label) => question.structureIds.includes(label.structureId)) : []} revealLabels={disabled} bakedLabels={asset.labelStatus === 'labeled'} imageAspectRatio={asset.imageAspectRatio} caption={disabled ? asset.title : undefined} onHotspotPress={question.taskType === 'image-identification' ? undefined : (hotspot) => { selectionHaptic(hapticsEnabled); setValue(hotspot.structureId); }} selectedHotspotId={typeof value === 'string' ? value : undefined} correctHotspotId={question.structureIds[0]} submitted={disabled} reduceMotion={reduceMotion} /> : null;
  if (question.taskType === 'hotspot') return <View style={{ gap: 10 }}>{image}<Text style={{ color: colors.mutedForeground }}>Tap the marked structure.</Text></View>;
  if (question.taskType === 'typed-recall' || question.taskType === 'image-identification') return <View style={{ gap: 10 }}>{image}<TextInput testID="typed-answer" accessibilityLabel={disabled ? `${answerIsCorrect(value, question) ? 'Correct' : 'Incorrect'} typed answer` : 'Image identification answer'} value={typeof value === 'string' ? value : ''} onChangeText={setValue} editable={!disabled} onSubmitEditing={Keyboard.dismiss} placeholder="Type your answer" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: disabled ? (answerIsCorrect(value, question) ? colors.success : colors.destructive) : colors.border, backgroundColor: colors.card }]} returnKeyType="done" /></View>;
  const options = question.options ?? (question.answer as string[]);
  if (question.taskType === 'ordered-sequence') {
    const selected = Array.isArray(value) ? value : [];
    const move = (index: number, delta: number) => { const next = [...selected]; const target = index + delta; if (target >= 0 && target < next.length) [next[index], next[target]] = [next[target], next[index]]; setValue(next); };
    return <View style={{ gap: 10 }}>{image}<View style={styles.options}>{options.map((option) => {
      const index = selected.indexOf(option);
      const expected = question.answer as string[];
      const feedback: AnswerFeedback | undefined = disabled ? (index >= 0 && expected[index] === option ? 'correct' : 'incorrect') : undefined;
      return <View key={option} style={styles.orderRow}>
        <AnimatedAnswerPressable disabled={disabled} onPressIn={() => selectionHaptic(hapticsEnabled)} onPress={() => setValue(index >= 0 ? selected.filter((x) => x !== option) : [...selected, option])} feedback={feedback} reduceMotion={reduceMotion} accessibilityLabel={`${option}${feedback === 'correct' ? ', correct position' : feedback === 'incorrect' ? `, incorrect position, correct position ${expected.indexOf(option) + 1}` : ''}`} accessibilityState={{ selected: index >= 0 }} containerStyle={{ flex: 1 }} contentStyle={[styles.option, { borderColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : index >= 0 ? colors.primary : colors.border, backgroundColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : index >= 0 ? colors.secondary : colors.card }]}>
          <Text style={{ color: feedback ? (feedback === 'correct' ? colors.successForeground : colors.destructiveForeground) : colors.foreground }}>{feedback === 'correct' ? '✓ ' : feedback === 'incorrect' ? '✕ ' : ''}{index >= 0 ? `${index + 1}. ` : ''}{option}</Text>
        </AnimatedAnswerPressable>
        {index >= 0 && !disabled && <><Pressable accessibilityLabel={`Move ${option} up`} onPress={() => { selectionHaptic(hapticsEnabled); move(index, -1); }}><Text style={{ color: colors.primary }}>↑</Text></Pressable><Pressable accessibilityLabel={`Move ${option} down`} onPress={() => { selectionHaptic(hapticsEnabled); move(index, 1); }}><Text style={{ color: colors.primary }}>↓</Text></Pressable></>}
      </View>;
    })}</View></View>;
  }
  const selected = Array.isArray(value) ? value : [];
  const expected = Array.isArray(question.answer) ? question.answer : [question.answer];
  return <View style={{ gap: 10 }}>{image}<View style={styles.options}>{options.map((option) => {
    const active = question.taskType === 'select-all' ? selected.includes(option) : value === option;
    const feedback: AnswerFeedback | undefined = disabled
      ? expected.includes(option) ? 'correct' : active ? 'incorrect' : undefined
      : undefined;
    return <AnimatedAnswerPressable key={option} disabled={disabled} onPressIn={() => selectionHaptic(hapticsEnabled)} onPress={() => setValue(question.taskType === 'select-all' ? (active ? selected.filter((x) => x !== option) : [...selected, option]) : option)} feedback={feedback} reduceMotion={reduceMotion} accessibilityLabel={`${option}${feedback === 'correct' ? ', correct answer' : feedback === 'incorrect' ? ', incorrect selection' : ''}`} accessibilityState={{ selected: active }} contentStyle={[styles.option, { borderColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : active ? colors.primary : colors.border, backgroundColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : active ? colors.secondary : colors.card }]}>
      <Text style={{ color: feedback ? (feedback === 'correct' ? colors.successForeground : colors.destructiveForeground) : colors.foreground }}>{feedback === 'correct' ? '✓ ' : feedback === 'incorrect' ? '✕ ' : active ? '✓ ' : ''}{option}</Text>
    </AnimatedAnswerPressable>;
  })}</View></View>;
}
const styles = StyleSheet.create({ eyebrow:{fontSize:11,letterSpacing:1.5,fontWeight:'700'},title:{fontSize:27,fontWeight:'700'},intro:{fontSize:15,lineHeight:22},panel:{borderWidth:1,borderRadius:16,padding:16,gap:16},focus:{borderWidth:1,borderRadius:14,padding:14,gap:9},panelTitle:{fontSize:17,fontWeight:'700'},counts:{gap:8},count:{borderWidth:1,borderRadius:10,padding:13},primary:{minHeight:48,borderRadius:12},primaryContent:{minHeight:48,borderRadius:12,alignItems:'center',justifyContent:'center',paddingHorizontal:16},secondary:{minHeight:40,borderWidth:1,borderRadius:10,alignItems:'center',justifyContent:'center',paddingHorizontal:12},note:{fontSize:13,lineHeight:20},options:{gap:10},orderRow:{flexDirection:'row',alignItems:'center',gap:8},option:{borderWidth:1,borderRadius:12,padding:15,minHeight:48,justifyContent:'center'},input:{borderWidth:2,borderRadius:12,padding:14,fontSize:16,minHeight:50},feedback:{borderWidth:1,borderRadius:14,padding:15,gap:8},result:{borderWidth:1,borderRadius:16,padding:22,alignItems:'center',gap:8},review:{borderBottomWidth:1,paddingVertical:10,gap:4},big:{fontSize:40,fontWeight:'700'},link:{alignItems:'center',padding:12} });