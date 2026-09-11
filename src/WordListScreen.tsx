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

interface WordListScreenProps {
  words: WordWithStatus[];
  initialFilter?: string;
}

export const WordListScreen: React.FC<WordListScreenProps> = ({ words, initialFilter = 'all' }) => {
  const [filter, setFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredWords = words.filter((w) => {
    // ステータスフィルター
    if (filter === 'weak' && !w.is_weak) return false;
    if (filter === 'mastered' && w.status !== 'mastered') return false;
    if (filter === 'not_learned' && w.status === 'mastered') return false;

    // 検索キーワード
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return w.term.toLowerCase().includes(q) || w.meaning.includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">単語・熟語一覧</h1>
          <p className="text-xs text-gray-500 mt-1">全 {filteredWords.length} 件を表示中</p>
        </div>

        {/* 検索バー */}
        <input
          type="text"
          placeholder="単語や意味で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* フィルターボタン */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'すべて' },
          { id: 'weak', label: '要復習（苦手）' },
          { id: 'mastered', label: 'マスター済み' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              filter === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 単語カードリスト */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.map((word, index) => (
          <div
            // indexを組み合わせることでID重複による警告を防止
            key={`${word.id}-${index}`}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  word.item_type === 'word' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                }`}>
                  {word.item_type === 'word' ? '英単語' : '英熟語'}
                </span>
                {word.is_weak && (
                  <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-md">
                    要復習
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-gray-900">{word.term}</h3>
              <p className="text-sm font-bold text-gray-600 mt-1">{word.meaning}</p>
            </div>

            {word.example_sentence && (
              <div className="mt-4 pt-3 border-t border-gray-50 bg-gray-50/50 p-3 rounded-xl text-xs space-y-1">
                <p className="font-medium text-gray-700">{word.example_sentence}</p>
                {word.example_meaning && <p className="text-gray-400">{word.example_meaning}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};