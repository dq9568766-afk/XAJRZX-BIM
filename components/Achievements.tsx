import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Users, Trophy } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Achievement } from '../types';

// --- Configuration Mock (Simulating Backend Settings) ---
const CONFIG = {
  awardInterval: 5000,
  publicationInterval: 6000,
  visitInterval: 7000
};

// Custom Hook for Auto-Scrolling
const useAutoScroll = (length: number, interval: number) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, interval);
    return () => clearInterval(timer);
  }, [length, interval]);

  return index;
};

// Sub-component for individual column carousel
interface AchievementCarouselProps {
  title: string;
  icon: React.ElementType;
  items: Achievement[];
  interval: number;
}

const AchievementCarousel: React.FC<AchievementCarouselProps> = ({ title, icon: Icon, items, interval }) => {
  const currentIndex = useAutoScroll(items.length, interval);

  if (items.length === 0) return null;

  return (
    <div className="bg-concrete-50 rounded-xl overflow-hidden border border-concrete-100 shadow-sm flex flex-col h-full group hover:shadow-md transition-shadow relative">
      {/* Floating Badge Header */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-wood-700 flex items-center shadow-sm border border-white/50">
          <Icon size={14} className="mr-1.5" />
          {title}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative flex-1 min-h-[360px]">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 flex flex-col transition-opacity duration-700 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Image Area */}
            <div className="h-48 md:h-56 relative overflow-hidden bg-concrete-200">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-1000 transform scale-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-concrete-900/10 to-transparent"></div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col bg-concrete-50">
              <span className="text-xs text-concrete-400 font-mono mb-2 block bg-white w-fit px-2 py-0.5 rounded border border-concrete-100">{item.date}</span>
              <h3 className="text-lg font-bold text-concrete-800 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-wood-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-concrete-600 text-sm leading-relaxed line-clamp-4">
                {item.description}
              </p>

              {/* Progress Dots */}
              <div className="mt-auto pt-4 flex space-x-1.5">
                {items.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-wood-400' : 'w-1.5 bg-concrete-200'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Achievements: React.FC = () => {
  const { achievements } = useData();

  // Group achievements by type
  const awards = achievements.filter(a => a.type === 'award');
  const publications = achievements.filter(a => a.type === 'publication');
  const visits = achievements.filter(a => a.type === 'visit');

  return (
    <section id="achievements" className="py-8 bg-white">
      <div className="container mx-auto px-6">

        {/* Updated Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b border-concrete-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-wood-100 p-3 rounded-xl text-wood-600 shadow-sm">
              <Trophy size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-concrete-900">应用成效</h2>
              <p className="text-concrete-500 mt-1 font-medium">行业认可与社会影响力</p>
            </div>
          </div>
          <div className="hidden md:block mb-2">
            <span className="text-xs text-concrete-400 bg-concrete-50 px-3 py-1 rounded-full border border-concrete-100 shadow-sm">
              内容实时更新 · 自动轮播展示
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AchievementCarousel
            title="行业奖项"
            icon={Award}
            items={awards}
            interval={CONFIG.awardInterval}
          />
          <AchievementCarousel
            title="学术发表"
            icon={BookOpen}
            items={publications}
            interval={CONFIG.publicationInterval}
          />
          <AchievementCarousel
            title="领导关怀"
            icon={Users}
            items={visits}
            interval={CONFIG.visitInterval}
          />
        </div>
      </div>
    </section>
  );
};

export default Achievements;