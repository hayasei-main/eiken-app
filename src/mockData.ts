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

export const MOCK_WORDS: WordWithStatus[] = [
  { id: 1, term: 'achieve', meaning: 'を達成する', item_type: 'word', part_of_speech: '動詞', example_sentence: 'She achieved her goal.', example_meaning: '彼女は目標を達成した。', dummy_choices: ['を避ける', 'を拒否する', 'を想像する'] },
  { id: 2, term: 'accept', meaning: 'を受け入れる', item_type: 'word', part_of_speech: '動詞', example_sentence: 'He accepted the offer.', example_meaning: '彼はそのオファーを受け入れた。', dummy_choices: ['を批判する', 'を断る', 'を無視する'] },
  { id: 3, term: 'look forward to', meaning: 'を楽しみに待つ', item_type: 'idiom', part_of_speech: '熟語', example_sentence: 'I am looking forward to seeing you.', example_meaning: 'あなたに会えるのを楽しみにしています。', dummy_choices: ['を心配する', 'を思い出す', 'をあきらめる'] },
  { id: 4, term: 'take care of', meaning: 'の世話をする', item_type: 'idiom', part_of_speech: '熟語', example_sentence: 'Please take care of my dog.', example_meaning: '私の犬の世話をお願いします。', dummy_choices: ['を調べる', 'を捨てる', 'を探す'] },
];
