import React, { useState, useEffect } from 'react';
import type { VocabularyItem, QuizMode } from './types';
import { QuizScreen } from './QuizScreen';
import { DashboardScreen } from './DashboardScreen';
import { WordListScreen } from './WordListScreen';
import { parseVocabularyCSV } from './utils/csvImporter';

const STORAGE_KEY = 'eiken_app_vocabulary_v1';

const defaultItems: VocabularyItem[] = [
  { id: '1', word: 'abandon', meaning: '〜を捨てる', type: 'word', is_mastered: false, is_weak: true },
  { id: '2', word: 'abundant', meaning: '豊富な', type: 'word', is_mastered: true, is_weak: false },
  { id: '3', word: 'look after', meaning: '〜の世話をする', type: 'phrase', is_mastered: false, is_weak: true },
  { id: '4', word: 'run out of', meaning: '〜を使い果たす', type: 'phrase', is_mastered: false, is_weak: false },
];

export function App() {
  // localStorageから初期データ取得
  const [items, setItems] = useState<VocabularyItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse storage data', e);
      }
    }
    return defaultItems;
  });

  const [selectedMode, setSelectedMode] = useState<QuizMode>('all');
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'list'>('home');
  const [listFilter, setListFilter] = useState<string>('all');

  // データが更新されるたびに localStorage へ同期保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

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

      setItems((prev) => [...prev, ...newItems]);
      alert(`${newItems.length}件のデータをインポートしました！`);
    };
    reader.readAsText(file);
  };

  // マスター状態・要復習状態の更新
  const handleUpdateMastery = (id: string, isMastered: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_mastered: isMastered, is_weak: !isMastered } : item))
    );
  };

  // 単語削除機能
  const handleDeleteItem = (id: string) => {
    if (confirm('この単語を削除しますか？')) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const dashboardWords = items.map((item, idx) => ({
    id: typeof item.id === 'number' ? item.id : idx + 1,
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
        onDelete={handleDeleteItem}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '3rem' }}>
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
      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.5rem 0' }}>📁 CSVデータから一括登録</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
            フォーマット例: <code style={{ background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>単語,意味,wordまたはphrase,例文,例文訳</code>
          </p>
          <input type="file" accept=".csv" onChange={handleFileUpload} style={{ fontSize: '0.875rem' }} />
        </div>
      </div>
    </div>
  );
}

export default App;