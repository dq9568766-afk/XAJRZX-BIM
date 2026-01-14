
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { generateProjectResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useData } from '../contexts/DataContext';

const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: '您好！我是金融岛项目BIM应用的AI助手。关于本项目的BIM应用、团队信息，您可以随时问我。', timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { aiConfig, projectInfo, highlights, achievements, teamMembers } = useData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await generateProjectResponse(
        userMsg.text,
        aiConfig,
        {
          projectInfo,
          highlights,
          achievements,
          teamMembers,
          documents: aiConfig.documents
        }
      );
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "抱歉，发生了一些错误，请稍后再试。",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-concrete-200 overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-300">

          {/* Header */}
          <div className="bg-concrete-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <Bot size={20} className="text-wood-400" />
              <span className="font-semibold text-sm">AI智能助手</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-wood-400 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-concrete-50 scrollbar-thin scrollbar-thumb-concrete-300">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-wood-600 text-white rounded-br-none'
                    : 'bg-white text-concrete-800 border border-concrete-200 rounded-bl-none shadow-sm'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-concrete-200 shadow-sm flex items-center space-x-2">
                  <Loader2 size={16} className="animate-spin text-wood-600" />
                  <span className="text-xs text-concrete-500">
                    {aiConfig.providerName} 思考中...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-concrete-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="询问关于项目的问题..."
                className="flex-1 bg-concrete-100 text-sm p-2.5 rounded-lg border-transparent focus:border-wood-500 focus:bg-white focus:ring-0 outline-none transition-all"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className="p-2.5 bg-concrete-900 text-white rounded-lg hover:bg-wood-600 disabled:opacity-50 disabled:hover:bg-concrete-900 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {/* Toggle Button Container */}
      {!isOpen && (
        <div className="relative group">
          {/* Call To Action Bubble */}
          <div className="absolute right-16 bottom-4 w-auto bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl rounded-tr-none shadow-[0_0_25px_rgba(6,182,212,0.25)] border border-cyan-500/30 animate-in fade-in slide-in-from-right-4 duration-500 hidden md:block group-hover:-translate-y-1 transition-transform">
            <div className="flex items-center space-x-3">
              <div className="relative bg-cyan-950/50 p-2.5 rounded-lg shrink-0 border border-cyan-500/30">
                <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full"></div>
                <Bot size={20} className="relative text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-cyan-400 to-blue-400 mb-0.5 leading-tight tracking-wide">
                  我是金融中心AI助手
                </h3>
                <p className="text-[11px] text-slate-300 leading-snug font-light whitespace-nowrap">
                  想要了解更多，<span className="text-cyan-400 font-medium ml-0.5 drop-shadow-sm inline">请点我！</span>
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const bubble = e.currentTarget.parentElement?.parentElement;
                  if (bubble) bubble.style.display = 'none';
                }}
                className="absolute -top-2 -left-2 bg-slate-800 border border-slate-600 rounded-full p-1 text-slate-400 hover:text-white hover:border-red-500 hover:bg-red-500/20 transition-all shadow-sm z-10"
              >
                <X size={12} />
              </button>
            </div>

            {/* Tech accents (Decorations) */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-sm"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-sm"></div>

            {/* Arrow */}
            <div className="absolute -right-2 top-8 w-4 h-4 bg-slate-900/80 border-t border-r border-cyan-500/30 rotate-45 transform backdrop-blur-md"></div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-14 h-14 bg-concrete-900 text-white rounded-full shadow-lg hover:bg-wood-600 transition-all hover:scale-110 active:scale-95 group-hover:shadow-wood-900/20"
          >
            <div className="relative">
              <MessageCircle size={28} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default GeminiChat;
