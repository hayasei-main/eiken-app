export type ItemType = 'word' | 'idiom';
export type LearningStatus = 'not_learned' | 'learning' | 'mastered';
export type FilterStatus = 'all' | 'weak' | 'mastered' | 'not_learned';
export type FilterItemType = 'all' | 'word' | 'idiom';

export interface WordWithStatus {
  id: number;
  term: string;
  meaning: string;
  item_type: ItemType;
  part_of_speech?: string;
  example_sentence?: string;
  example_meaning?: string;
  dummy_choices?: string[];
  status?: LearningStatus;
  consecutive_correct?: number;
  is_weak?: boolean;
}
