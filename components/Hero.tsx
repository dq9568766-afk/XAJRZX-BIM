import React, { useState } from 'react';
import { ChevronRight, PlayCircle, X, Box } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Hero: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isBimModalOpen, setIsBimModalOpen] = useState(false);
  const { projectInfo, heroVideos, participatingUnits } = useData(); // Use dynamic data

  // Use the dynamic video list from context
  const videoHighlights = heroVideos;

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden pt-16 pb-8">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/id/122/1920/1080"
          alt="Financial Island Rendering"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-concrete-900/60 via-concrete-900/40 to-concrete-900/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white flex-1 flex flex-col justify-center">

        {/* Main Text Content */}
        <div className="flex flex-col justify-center mb-8">
          <div>
            <div className="inline-block px-4 py-1 mb-6 border border-wood-400/50 rounded-full bg-wood-900/30 backdrop-blur-sm text-wood-100 text-sm font-medium tracking-wide">
              数字化赋能 · 智慧建造
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-tight drop-shadow-lg">
              {projectInfo.name}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-concrete-100 max-w-4xl mx-auto mb-6 font-normal leading-relaxed drop-shadow-md">
              {projectInfo.description}
            </p>

            {/* Action Bar: Buttons and Stats in one row */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mt-6">

              {/* 1. View BIM Model Button */}
              <button
                onClick={() => setIsBimModalOpen(true)}
                className="px-8 py-4 bg-wood-600 hover:bg-wood-700 text-white text-lg rounded-lg font-bold transition-all shadow-lg shadow-wood-900/20 flex items-center transform hover:scale-105"
              >
                查看BIM模型 <Box size={20} className="ml-2" />
              </button>

              {/* 2. Total Area */}
              <div className="flex flex-col items-center lg:px-6 lg:border-l border-white/20">
                <p className="text-concrete-300 text-sm uppercase tracking-wider">总建筑面积</p>
                <p className="text-2xl font-semibold">{projectInfo.totalArea}</p>
              </div>

              {/* 3. Total Investment */}
              <div className="flex flex-col items-center lg:px-6 lg:border-l lg:border-r border-white/20">
                <p className="text-concrete-300 text-sm uppercase tracking-wider">总投资额</p>
                <p className="text-2xl font-semibold">{projectInfo.investment}</p>
              </div>

              {/* 4. Explore Highlights Button (Styled same as BIM button) */}
              <button
                onClick={() => document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-wood-600 hover:bg-wood-700 text-white text-lg rounded-lg font-bold transition-all shadow-lg shadow-wood-900/20 flex items-center transform hover:scale-105"
              >
                探索应用亮点 <ChevronRight size={20} className="ml-2" />
              </button>

            </div>
          </div>
        </div>

        {/* Video Gallery Bar - Positioned at bottom row */}
        {videoHighlights.length > 0 && (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videoHighlights.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col gap-3 cursor-pointer"
                  onClick={() => setActiveVideo(item.videoUrl)}
                >
                  {/* Title placed above video */}
                  <div className="text-center">
                    <h3 className="inline-block text-white/90 font-bold text-sm tracking-widest px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 group-hover:bg-wood-600 group-hover:border-wood-500 transition-all duration-300 shadow-sm">
                      {item.title}
                    </h3>
                  </div>

                  {/* Video Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-white/20 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-wood-500/50 group-hover:shadow-wood-900/20">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                        <PlayCircle size={32} className="text-white fill-white/20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all z-20"
              onClick={() => setActiveVideo(null)}
            >
              <X size={24} />
            </button>
            <video
              src={activeVideo}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              您的浏览器不支持视频播放。
            </video>
          </div>
        </div>
      )}

      {/* BIM Model Modal (Iframe) */}
      {isBimModalOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsBimModalOpen(false)}
        >
          <div
            className="relative w-full h-[90vh] max-w-[95vw] bg-concrete-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black/50 p-2 flex justify-between items-center absolute top-0 left-0 right-0 z-10 backdrop-blur-sm">
              <span className="text-white ml-4 font-bold flex items-center"><Box size={16} className="mr-2" />BIM 模型预览</span>
              <button
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
                onClick={() => setIsBimModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {projectInfo.bimModelUrl ? (
              <iframe
                src={projectInfo.bimModelUrl}
                className="w-full h-full border-0"
                allowFullScreen
                title="BIM Model Viewer"
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-concrete-400">
                <Box size={64} className="mb-4 opacity-30" />
                <p className="text-xl">BIM 模型链接尚未配置</p>
                <p className="text-sm mt-2">请联系管理员在后台设置模型预览链接</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Participating Units Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-concrete-900/95 to-concrete-900/60 backdrop-blur-md border-t border-white/10 py-3 z-20">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 justify-items-center items-end">
            {participatingUnits.map((unit) => (
              <div key={unit.id} className="flex flex-col items-center group cursor-default w-full">
                {/* Category - Top */}
                <div className="text-[10px] md:text-xs font-bold text-wood-400 mb-1 tracking-widest uppercase relative after:content-[''] after:block after:w-6 after:h-[1.5px] after:bg-wood-600/50 after:mx-auto after:mt-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  {unit.category}
                </div>

                {/* Logo & Name Container */}
                <div className="flex flex-col items-center justify-center space-y-1 w-full">
                  {/* Logo - Middle */}
                  <div className="h-10 md:h-12 flex items-center justify-center w-full px-2 transform group-hover:-translate-y-0.5 transition-transform duration-300">
                    {unit.logo ? (
                      <img
                        src={unit.logo}
                        alt={unit.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-sm opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="h-6 w-16 border border-white/10 border-dashed rounded flex items-center justify-center opacity-30">
                        <span className="text-[9px] text-white">Logo</span>
                      </div>
                    )}
                  </div>

                  {/* Name - Bottom */}
                  <span className="text-xs md:text-sm text-concrete-100 font-medium text-center whitespace-normal leading-tight group-hover:text-white transition-colors group-hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    {unit.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;