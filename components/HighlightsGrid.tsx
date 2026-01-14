import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Sparkles } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const HighlightsGrid: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const { highlights, projectInfo } = useData();

  // Initial display limit for the grid
  const INITIAL_LIMIT = 6;

  const displayedHighlights = showAll ? highlights : highlights.slice(0, INITIAL_LIMIT);
  const hasMore = highlights.length > INITIAL_LIMIT;

  return (
    <section id="highlights" className="py-8 bg-concrete-50 scroll-mt-24">
      <div className="container mx-auto px-6">

        {/* Updated Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b border-concrete-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-wood-100 p-3 rounded-xl text-wood-600 shadow-sm">
              <Sparkles size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-concrete-900">应用亮点</h2>
              <p className="text-concrete-500 mt-1 font-medium">全过程、全方位的数字化解决方案</p>
            </div>
          </div>
          <div className="hidden md:block mb-2">
            <span className="text-xs text-concrete-400 bg-white px-3 py-1 rounded-full border border-concrete-200 shadow-sm">
              点击卡片查看详细成果
            </span>
          </div>
        </div>

        {/* BIM Overview Text */}
        <div className="mb-10 text-concrete-700 bg-white p-6 rounded-xl border border-concrete-100 shadow-sm leading-relaxed text-sm md:text-base">
          <h4 className="font-bold text-wood-600 mb-2 flex items-center">
            <span className="w-1.5 h-1.5 bg-wood-500 rounded-full mr-2"></span>
            BIM应用概述
          </h4>
          <div className="pl-3.5 border-l-2 border-wood-100">
            {projectInfo.bimOverview || "数字化建造技术贯穿项目全生命周期，通过模型协同、智能分析与智慧管理，实现了对工程质量、安全与进度的精细化管控，为未来数字城市底座构建奠定了坚实基础。"}
          </div>
        </div>

        {/* Standard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedHighlights.map((item) => (
            <Link
              key={item.id}
              to={`/highlight/${item.id}`}
              className="group relative block h-80 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              {/* Background Image */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay - Initially dark gradient at bottom, expands on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-concrete-900/90 via-concrete-900/40 to-transparent transition-all duration-300 group-hover:bg-concrete-900/70"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-wood-400" size={24} />
                </div>

                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                  <p className="text-concrete-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-300">
                    {item.summary}
                  </p>
                  <span className="mt-4 inline-block text-xs font-semibold text-wood-400 uppercase tracking-widest border-b border-wood-400 pb-0.5">
                    查看详情
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* More Button */}
        {!showAll && hasMore && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center justify-center px-8 py-3 bg-white border border-concrete-200 rounded-full text-concrete-600 font-medium hover:border-wood-500 hover:text-wood-600 hover:shadow-md transition-all duration-300 group"
            >
              更多应用亮点
              <ChevronDown size={18} className="ml-2 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HighlightsGrid;