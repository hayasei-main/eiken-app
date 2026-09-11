import React, { useState } from 'react';
export const AdminManageScreen = ({ onAddWord }: any) => {
  const [term, setTerm] = useState('');
  const [meaning, setMeaning] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term || !meaning) return;
    onAddWord({ term, meaning, item_type: 'word' });
    setTerm('');
    setMeaning('');
    alert('クラウドに追加しました！');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">単語追加（管理画面）</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-xs">
        <input className="border p-2 rounded" placeholder="英単語 (例: apple)" value={term} onChange={(e) => setTerm(e.target.value)} />
        <input className="border p-2 rounded" placeholder="意味 (例: りんご)" value={meaning} onChange={(e) => setMeaning(e.target.value)} />
        <button type="submit" className="bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">クラウドに追加登録</button>
      </form>
    </div>
  );
};
