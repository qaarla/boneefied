import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { content } from '@/content/canonical';
import { answerIsCorrect } from '@/content/study';
import type { Question, PracticeSession } from '@/content/model';
import { useStudy } from '@/context/StudyContext';
import { useColors } from '@/hooks/useColors';
import { sourceCitation } from '@/content/sources';

type Phase = 'setup' | 'quiz' | 'results';
const supported = new Set(['multiple-choice', 'typed-recall', 'ordered-sequence', 'select-all', 'bone-laterality', 'function-relationship']);

export default function PracticeScreen() {
  const colors = useColors(); const router = useRouter(); const study = useStudy();
  const { moduleId: requestedModuleId } = useLocalSearchParams<{ moduleId?: string }>();
  const [selectedModuleId, setSelectedModuleId] = useState(requestedModuleId ?? 'cytology-mitosis');
  const pool = useMemo(() => content.questions.filter((q) => q.moduleId === selectedModuleId && supported.has(q.taskType)), [selectedModuleId]);
  const [phase, setPhase] = useState<Phase>('setup'); const [count, setCount] = useState(Math.min(5, pool.length));
  const [questions, setQuestions] = useState<Question[]>([]); const [position, setPosition] = useState(0);
  const [answer, setAnswer] = useState<string | string[]>(''); const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(0); const [answers, setAnswers] = useState<boolean[]>([]); const [currentCorrect, setCurrentCorrect] = useState(false); const [sessionId, setSessionId] = useState('');
  const activeSession = study.sessions.find((session) => session.status !== 'completed' && session.moduleId === selectedModuleId);
  useEffect(() => {
    if (activeSession && phase === 'setup') {
      const resumed = activeSession.questionIds.map((id) => content.questions.find((item) => item.id === id)).filter((item): item is Question => !!item);
      if (resumed.length) { setSessionId(activeSession.id); setQuestions(resumed); setPosition(Math.min(activeSession.position, resumed.length - 1)); setAnswers(activeSession.answers.map((item) => item.outcome === 'correct')); setCorrect(activeSession.answers.filter((item) => item.outcome === 'correct').length); setPhase('quiz'); }
    }
  }, [activeSession?.id]);
  const start = () => { const selected = pool.slice(0, Math.max(1, Math.min(count, pool.length))); const now = new Date().toISOString(); const session: PracticeSession = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, moduleId: selectedModuleId, mode: 'practice', entryPoint: 'practice', questionIds: selected.map((item) => item.id), position: 0, answers: [], startedAt: now, updatedAt: now, status: 'active' }; study.saveSession(session); setSessionId(session.id); setQuestions(selected); setPhase('quiz'); setPosition(0); setCorrect(0); setAnswers([]); setAnswer(''); setSubmitted(false); setCurrentCorrect(false); };
  const q = questions[position];
  const submit = () => {
    if (submitted || !q) return;
    const isCorrect = answerIsCorrect(answer, q); setCurrentCorrect(isCorrect); setSubmitted(true); setAnswers((items) => [...items, isCorrect]); if (isCorrect) setCorrect((n) => n + 1);
    study.submitSessionAnswer(sessionId, { questionId: q.id, answer, outcome: isCorrect ? 'correct' : 'wrong', submittedAt: new Date().toISOString() }, { questionId: q.id, structureId: q.structureIds[0], correct: isCorrect, answer });
  };
  const next = () => { if (!submitted) return; if (position + 1 >= questions.length) { study.completeSession(sessionId); setPhase('results'); } else { setPosition((n) => n + 1); setAnswer(''); setSubmitted(false); setCurrentCorrect(false); } };
  if (phase === 'setup') return <Screen>
     <Text style={[styles.eyebrow, { color: colors.primary }]}>PRACTICE</Text><Text style={[styles.title, { color: colors.foreground }]}>{content.modules.find((item) => item.id === selectedModuleId)?.title ?? 'Anatomy practice'}</Text>
     <Text style={[styles.intro, { color: colors.mutedForeground }]}>Practice uses the same source-linked structures and explanations as Study. Image questions appear only when answer mapping is verified.</Text>
    <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.panelTitle, { color: colors.foreground }]}>Session setup</Text>
       {content.modules.filter((item) => item.published).length > 1 && <View style={styles.counts}>{content.modules.filter((item) => item.published).map((item) => <Pressable key={item.id} onPress={() => { setSelectedModuleId(item.id); setPhase('setup'); }} style={[styles.count, { borderColor: selectedModuleId === item.id ? colors.primary : colors.border, backgroundColor: selectedModuleId === item.id ? colors.secondary : colors.card }]}><Text style={{ color: colors.foreground }}>{item.title}</Text></Pressable>)}</View>}
       <Text style={{ color: colors.mutedForeground }}>Eligible questions: {pool.length}. No duplicate padding.</Text>
      <View style={styles.counts}>{[3, 5, pool.length].filter((n, i, a) => n > 0 && a.indexOf(n) === i).map((n) => <Pressable key={n} onPress={() => setCount(Math.min(n, pool.length))} style={[styles.count, { borderColor: count === Math.min(n, pool.length) ? colors.primary : colors.border, backgroundColor: count === Math.min(n, pool.length) ? colors.secondary : colors.card }]}><Text style={{ color: colors.foreground }}>{n} questions</Text></Pressable>)}</View>
      {activeSession ? <Pressable testID="resume-practice" onPress={() => setPhase('quiz')} style={[styles.primary, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Resume saved session</Text></Pressable> : <Pressable testID="start-practice" onPress={start} style={[styles.primary, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Start practice</Text></Pressable>}
    </View>
     <Text style={[styles.note, { color: colors.mutedForeground }]}>Supported here: multiple choice, typed recall, select-all, ordered sequence, bone laterality, and relationship questions.</Text>
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
    <QuestionInput question={q} value={answer} setValue={setAnswer} disabled={submitted} colors={colors} />
     {submitted && <View style={[styles.feedback, { backgroundColor: currentCorrect ? colors.secondary : colors.card, borderColor: colors.border }]}><Text style={{ color: colors.foreground, fontWeight: '700' }}>{currentCorrect ? 'Correct' : 'Review this one'}</Text><Text style={{ color: colors.mutedForeground }}>{q.explanation}</Text><Text style={{ color: colors.mutedForeground }}>Source: {sourceCitation(content, q.sourceId, q.sourcePage)}</Text></View>}
    {!submitted ? <Pressable testID="submit-answer" onPress={submit} disabled={answer === '' || (Array.isArray(answer) && answer.length === 0)} style={[styles.primary, { backgroundColor: answer === '' || (Array.isArray(answer) && answer.length === 0) ? colors.muted : colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Submit answer</Text></Pressable> : <Pressable testID="next-answer" onPress={next} style={[styles.primary, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>{position + 1 === questions.length ? 'See results' : 'Next question'}</Text></Pressable>}
  </Screen>;
}

function QuestionInput({ question, value, setValue, disabled, colors }: { question: Question; value: string | string[]; setValue: (v: string | string[]) => void; disabled: boolean; colors: any }) {
  if (question.taskType === 'typed-recall') return <TextInput testID="typed-answer" accessibilityLabel="Typed recall answer" value={typeof value === 'string' ? value : ''} onChangeText={setValue} editable={!disabled} onSubmitEditing={Keyboard.dismiss} placeholder="Type your answer" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} returnKeyType="done" />;
  const options = question.options ?? (question.answer as string[]);
  if (question.taskType === 'ordered-sequence') {
    const selected = Array.isArray(value) ? value : [];
    const move = (index: number, delta: number) => { const next = [...selected]; const target = index + delta; if (target >= 0 && target < next.length) [next[index], next[target]] = [next[target], next[index]]; setValue(next); };
    return <View style={styles.options}>{options.map((option) => {
      const index = selected.indexOf(option);
      return <View key={option} style={styles.orderRow}>
        <Pressable disabled={disabled} onPress={() => setValue(index >= 0 ? selected.filter((x) => x !== option) : [...selected, option])} style={[styles.option, { flex: 1, borderColor: index >= 0 ? colors.primary : colors.border, backgroundColor: index >= 0 ? colors.secondary : colors.card }]}>
          <Text style={{ color: colors.foreground }}>{index >= 0 ? `${index + 1}. ` : ''}{option}</Text>
        </Pressable>
        {index >= 0 && <><Pressable disabled={disabled} accessibilityLabel={`Move ${option} up`} onPress={() => move(index, -1)}><Text style={{ color: colors.primary }}>↑</Text></Pressable><Pressable disabled={disabled} accessibilityLabel={`Move ${option} down`} onPress={() => move(index, 1)}><Text style={{ color: colors.primary }}>↓</Text></Pressable></>}
      </View>;
    })}</View>;
  }
  const selected = Array.isArray(value) ? value : [];
  return <View style={styles.options}>{options.map((option) => { const active = question.taskType === 'select-all' ? selected.includes(option) : value === option; return <Pressable key={option} disabled={disabled} onPress={() => setValue(question.taskType === 'select-all' ? (active ? selected.filter((x) => x !== option) : [...selected, option]) : option)} style={[styles.option, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.secondary : colors.card }]}><Text style={{ color: colors.foreground }}>{active ? '✓ ' : ''}{option}</Text></Pressable>; })}</View>;
}
const styles = StyleSheet.create({ eyebrow:{fontSize:11,letterSpacing:1.5,fontWeight:'700'},title:{fontSize:27,fontWeight:'700'},intro:{fontSize:15,lineHeight:22},panel:{borderWidth:1,borderRadius:16,padding:16,gap:16},panelTitle:{fontSize:17,fontWeight:'700'},counts:{gap:8},count:{borderWidth:1,borderRadius:10,padding:13},primary:{minHeight:48,borderRadius:12,alignItems:'center',justifyContent:'center',paddingHorizontal:16},note:{fontSize:13,lineHeight:20},options:{gap:10},orderRow:{flexDirection:'row',alignItems:'center',gap:8},option:{borderWidth:1,borderRadius:12,padding:15,minHeight:48,justifyContent:'center'},input:{borderWidth:1,borderRadius:12,padding:14,fontSize:16,minHeight:50},feedback:{borderWidth:1,borderRadius:14,padding:15,gap:8},result:{borderWidth:1,borderRadius:16,padding:22,alignItems:'center',gap:8},review:{borderBottomWidth:1,paddingVertical:10,gap:4},big:{fontSize:40,fontWeight:'700'},link:{alignItems:'center',padding:12} });