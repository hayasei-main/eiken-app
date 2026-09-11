import { createClient } from '@supabase/supabase-js';

// URL と Publishable Key を設定
const SUPABASE_URL = 'https://wuziqtjhrphoitqxaman.supabase.co';
const SUPABASE_KEY = 'sb_publishable_oZENee9Off0uzp5MYVMEvQ_LxpHcdQM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/** クラウドDBから単語一覧を取得する */
export async function fetchWordsFromCloud() {
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('単語取得エラー:', error);
    return [];
  }
  return data || [];
}

/** クラウドDBに新しい単語を追加する */
export async function addWordToCloud(newWord: any) {
  const { data, error } = await supabase
    .from('words')
    .insert([newWord])
    .select();

  if (error) {
    console.error('単語追加エラー:', error);
    return null;
  }
  return data?.[0];
}

/** クラウドDBの単語を編集・更新する */
export async function updateWordInCloud(id: number, updatedWord: any) {
  const { data, error } = await supabase
    .from('words')
    .update(updatedWord)
    .eq('id', id)
    .select();

  if (error) {
    console.error('単語更新エラー:', error);
    return null;
  }
  return data?.[0];
}

/** クラウドDBから単語を削除する */
export async function deleteWordFromCloud(id: number) {
  const { error } = await supabase
    .from('words')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('単語削除エラー:', error);
    return false;
  }
  return true;
}