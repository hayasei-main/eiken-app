import React, { useState } from 'react';
import type { VocabularyItem } from './types';

interface WordListScreenProps {
  words: VocabularyItem[];
  initialFilter?: string;
  onBack?: () => void;
}

export const WordListScreen: React.FC<WordListScreenProps> = ({ words, initialFilter = 'all', onBack }) => {
  const [filter, setFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredWords = words.filter((w) => {
    if (filter === 'weak' && w.is_mastered) return false;
    if (filter === 'mastered' && !w.is_mastered) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return w.word.toLowerCase().includes(q) || w.meaning.includes(q);
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>単語・熟語一覧</h1>
          <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>全 {filteredWords.length} 件を表示中</p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            ダッシュボードへ戻る
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="単語や意味で検索..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '1rem' }}
      />

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'all', label: 'すべて' },
          { id: 'weak', label: '要復習（苦手）' },
          { id: 'mastered', label: 'マスター済み' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: filter === tab.id ? '#2563eb' : '#fff',
              color: filter === tab.id ? '#fff' : '#000',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filteredWords.map((word, index) => (
          <div
            key={`${word.id}-${index}`}
            style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', backgroundColor: '#fff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: word.type === 'word' ? '#e0f2fe' : '#f3e8ff', color: word.type === 'word' ? '#0369a1' : '#6b21a8' }}>
                {word.type === 'word' ? '英単語' : '英熟語'}
              </span>
              <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: word.is_mastered ? '#dcfce7' : '#fee2e2', color: word.is_mastered ? '#15803d' : '#b91c1c' }}>
                {word.is_mastered ? 'マスター済み' : '要復習'}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0' }}>{word.word}</h3>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#4b5563' }}>{word.meaning}</p>

            {word.example_sentence && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f3f4f6', fontSize: '0.85rem' }}>
                <p style={{ margin: 0, color: '#374151' }}>{word.example_sentence}</p>
                {word.example_translation && <p style={{ margin: 0, color: '#9ca3af' }}>{word.example_translation}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};