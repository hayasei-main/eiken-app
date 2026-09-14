import React from 'react';
import type { VocabularyItem } from './types';

interface WordListScreenProps {
  words: VocabularyItem[];
  initialFilter: string;
  onBack: () => void;
  onDelete?: (id: string) => void;
}

export const WordListScreen: React.FC<WordListScreenProps> = ({
  words,
  initialFilter,
  onBack,
  onDelete,
}) => {
  const [filter, setFilter] = React.useState<string>(initialFilter);

  const filteredWords = words.filter((item) => {
    if (filter === 'weak') return item.is_weak;
    if (filter === 'mastered') return item.is_mastered;
    return true;
  });

  return (
    <div style={{ maxWidth: '896px', margin: '0 auto', padding: '2rem 1rem', textAlign: 'left' }}>
      <button
        onClick={onBack}
        style={{ marginBottom: '1.5rem', background: '#e2e8f0', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
      >
        ← ダッシュボードへ戻る
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>単語・熟語 一覧画面</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
        >
          <option value="all">すべて表示 ({words.length})</option>
          <option value="weak">要復習 ({words.filter(w => w.is_weak).length})</option>
          <option value="mastered">マスター済み ({words.filter(w => w.is_mastered).length})</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredWords.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '1rem 1.25rem',
              background: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>
                {item.word}
                <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', padding: '0.2rem 0.5rem', background: '#f1f5f9', borderRadius: '4px', color: '#64748b' }}>
                  {item.type === 'word' ? '単語' : '熟語'}
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.25rem' }}>{item.meaning}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: item.is_mastered ? '#059669' : '#dc2626' }}>
                {item.is_mastered ? 'マスター済み' : '要復習'}
              </span>
              {onDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.3rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                >
                  削除
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};