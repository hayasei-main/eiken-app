import React, { useState } from 'react';

export interface WordWithStatus {
  id: number;
  term: string;
  meaning: string;
  item_type: 'word' | 'idiom';
  part_of_speech?: string;
  example_sentence?: string;
  example_meaning?: string;
  dummy_choices?: string[];
  status?: 'not_learned' | 'learning' | 'mastered';
  consecutive_correct?: number;
  is_weak?: boolean;
}

interface QuizScreenProps {
  words: WordWithStatus[];
  initialItemType?: 'all' | 'word' | 'idiom';
  onWordsChange: (words: WordWithStatus[]) => void;
  onFinish: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  words,
  initialItemType = 'all',
  onFinish,
}) => {
  // 該当する単語を抽出
  const quizWords = words.filter(
    (w) => initialItemType === 'all' || w.item_type === initialItemType
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (quizWords.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-3xl mt-8 shadow-sm">
        <p className="text-gray-600 font-bold mb-4">テスト対象の単語が登録されていません。</p>
        <button
          onClick={onFinish}
          className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl"
        >
          ホームへ戻る
        </button>
      </div>
    );
  }

  const currentWord = quizWords[currentIndex];

  // 選択肢の作成（正解 + ダミー選択肢）
  const choices = [
    currentWord.meaning,
    ...(currentWord.dummy_choices || ['を避ける', 'を拒否する', 'を想像する']),
  ].slice(0, 4);

  const handleSelect = (choice: string) => {
    if (selectedAnswer !== null) return; // 回答済みならスキップ

    setSelectedAnswer(choice);
    const correct = choice === currentWord.meaning;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizWords.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-3xl mt-8 shadow-lg space-y-6">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-black text-gray-900">テスト完了！</h2>
        <p className="text-xl font-bold text-gray-700">
          スコア: <span className="text-blue-600 text-3xl">{score}</span> / {quizWords.length}
        </p>
        <button
          onClick={onFinish}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-md transition"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* 進捗 */}
      <div className="flex justify-between items-center text-xs font-bold text-gray-400">
        <span>問題 {currentIndex + 1} / {quizWords.length}</span>
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          {currentWord.item_type === 'word' ? '英単語' : '英熟語'}
        </span>
      </div>

      {/* 問題カード */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900">{currentWord.term}</h2>
        {currentWord.part_of_speech && (
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-md font-bold">
            {currentWord.part_of_speech}
          </span>
        )}
      </div>

      {/* 4択選択肢 */}
      <div className="space-y-3">
        {choices.map((choice, idx) => {
          let btnStyle = "bg-white text-gray-800 hover:bg-gray-50 border-gray-200";

          if (selectedAnswer !== null) {
            if (choice === currentWord.meaning) {
              btnStyle = "bg-emerald-500 text-white border-emerald-500 font-bold";
            } else if (choice === selectedAnswer) {
              btnStyle = "bg-red-500 text-white border-red-500 font-bold";
            } else {
              btnStyle = "bg-gray-100 text-gray-400 border-gray-100";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(choice)}
              className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition flex justify-between items-center ${btnStyle}`}
            >
              <span>{choice}</span>
              {selectedAnswer !== null && choice === currentWord.meaning && <span>◯</span>}
              {selectedAnswer !== null && choice === selectedAnswer && choice !== currentWord.meaning && <span>✕</span>}
            </button>
          );
        })}
      </div>

      {/* 次へボタン */}
      {selectedAnswer !== null && (
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition"
        >
          {currentIndex + 1 < quizWords.length ? '次の問題へ ➔' : '結果を見る'}
        </button>
      )}
    </div>
  );
};