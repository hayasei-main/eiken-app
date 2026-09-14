import React, { useState } from 'react';
import type { VocabularyItem, QuizMode } from './types';
import { QuizScreen } from './QuizScreen';
import { DashboardScreen } from './DashboardScreen';
import { WordListScreen } from './WordListScreen';
import { parseVocabularyCSV } from './utils/csvImporter';

const initialItems: VocabularyItem[] = [
  { id: '1', word: 'abandon', meaning: '〜を捨てる', type: 'word', is_mastered: false, is_weak: true },
  { id: '2', word: 'abundant', meaning: '豊富な', type: 'word', is_mastered: true, is_weak: false },
  { id: '3', word: 'look after', meaning: '〜の世話をする', type: 'phrase', is_mastered: false, is_weak: true },
  { id: '4', word: 'run out of', meaning: '〜を使い果たす', type: 'phrase', is_mastered: false, is_weak: false },
];

export function App() {
  const [items, setItems] = useState<VocabularyItem[]>(initialItems);
  const [selectedMode, setSelectedMode] = useState<QuizMode>('all');
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'list'>('home');
  const [listFilter, setListFilter] = useState<string>('all');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseVocabularyCSV(text);
      const newItems: VocabularyItem[] = parsed.map((item, idx) => ({
        ...item,
        id: Date.now().toString() + idx,
        is_mastered: false,
        is_weak: true
      }));

      setItems(prev => [...prev, ...newItems]);
      alert(`${newItems.length}件のデータをインポートしました！`);
    };
    reader.readAsText(file);
  };

  const handleUpdateMastery = (id: string | number, isMastered: boolean) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, is_mastered: isMastered, is_weak: !isMastered } : item))
    );
  };

  // Dashboard用の形式変換
  const dashboardWords = items.map(item => ({
    id: typeof item.id === 'number' ? item.id : parseInt(item.id) || 0,
    term: item.word,
    meaning: item.meaning,
    item_type: item.type === 'word' ? ('word' as const) : ('idiom' as const),
    status: item.is_mastered ? ('mastered' as const) : ('learning' as const),
    is_weak: item.is_weak ?? !item.is_mastered
  }));

  if (currentView === 'quiz') {
    return (
      <QuizScreen
        items={items}
        mode={selectedMode}
        onUpdateMastery={handleUpdateMastery}
        onFinish={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'list') {
    return (
      <WordListScreen
        words={items}
        initialFilter={listFilter}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 綺麗デザインのダッシュボード */}
      <DashboardScreen
        words={dashboardWords}
        onStartQuiz={(options) => {
          setSelectedMode(options.itemType === 'idiom' ? 'phrase' : options.itemType);
          setCurrentView('quiz');
        }}
        onNavigateToList={(filter) => {
          setListFilter(filter);
          setCurrentView('list');
        }}
      />

      {/* CSVインポートエリア */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-lg text-gray-800 mb-2">📁 CSVデータから一括登録</h3>
          <p className="text-xs text-gray-500 mb-4">
            フォーマット例: <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">単語,意味,wordまたはphrase,例文,例文訳</code>
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default App;