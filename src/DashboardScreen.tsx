import React from 'react';

export interface WordWithStatus {
  id: number;
  term: string;
  meaning: string;
  item_type: 'word' | 'idiom';
  status?: 'not_learned' | 'learning' | 'mastered';
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
    <div style={{ maxWidth: '896px', margin: '0 auto', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', boxSizing: 'border-box' }}>
      
      {/* 1. ヒーロー看板（青グラデーション） */}
      <div style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #3730a3 100%)',
        borderRadius: '1.5rem',
        padding: '2rem',
        color: '#ffffff',
        boxShadow: '0 12px 25px -5px rgba(37, 99, 235, 0.35)',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              fontSize: '0.75rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              fontWeight: 'bold',
              marginBottom: '0.75rem',
              color: '#ffffff'
            }}>
              英検準2級 対策コース
            </span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 0.5rem 0', color: '#ffffff', letterSpacing: '-0.02em' }}>
              合格を目指して学習を始めましょう！
            </h1>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#dbeaff' }}>
              クラウド同期対応：全{totalCount}単語・熟語を収録中
            </p>
          </div>
          <button
            onClick={() => onStartQuiz({ itemType: 'all' })}
            style={{
              background: '#fbbf24',
              color: '#0f172a',
              fontWeight: 900,
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.125rem',
              boxShadow: '0 8px 20px -4px rgba(251, 191, 36, 0.5)'
            }}
          >
            今すぐテストを開始 🚀
          </button>
        </div>

        {/* 進捗プログレスバー */}
        <div style={{ marginTop: '1.75rem', background: 'rgba(255, 255, 255, 0.15)', padding: '1rem 1.25rem', borderRadius: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <span>マスター率</span>
            <span>{progressPercent}% ({masteredCount}/{totalCount}語)</span>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', height: '12px', borderRadius: '9999px', overflow: 'hidden', marginTop: '0.5rem' }}>
            <div style={{ background: '#34d399', height: '100%', width: `${progressPercent}%`, borderRadius: '9999px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </div>

      {/* 2. 3列のモダンカード選択 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        <div
          onClick={() => onStartQuiz({ itemType: 'all' })}
          style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>🎯</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#0f172a' }}>総合テスト</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>単語と熟語をランダムにテスト</p>
          <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold', color: '#2563eb', marginTop: '1.25rem' }}>全 {totalCount} 問 &rarr;</span>
        </div>

        <div
          onClick={() => onStartQuiz({ itemType: 'word' })}
          style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>📖</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#0f172a' }}>英単語モード</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>頻出英単語に絞って集中学習</p>
          <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold', color: '#2563eb', marginTop: '1.25rem' }}>全 {wordCount} 語 &rarr;</span>
        </div>

        <div
          onClick={() => onStartQuiz({ itemType: 'idiom' })}
          style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>🔗</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#0f172a' }}>英熟語モード</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>重要な熟語・フレーズをマスター</p>
          <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold', color: '#2563eb', marginTop: '1.25rem' }}>全 {idiomCount} 語 &rarr;</span>
        </div>

      </div>

      {/* 3. 下部ステータスパネル */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        
        <div onClick={() => onNavigateToList('weak')} style={{ background: '#fef2f2', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #fecaca', cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#dc2626', display: 'block', marginBottom: '0.25rem' }}>要復習（苦手）</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#b91c1c' }}>
            {weakCount} <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>語</span>
          </span>
        </div>

        <div onClick={() => onNavigateToList('mastered')} style={{ background: '#ecfdf5', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #a7f3d0', cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#059669', display: 'block', marginBottom: '0.25rem' }}>マスター済み</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#047857' }}>
            {masteredCount} <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>語</span>
          </span>
        </div>

        <div onClick={() => onNavigateToList('all')} style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '0.25rem' }}>登録単語数</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e293b' }}>
            {totalCount} <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>語</span>
          </span>
        </div>

      </div>

    </div>
  );
};