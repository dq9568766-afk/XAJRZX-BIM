import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { MapPin, Layers, User, Monitor, Globe } from 'lucide-react';

// --- Configuration Mock ---
const CONFIG = {
  locationScrollInterval: 5000,
  siteScrollInterval: 6000,
};

// Custom Hook for Auto-Scrolling
const useAutoScroll = (length: number, interval: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (length <= 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % length);
    }, interval);
    return () => clearInterval(timer);
  }, [length, interval]);

  return currentIndex;
};

// Helper to map icon string name to component
const getIconComponent = (iconName?: string) => {
  switch(iconName) {
    case 'MapPin': return MapPin;
    case 'Layers': return Layers;
    case 'User': return User;
    default: return MapPin;
  }
};

const LocationSection: React.FC = () => {
  const { locationSlides, siteSlides } = useData();

  // Carousel States
  const locationSlideIndex = useAutoScroll(locationSlides.length, CONFIG.locationScrollInterval);
  const siteSlideIndex = useAutoScroll(siteSlides.length, CONFIG.siteScrollInterval);

  return (
    <section id="location" className="py-12 bg-concrete-100">
      <div className="container mx-auto px-6">
        
        {/* Updated Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-concrete-200 pb-4">
           <div className="flex items-center gap-4">
              <div className="bg-wood-100 p-3 rounded-xl text-wood-600 shadow-sm">
                  <Globe size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-concrete-900">项目区位与现场实况</h2>
                <p className="text-concrete-500 mt-1 font-medium">地理优势解析与施工进度实时监控</p>
              </div>
           </div>
           <div className="hidden md:block mb-1">
             <span className="text-xs text-concrete-400 bg-white px-3 py-1 rounded-full border border-concrete-200 shadow-sm">
               数据实时接入
             </span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
             {/* Location Card */}
             <div className="relative rounded-2xl overflow-hidden shadow-lg h-96 group border border-concrete-200 bg-white">
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-concrete-600 flex items-center shadow-sm">
                   <MapPin size={14} className="mr-1 text-wood-600"/> 项目区位
                </div>
                {locationSlides.length > 0 ? locationSlides.map((slide, idx) => {
                  const Icon = getIconComponent(slide.iconName);
                  return (
                  <div 
                      key={slide.id} 
                      className={`absolute inset-0 transition-opacity duration-1000 ${idx === locationSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-8 left-8 right-8">
                         <div className="flex items-center gap-3 mb-2">
                            <div className="bg-wood-500 p-2 rounded-full text-white shadow-lg">
                               <Icon size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-wide">{slide.title}</h3>
                         </div>
                         <p className="text-concrete-100 text-lg">{slide.description}</p>
                      </div>
                  </div>
                )}) : (
                  <div className="flex items-center justify-center h-full bg-concrete-100 text-concrete-400">暂无位置数据</div>
                )}
             </div>

             {/* Site Progress Card */}
             <div className="relative rounded-2xl overflow-hidden shadow-lg border border-concrete-200 bg-white h-96 flex flex-col">
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-concrete-600 flex items-center shadow-sm">
                   <Monitor size={14} className="mr-1 text-wood-600"/> 现场实况
                </div>
                {siteSlides.length > 0 ? siteSlides.map((slide, idx) => (
                   <div 
                      key={slide.id} 
                      className={`absolute inset-0 flex flex-col transition-opacity duration-1000 ${idx === siteSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                   >
                      {/* Image Part */}
                      <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
                         <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                         <div className="absolute top-4 right-4">
                            <span className="bg-wood-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg border border-white/20">
                               {slide.tag}
                            </span>
                         </div>
                      </div>
                      
                      {/* Content Part */}
                      <div className="flex-1 p-6 flex items-center justify-between bg-concrete-50">
                         <div>
                            <h4 className="text-xl font-bold text-concrete-900 mb-2">{slide.title}</h4>
                            <p className="text-sm text-concrete-500 leading-relaxed max-w-md">{slide.desc}</p>
                         </div>
                      </div>
                   </div>
                )) : (
                  <div className="flex items-center justify-center h-full bg-concrete-100 text-concrete-400">暂无现场数据</div>
                )}
             </div>

        </div>
      </div>
    </section>
  );
};

export default LocationSection;