import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Bot, User, ArrowRight } from 'lucide-react';
import { aiService, ChatbotFallbackResponse } from '../../services/aiService';
import { Project } from '../../types/project';

interface ChatbotFallbackProps {
  onSelectCraft: (project: Project) => void;
  initialMaterial?: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedCrafts?: Project[];
}

export const ChatbotFallback: React.FC<ChatbotFallbackProps> = ({
  onSelectCraft,
  initialMaterial,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: initialMaterial
        ? `I noticed you're identifying ${initialMaterial}! Need clarification on materials, tools you have at home, or specific safety precautions? Ask me anything!`
        : `Having difficulty identifying your waste item or looking for something specific? Tell me what you're holding (e.g., "broken amber beer bottle", "cardboard shoebox", "old flannel shirt")!`,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userText = inputValue;
    setInputValue('');
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response: ChatbotFallbackResponse = await aiService.chatbotFallback(userText);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        suggestedCrafts: response.suggestedCrafts,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-8 mt-8">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b-[2px] border-[var(--color-text-accent-dark)]">
        <div className="w-10 h-10 rounded-xl bg-[#FFD166] border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] flex items-center justify-center text-[#3A3A3A]">
          <Bot className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="font-black text-lg text-[var(--color-text-accent-dark)]">
            AI Assistant & Low-Confidence Fallback
          </h3>
          <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/70">
            Clarify materials, check compatibility, or get custom craft advice
          </p>
        </div>
      </div>

      {/* Messages stream */}
      <div className="space-y-4 max-h-72 overflow-y-auto pr-2 mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm font-bold border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] ${
                m.sender === 'user'
                  ? 'bg-[var(--color-primary)] text-white rounded-tr-none'
                  : 'bg-[var(--color-background)] text-[var(--color-text-accent-dark)] rounded-tl-none'
              }`}
            >
              {m.text}
            </div>

            {/* Suggested crafts attached to bot message */}
            {m.suggestedCrafts && m.suggestedCrafts.length > 0 && (
              <div className="mt-2.5 space-y-2 w-full max-w-sm">
                <span className="text-[10px] font-black uppercase text-[var(--color-text-accent-dark)]/70">
                  Recommended Matches:
                </span>
                {m.suggestedCrafts.map((craft) => (
                  <div
                    key={craft.id}
                    onClick={() => onSelectCraft(craft)}
                    className="flex items-center justify-between p-2.5 bg-white border-[2px] border-[var(--color-text-accent-dark)] rounded-xl shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--color-text-accent-dark)] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <img
                        src={craft.coverImage}
                        alt={craft.title}
                        className="w-10 h-10 rounded-lg object-cover border border-[var(--color-text-accent-dark)] shrink-0"
                      />
                      <span className="text-xs font-black truncate">{craft.title}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--color-secondary)] shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-accent-dark)]/60">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[var(--color-secondary)]" />
            <span>AI Assistant is analyzing your query...</span>
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. 'I have thick green glass and LED wires'..."
          className="flex-1 px-4 py-2.5 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] bg-[var(--color-background)] text-xs sm:text-sm font-bold focus:outline-none focus:bg-white"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || loading}
          className="px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] font-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--color-text-accent-dark)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
