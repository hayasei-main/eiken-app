// 修正前: example_sentence: cols[3]
// 修正後:
export function parseVocabularyCSV(csvText: string) {
  const lines = csvText.split('\n');
  const items = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const cols = trimmed.split(',').map(c => c.trim());
    if (cols.length >= 2) {
      items.push({
        word: cols[0],
        meaning: cols[1],
        type: (cols[2] === 'phrase' ? 'phrase' : 'word') as 'word' | 'phrase',
        example_en: cols[3] || '',
        example_ja: cols[4] || ''
      });
    }
  }
  return items;
}