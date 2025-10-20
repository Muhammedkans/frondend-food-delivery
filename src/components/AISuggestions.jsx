// src/components/AISuggestions.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/api';
import MenuItemCard from './MenuItemCard';

const AISuggestions = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/ai/suggestions', { withCredentials: true });
        setItems(data.suggestions || []);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="flex gap-4 overflow-x-auto pb-2">{Array.from({length:4}).map((_,i)=>(<div key={i} className="w-64 h-44 bg-white rounded-2xl shadow animate-pulse flex-shrink-0" />))}</div>
  }

  if (!items.length) return <div className="text-gray-500">No suggestions yet</div>;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {items.map(it => typeof it === 'string' ? <div key={it} className="w-64 p-4 bg-white rounded-2xl shadow flex-shrink-0">{it}</div> : <MenuItemCard key={it._id} menuItem={it} />)}
    </div>
  );
};

export default AISuggestions;




