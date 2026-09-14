export type ItemType = 'word' | 'phrase' | 'idiom';

export interface VocabularyItem {
  id: string | number;
  word: string;
  meaning: string;
  type: ItemType;
  is_mastered: boolean;
  is_weak?: boolean;
  example_sentence?: string;
  example_translation?: string;
}

export type QuizMode = 'all' | 'word' | 'phrase';