import React, { useState } from 'react';
import type { VocabularyItem, QuizMode } from './types';
import { QuizScreen } from './QuizScreen';
import { WordListScreen } from './WordListScreen';
import { parseVocabularyCSV } from './utils/csvImporter';

const initialItems: VocabularyItem[] = [
  { id: '1', word: 'abandon', meaning: '〜を捨てる', type: 'word', is_mastered: false },
  { id: '2', word: 'abundant', meaning: '豊富な', type: 'word', is_mastered: true },
  { id: '3', word: 'look after', meaning: '〜の世話をする', type: 'phrase', is_mastered: false },
  { id: '4', word: 'run out of', meaning: '〜を使い果たす', type: 'phrase', is_mastered: false },
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
        is_mastered: false
      }));

      setItems(prev => [...prev, ...newItems]);
      alert(`${newItems.length}件のデータをインポートしました！`);
    };
    reader.readAsText(file);
  };

  const handleUpdateMastery = (id: string | number, isMastered: boolean) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, is_mastered: isMastered } : item))
    );
  };

  const totalCount = items.length;
  const masteredCount = items.filter(i => i.is_mastered).length;
  const masterRate = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h1>英検準2級 学習アプリ</h1>

      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
        <h3>学習進捗状況</h3>
        <p>全データ数: {totalCount} 件（マスター済み: {masteredCount} 件 / 要復習: {totalCount - masteredCount} 件）</p>
        
        <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '16px', overflow: 'hidden', margin: '0.75rem 0' }}>
          <div style={{ width: `${masterRate}%`, background: '#22c55e', height: '100%', transition: 'width 0.3s' }} />
        </div>
        <p style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>マスター率: {masterRate}%</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => { setListFilter('all'); setCurrentView('list'); }}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' }}
        >
          全単語一覧 ({totalCount})
        </button>
        <button
          onClick={() => { setListFilter('weak'); setCurrentView('list'); }}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #fca5a5', backgroundColor: '#fef2f2', color: '#991b1b', cursor: 'pointer' }}
        >
          要復習 ({totalCount - masteredCount})
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>出題対象を選択：</label>
        <select
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value as QuizMode)}
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', borderRadius: '6px' }}
        >
          <option value="all">すべて（単語 + 熟語）</option>
          <option value="word">単語のみ</option>
          <option value="phrase">熟語のみ</option>
        </select>
      </div>

      <button
        onClick={() => setCurrentView('quiz')}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        今すぐテストを開始（ランダム10問）
      </button>

      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
        <h3>CSVデータから一括登録</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          フォーマット例: <code>単語,意味,wordまたはphrase,例文,例文訳</code>
        </p>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
    </div>
  );
}

export default App;