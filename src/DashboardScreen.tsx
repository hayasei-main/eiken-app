import React from 'react';

// 型定義を内部に直接保持してエラーを防止
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

interface DashboardScreenProps {
  words: WordWithStatus[];
  onStartQuiz: (options: { itemType: 'all' | 'word' | 'idiom' }) => void;
  onNavigateToList: (filter: 'all' | 'weak' | 'mastered' | 'not_learned') => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  words,
  onStartQuiz,
  onNavigateToList,
}) => {
  const totalCount = words.length;
  const wordCount = words.filter((w) => w.item_type === 'word').length;
  const idiomCount = words.filter((w) => w.item_type === 'idiom').length;
  const masteredCount = words.filter((w) => w.status === 'mastered').length;
  const weakCount = words.filter((w) => w.is_weak).length;

  const progressPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-block bg-white/20 backdrop-blur-md text-xs px-3 py-1 rounded-full font-bold mb-3">
              英検準2級 対策コース
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mb-2">合格を目指して学習を始めましょう！</h1>
            <p className="text-blue-100 text-sm">クラウド同期対応：全{totalCount}単語・熟語を収録中</p>
          </div>
          <button
            onClick={() => onStartQuiz({ itemType: 'all' })}
            className="w-full md:w-auto bg-amber-400 hover:bg-amber-300 text-gray-900 font-black px-8 py-4 rounded-2xl shadow-lg transition active:scale-95 text-center text-lg cursor-pointer"
          >
            今すぐテストを開始 🚀
          </button>
        </div>

        {/* 進捗バー */}
        <div className="mt-8 bg-white/10 p-4 rounded-2xl backdrop-blur-xs">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span>マスター率</span>
            <span>{progressPercent}% ({masteredCount}/{totalCount}語)</span>
          </div>
          <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 学習モード選択カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onStartQuiz({ itemType: 'all' })}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group"
        >
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-extrabold text-lg group-hover:text-blue-600 transition">総合テスト</h3>
          <p className="text-xs text-gray-500 mt-1">単語と熟語をランダムにテスト</p>
          <span className="inline-block text-xs font-bold text-blue-600 mt-4">全 {totalCount} 問 &rarr;</span>
        </div>

        <div
          onClick={() => onStartQuiz({ itemType: 'word' })}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group"
        >
          <div className="text-3xl mb-3">📖</div>
          <h3 className="font-extrabold text-lg group-hover:text-blue-600 transition">英単語モード</h3>
          <p className="text-xs text-gray-500 mt-1">頻出英単語に絞って集中学習</p>
          <span className="inline-block text-xs font-bold text-blue-600 mt-4">全 {wordCount} 語 &rarr;</span>
        </div>

        <div
          onClick={() => onStartQuiz({ itemType: 'idiom' })}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group"
        >
          <div className="text-3xl mb-3">🔗</div>
          <h3 className="font-extrabold text-lg group-hover:text-blue-600 transition">英熟語モード</h3>
          <p className="text-xs text-gray-500 mt-1">重要な熟語・フレーズをマスター</p>
          <span className="inline-block text-xs font-bold text-blue-600 mt-4">全 {idiomCount} 語 &rarr;</span>
        </div>
      </div>

      {/* ステータスショートカット */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateToList('weak')}
          className="bg-red-50 p-4 rounded-2xl border border-red-100 cursor-pointer hover:bg-red-100 transition"
        >
          <span className="text-xs font-bold text-red-600 block">要復習（苦手）</span>
          <span className="text-2xl font-black text-red-700">{weakCount} <span className="text-xs font-normal">語</span></span>
        </div>

        <div
          onClick={() => onNavigateToList('mastered')}
          className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition"
        >
          <span className="text-xs font-bold text-emerald-600 block">マスター済み</span>
          <span className="text-2xl font-black text-emerald-700">{masteredCount} <span className="text-xs font-normal">語</span></span>
        </div>

        <div
          onClick={() => onNavigateToList('all')}
          className="bg-gray-50 p-4 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition col-span-2 sm:col-span-1"
        >
          <span className="text-xs font-bold text-gray-600 block">登録単語数</span>
          <span className="text-2xl font-black text-gray-800">{totalCount} <span className="text-xs font-normal">語</span></span>
        </div>
      </div>
    </div>
  );
};