import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { VoiceKnowledgeItem } from '../types';
import {
  Bot,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Search,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Volume2,
  Mic,
  Tag,
  Filter,
  Eye,
  EyeOff,
} from 'lucide-react';

export const VoiceAgentManager: React.FC<{ showToast: (msg: string) => void }> = ({ showToast }) => {
  const { voiceKnowledge, saveVoiceKnowledge, deleteVoiceKnowledge, setIsVoiceAgentOpen } = useAcademy();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<VoiceKnowledgeItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<VoiceKnowledgeItem, 'id'>>({
    question: '',
    answer: '',
    keywords: [],
    category: 'general',
    active: true,
  });

  const [keywordsInput, setKeywordsInput] = useState('');

  // Live tester state
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingItem(null);
    setFormData({
      question: '',
      answer: '',
      keywords: [],
      category: 'general',
      active: true,
    });
    setKeywordsInput('');
  };

  const handleStartEdit = (item: VoiceKnowledgeItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setFormData({
      question: item.question,
      answer: item.answer,
      keywords: item.keywords,
      category: item.category,
      active: item.active,
    });
    setKeywordsInput(item.keywords.join(', '));
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingItem(null);
    setKeywordsInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      showToast('Kripya Sawaal (Question) aur Jawab (Answer) dono fill karein');
      return;
    }

    const parsedKeywords = keywordsInput
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const itemToSave: VoiceKnowledgeItem = {
      id: editingItem ? editingItem.id : 'vk-' + Date.now(),
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      keywords: parsedKeywords,
      category: formData.category,
      active: formData.active,
      createdAt: editingItem?.createdAt || new Date().toISOString().split('T')[0],
    };

    await saveVoiceKnowledge(itemToSave);
    showToast(editingItem ? 'Knowledge item update ho gaya!' : 'Naya Knowledge item successfully add ho gaya!');
    handleCancel();
  };

  const handleDelete = async (id: string, question: string) => {
    if (window.confirm(`Kya aap is knowledge item ko delete karna chahte hain: "${question}"?`)) {
      await deleteVoiceKnowledge(id);
      showToast('Knowledge item delete ho gaya');
    }
  };

  const handleToggleActive = async (item: VoiceKnowledgeItem) => {
    await saveVoiceKnowledge({ ...item, active: !item.active });
    showToast(`Item ${!item.active ? 'Active' : 'Inactive'} ho gaya`);
  };

  const runTestQuery = () => {
    if (!testQuery.trim()) return;
    const q = testQuery.toLowerCase().trim();

    // Check custom knowledge
    const match = voiceKnowledge.find((item) => {
      if (!item.active) return false;
      const kwMatch = item.keywords?.some((k) => q.includes(k.toLowerCase()));
      const qMatch = item.question.toLowerCase().includes(q) || q.includes(item.question.toLowerCase());
      return kwMatch || qMatch;
    });

    if (match) {
      setTestResult(`[Custom Matched: ${match.category.toUpperCase()}]\n${match.answer}`);
    } else {
      setTestResult(`[System Matcher Active]: Will fallback to built-in website database (Admissions, Fees, Classes, Campus).`);
    }
  };

  const filteredItems = voiceKnowledge.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-['Cinzel',serif]">
                Voice AI Agent Knowledge Base
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                {voiceKnowledge.length} Custom Q&A
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Website ke floating voice assistant ke andar nayi jaankari (Sawaal, Jawab aur Keywords) add karein.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVoiceAgentOpen(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Mic className="w-4 h-4 text-amber-400" />
            <span>Open Voice Assistant</span>
          </button>
          {!isAddingNew && !editingItem && (
            <button
              onClick={handleStartAdd}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Naya Sawaal-Jawab Add Karein</span>
            </button>
          )}
        </div>
      </div>

      {/* Live AI Test Box */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/30 rounded-3xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Test AI Voice Response (Live Simulator)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runTestQuery()}
            placeholder="Type a test question (e.g., 'hostel fee kitni hai', 'location', 'dress')..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={runTestQuery}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition"
          >
            Test
          </button>
        </div>
        {testResult && (
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-200 whitespace-pre-line">
            {testResult}
          </div>
        )}
      </div>

      {/* Add / Edit Form */}
      {(isAddingNew || editingItem) && (
        <div className="bg-slate-900 border-2 border-amber-500/50 p-6 rounded-3xl shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-['Cinzel',serif] flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-400" />
              <span>{editingItem ? 'Knowledge Item Edit Karein' : 'Naya Knowledge Item Add Karein'}</span>
            </h3>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="general">General (Aam Jaankari)</option>
                  <option value="admissions">Admissions & Eligibility</option>
                  <option value="fees">Fees & Scholarships</option>
                  <option value="hostel">Hostel, Food & Boarding</option>
                  <option value="syllabus">Syllabus & Islamic Studies</option>
                  <option value="contacts">Contact & Timings</option>
                  <option value="notice">Notice & Announcements</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Trigger Keywords (Comma se separate karein)
                </label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="e.g. uniform, dress, kapde, timing, bus, van"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Agar user inme se koi bhi word bolega ya likhega to ye jawab trigger hoga.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Question / Topic *
              </label>
              <input
                type="text"
                required
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="e.g. What is the dress code and uniform requirement?"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Voice Agent Answer * (Ye jawab voice agent bolega aur text me dikhayega)
              </label>
              <textarea
                required
                rows={4}
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Detailed and polite answer for the parent/student..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white leading-relaxed focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="activeItem"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
              <label htmlFor="activeItem" className="text-slate-300 font-semibold cursor-pointer">
                Active in Voice AI Assistant
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-950/50"
              >
                <Save className="w-4 h-4" />
                <span>Save Knowledge Item</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, answers, or keywords..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="admissions">Admissions</option>
            <option value="fees">Fees</option>
            <option value="hostel">Hostel</option>
            <option value="syllabus">Syllabus</option>
            <option value="contacts">Contacts</option>
            <option value="notice">Notice</option>
          </select>
        </div>
      </div>

      {/* Knowledge Items Grid */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all ${
              item.active
                ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                : 'bg-slate-950 border-slate-900 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-bold uppercase">
                    {item.category}
                  </span>
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                      item.active
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {item.active ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                    <span>{item.active ? 'Active' : 'Disabled'}</span>
                  </button>
                </div>

                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item.question}</span>
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed pl-6">
                  {item.answer}
                </p>

                {item.keywords && item.keywords.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pl-6 pt-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {item.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleStartEdit(item)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.question)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
            Koi knowledge item nahi mila. "Naya Sawaal-Jawab Add Karein" par click karke add karein.
          </div>
        )}
      </div>
    </div>
  );
};
