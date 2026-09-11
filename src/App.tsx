import React, { useState, useEffect } from 'react';
import { MOCK_WORDS } from './mockData';
import { 
  fetchWordsFromCloud, 
  addWordToCloud, 
  updateWordInCloud, 
  deleteWordFromCloud 
} from './supabaseClient';

// 型定義を App.tsx 内で完結させる
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

export type FilterStatus = 'all' | 'weak' | 'mastered' | 'not_learned';
export type FilterItemType = 'all' | 'word' | 'idiom';

// 各画面コンポーネントのインポート
import { DashboardScreen } from './DashboardScreen';
import { QuizScreen } from './QuizScreen';
import { WordListScreen } from './WordListScreen';
import { AdminManageScreen } from './AdminManageScreen';

type TabType = 'dashboard' | 'quiz' | 'list' | 'admin';

export const App: React.FC = () => {
  const [words, setWords] = useState<WordWithStatus[]>(MOCK_WORDS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [quizFilter, setQuizFilter] = useState<FilterItemType>('all');
  const [listInitialFilter, setListInitialFilter] = useState<FilterStatus>('all');

  // 1. 起動時にSupabaseから単語一覧を取得
  useEffect(() => {
    const loadCloudData = async () => {
      setIsLoading(true);
      const cloudWords = await fetchWordsFromCloud();
      if (cloudWords && cloudWords.length > 0) {
        setWords(cloudWords as WordWithStatus[]);
      }
      setIsLoading(false);
    };
    loadCloudData();
  }, []);

  // 2. 画面遷移
  const handleStartQuiz = (options: { itemType: FilterItemType }) => {
    setQuizFilter(options.itemType);
    setActiveTab('quiz');
  };

  const handleNavigateToList = (filter: FilterStatus) => {
    setListInitialFilter(filter);
    setActiveTab('list');
  };

  // 3. クラウド操作ハンドラー
  const handleAddWord = async (newWord: Omit<WordWithStatus, 'id'>) => {
    const savedWord = await addWordToCloud(newWord);
    if (savedWord) {
      setWords((prev) => [savedWord, ...prev]);
    }
  };

  const handleUpdateWord = async (id: number, updatedData: Partial<WordWithStatus>) => {
    const updated = await updateWordInCloud(id, updatedData);
    if (updated) {
      setWords((prev) => prev.map((w) => (w.id === id ? { ...w, ...updated } : w)));
    }
  };

  const handleDeleteWord = async (id: number) => {
    const success = await deleteWordFromCloud(id);
    if (success) {
      setWords((prev) => prev.filter((w) => w.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
        単語データを読み込み中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
              E
            </span>
            <div>
              <span className="font-extrabold text-base text-gray-900 block leading-tight">
                英検準2級 単語テスト
              </span>
              <span className="text-[10px] text-gray-400 block font-medium">クラウド同期版</span>
            </div>
          </div>

          <nav className="flex gap-1 sm:gap-2">
            {[
              { id: 'dashboard', label: 'ホーム' },
              { id: 'quiz', label: 'テスト' },
              { id: 'list', label: '単語一覧' },
              { id: 'admin', label: 'データ管理' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'list') setListInitialFilter('all');
                  setActiveTab(tab.id as TabType);
                }}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 pb-12">
        {activeTab === 'dashboard' && (
          <DashboardScreen
            words={words}
            onStartQuiz={handleStartQuiz}
            onNavigateToList={handleNavigateToList}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizScreen
            key={`quiz-${quizFilter}-${Date.now()}`}
            words={words}
            initialItemType={quizFilter}
            onWordsChange={setWords}
            onFinish={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'list' && (
          <WordListScreen words={words} initialFilter={listInitialFilter} />
        )}

        {activeTab === 'admin' && (
          <AdminManageScreen
            initialWords={words}
            onAddWord={handleAddWord}
            onUpdateWord={handleUpdateWord}
            onDeleteWord={handleDeleteWord}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        英検準2級 英単語・熟語テストアプリ &copy; 2026
      </footer>
    </div>
  );
};

export default App;