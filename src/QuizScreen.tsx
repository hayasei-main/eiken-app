import React, { useState } from 'react';
import type { VocabularyItem, QuizMode, QuizResult } from './types';

interface QuizScreenProps {
  items: VocabularyItem[];
  mode: QuizMode;
  onUpdateMastery: (id: string, isMastered: boolean) => void;
  onFinish: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  items,
  mode,
  onUpdateMastery,
  onFinish,
}) => {
  // 出題対象のフィルタリング
  const quizItems = React.useMemo(() => {
    let filtered = items;
    if (mode === 'word') filtered = items.filter((i) => i.type === 'word');
    if (mode === 'phrase') filtered = items.filter((i) => i.type === 'phrase');
    if (mode === 'weak') filtered = items.filter((i) => i.is_weak);
    return [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [items, mode]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  if (quizItems.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem', background: '#fff', borderRadius: '1rem' }}>
        <h2>該当する単語がありません</h2>
        <button onClick={onFinish} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
          ダッシュボードへ戻る
        </button>
      </div>
    );
  }

  const currentItem = quizItems[currentIndex];

  // 選択肢の生成（現在の正解 + ランダムな他3つの意味）
  const choices = React.useMemo(() => {
    if (!currentItem) return [];
    const otherMeanings = items
      .filter((i) => i.id !== currentItem.id)
      .map((i) => i.meaning);
    const shuffledOthers = [...otherMeanings].sort(() => Math.random() - 0.5).slice(0, 3);
    return [...shuffledOthers, currentItem.meaning].sort(() => Math.random() - 0.5);
  }, [currentItem, items]);

  const handleSelectChoice = (choice: string) => {
    if (selectedAnswer !== null) return; // 回答済みなら選択不可

    const isCorrect = choice === currentItem.meaning;
    setSelectedAnswer(choice);

    // 正解・不正解に応じて自動ステータス更新
    onUpdateMastery(currentItem.id, isCorrect);

    // 履歴に追加
    setResults((prev) => [...prev, { item: currentItem, userAnswer: choice, isCorrect }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizItems.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  // --- テスト終了後の正誤一覧画面 ---
  if (isFinished) {
    const correctCount = results.filter((r) => r.isCorrect).length;
    return (
      <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1.5rem', background: '#fff', borderRadius: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'left' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#0f172a' }}>🎉 テスト結果</h2>
        <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1.5rem' }}>
          スコア: {correctCount} / {quizItems.length} 問正解 ({Math.round((correctCount / quizItems.length) * 100)}%)
        </p>

        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: '#475569' }}>解答一覧</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {results.map((res, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                background: res.isCorrect ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${res.isCorrect ? '#a7f3d0' : '#fecaca'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.125rem', color: '#0f172a', marginRight: '0.75rem' }}>
                  {res.item.word}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#475569' }}>({res.item.meaning})</span>
                {!res.isCorrect && (
                  <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>
                    あなたの回答: {res.userAnswer}
                  </div>
                )}
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: res.isCorrect ? '#059669' : '#dc2626' }}>
                {res.isCorrect ? '⭕️ 正解 (マスター済み)' : '❌ 不正解 (要復習)'}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onFinish}
          style={{ width: '100%', padding: '1rem', background: '#2563eb', color: '#fff', fontWeight: 800, borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
        >
          ダッシュボードへ戻る
        </button>
      </div>
    );
  }

  // --- 出題中の画面 ---
  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1.5rem', background: '#fff', borderRadius: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        <span>問題 {currentIndex + 1} / {quizItems.length}</span>
        <span>{currentItem.type === 'word' ? '英単語' : '英熟語'}</span>
      </div>

      <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1.5rem 0' }}>
        {currentItem.word}
      </h2>

      {/* 4択ボタン */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {choices.map((choice, idx) => {
          let btnBg = '#f8fafc';
          let btnBorder = '#e2e8f0';
          let btnColor = '#0f172a';

          if (selectedAnswer !== null) {
            if (choice === currentItem.meaning) {
              btnBg = '#d1fae5'; // 正解の緑
              btnBorder = '#10b981';
              btnColor = '#065f46';
            } else if (choice === selectedAnswer) {
              btnBg = '#fee2e2'; // 不正解の赤
              btnBorder = '#ef4444';
              btnColor = '#991b1b';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectChoice(choice)}
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                border: `2px solid ${btnBorder}`,
                background: btnBg,
                color: btnColor,
                fontWeight: 700,
                fontSize: '1rem',
                textAlign: 'left',
                cursor: selectedAnswer === null ? 'pointer' : 'default',
                transition: 'all 0.2s'
              }}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {/* 回答後の解説・次へボタン */}
      {selectedAnswer !== null && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 900, color: selectedAnswer === currentItem.meaning ? '#059669' : '#dc2626', marginBottom: '0.5rem' }}>
            {selectedAnswer === currentItem.meaning ? '⭕️ 正解！ (マスター済みに登録)' : '❌ 不正解... (要復習に登録)'}
          </div>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#475569' }}>
            正解: <strong>{currentItem.meaning}</strong>
          </p>
          <button
            onClick={handleNext}
            style={{ width: '100%', padding: '0.875rem', background: '#2563eb', color: '#fff', fontWeight: 800, borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
          >
            {currentIndex + 1 < quizItems.length ? '次の問題へ ➔' : '結果を見る ➔'}
          </button>
        </div>
      )}
    </div>
  );
};