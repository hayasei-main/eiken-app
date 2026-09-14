export type ItemType = 'word' | 'phrase';

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  type: ItemType;
  is_mastered: boolean;
  is_weak: boolean;
  example_en?: string;
  example_ja?: string;
}

export type QuizMode = 'all' | 'word' | 'phrase' | 'weak';

export interface QuizResult {
  item: VocabularyItem;
  userAnswer: string;
  isCorrect: boolean;
}