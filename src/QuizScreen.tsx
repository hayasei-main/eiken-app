import React, { useState, useEffect } from 'react';
import type { VocabularyItem, QuizMode } from './types';

interface QuizScreenProps {
  items: VocabularyItem[];
  mode: QuizMode;
  onUpdateMastery: (id: string | number, isMastered: boolean) => void;
  onFinish: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ items, mode, onUpdateMastery, onFinish }) => {
  const [quizSet, setQuizSet] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let filtered = items;
    if (mode === 'word') filtered = items.filter(i => i.type === 'word');
    if (mode === 'phrase') filtered = items.filter(i => i.type === 'phrase' || i.type === 'idiom');

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setQuizSet(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setScore(0);
  }, [items, mode]);

  useEffect(() => {
    if (quizSet.length === 0 || currentIndex >= quizSet.length) return;

    const current = quizSet[currentIndex];
    const otherMeanings = items
      .filter(i => i.id !== current.id)
      .map(i => i.meaning)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const choices = [...otherMeanings, current.meaning].sort(() => 0.5 - Math.random());
    setOptions(choices);
    setSelectedAnswer(null);
  }, [currentIndex, quizSet, items]);

  if (quizSet.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>該当する問題がありません。</p>
        <button onClick={onFinish} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>戻る</button>
      </div>
    );
  }

  const currentItem = quizSet[currentIndex];

  const handleSelectOption = (option: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(option);
    const isCorrect = option === currentItem.meaning;
    onUpdateMastery(currentItem.id, isCorrect);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizSet.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const finalScore = score + (selectedAnswer === currentItem.meaning ? 1 : 0);
      alert(`テスト終了！ スコア: ${finalScore} / ${quizSet.length}`);
      onFinish();
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span>問題 {currentIndex + 1} / {quizSet.length}</span>
        <span>種別: {currentItem.type === 'word' ? '単語' : '熟語'}</span>
      </div>

      <div style={{ background: '#f4f4f5', padding: '2rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0 }}>{currentItem.word}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {options.map((option, idx) => {
          let btnColor = '#ffffff';
          if (selectedAnswer !== null) {
            if (option === currentItem.meaning) btnColor = '#dcfce7';
            else if (option === selectedAnswer) btnColor = '#fee2e2';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(option)}
              style={{
                padding: '1rem',
                fontSize: '1rem',
                backgroundColor: btnColor,
                border: '1px solid #ccc',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedAnswer !== null && (
        <button
          onClick={handleNext}
          style={{
            marginTop: '1.5rem',
            width: '100%',
            padding: '1rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          {currentIndex + 1 === quizSet.length ? '結果を見る' : '次の問題へ'}
        </button>
      )}
    </div>
  );
};