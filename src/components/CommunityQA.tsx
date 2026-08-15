import React, { useState } from 'react';
import { MIKE_QA_ITEMS } from '../data/qaData';
import { QAItem, Language } from '../types';
import { Play, Pause, ExternalLink, ThumbsUp, Eye, Volume2, MessageSquare, Sparkles } from 'lucide-react';

interface CommunityQAProps {
  lang: Language;
}

export const CommunityQA: React.FC<CommunityQAProps> = ({ lang }) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>('qa-555');
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState<{ [key: string]: number }>({
    'qa-555': 4820,
    'qa-556': 6120,
    'qa-557': 8940
  });

  const handleTogglePlay = (id: string) => {
    if (activeVideoId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveVideoId(id);
      setIsPlaying(true);
    }
  };

  const handleLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const activeItem = MIKE_QA_ITEMS.find(item => item.id === activeVideoId) || MIKE_QA_ITEMS[0];

  return (
    <div className="max-w-5xl mx-auto my-6 px-4 space-y-6">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>1win Token Community Series</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            1win Token: QA with Mike — Part 2 👍
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            {lang === 'en'
              ? 'We collected the second batch of popular questions from the community and asked Mike for video answers.'
              : 'কমিউনিটি থেকে সেরা প্রশ্নগুলো নিয়ে মাইকের ভিডিও উত্তর প্রস্তুত করা হয়েছে।'}
          </p>
        </div>

        <a
          href="https://t.me/token_1win"
          target="_blank"
          rel="noreferrer"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition shrink-0"
        >
          <span>Join Telegram Channel</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Main Video Stage & Transcript */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Video Player Simulator */}
        <div className="md:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
          
          <div className="relative aspect-video bg-slate-950 flex items-center justify-center p-6 text-center border-b border-slate-800 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
            
            {/* Background Graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-950/80 to-slate-950 pointer-events-none" />

            {/* Video Content Overlay */}
            <div className="relative z-20 max-w-lg space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                <Volume2 className={`w-8 h-8 ${isPlaying ? 'animate-bounce text-amber-300' : ''}`} />
              </div>

              <h3 className="text-lg font-bold text-white">
                ❓ {activeItem.question}
              </h3>
              
              <div className="text-xs text-amber-300 font-mono font-semibold">
                Duration: {activeItem.videoDuration} &bull; {activeItem.views} views
              </div>

              <button
                onClick={() => handleTogglePlay(activeItem.id)}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold px-6 py-2.5 rounded-full text-xs inline-flex items-center space-x-2 shadow-lg shadow-amber-500/30 transition transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause Response' : 'Play Video Answer'}</span>
              </button>
            </div>
          </div>

          {/* Transcript Box */}
          <div className="p-5 space-y-3 bg-slate-900">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center space-x-1.5 text-amber-400">
                <MessageSquare className="w-4 h-4" />
                <span>Mike's Answer Transcript</span>
              </span>
              <button
                onClick={() => handleLike(activeItem.id)}
                className="flex items-center space-x-1.5 text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg transition"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                <span>{likes[activeItem.id]} Likes</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 font-sans italic">
              {activeItem.transcript}
            </p>
          </div>

        </div>

        {/* Questions Playlist */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Community Questions (Tap to Play)
          </h3>

          <div className="space-y-3">
            {MIKE_QA_ITEMS.map((item) => {
              const isSelected = item.id === activeVideoId;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition space-y-2 ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500/50 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-white flex-1 pr-2">
                      📍 {item.question}
                    </span>
                    <a
                      href={item.tgLink}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-1 rounded flex items-center space-x-1 shrink-0"
                    >
                      <span>Play</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {item.answerSummary}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 font-mono">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{item.views} views</span>
                    </span>
                    <span>{item.videoDuration}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
