import type { VocabularyItem, ItemType } from '../types';

export function parseVocabularyCSV(csvText: string): Omit<VocabularyItem, 'id' | 'is_mastered'>[] {
  const lines = csvText.split('\n');
  const result: Omit<VocabularyItem, 'id' | 'is_mastered'>[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('word,') || line.startsWith('単語,')) continue;

    const cols = line.split(',').map(c => c.trim().replace(/^"(.*)"$/, '$1'));
    if (cols.length >= 2) {
      const rawType = cols[2]?.toLowerCase();
      const typeVal: ItemType = (rawType === 'phrase' || rawType === 'idiom' || cols[2] === '熟語') ? 'phrase' : 'word';
      
      result.push({
        word: cols[0],
        meaning: cols[1],
        type: typeVal,
        example_sentence: cols[3] || '',
        example_translation: cols[4] || ''
      });
    }
  }

  return result;
}