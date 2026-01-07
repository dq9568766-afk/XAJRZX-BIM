import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import HighlightsGrid from '../components/HighlightsGrid';
import Achievements from '../components/Achievements';
import Team from '../components/Team';
import LocationSection from '../components/LocationSection';
import { useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { MapPin, Phone, Navigation, Mail } from 'lucide-react';

const Home: React.FC = () => {
  const location = useLocation();
  const { projectInfo } = useData();

  // Handle hash scrolling on initial load or route change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
        window.scrollTo(0,0);
    }
  }, [location]);

  return (
    <main>
      <Hero />
      <LocationSection />
      <Team />
      <HighlightsGrid />
      <Achievements />
      
      {/* Footer with Integrated Contact Info */}
      <footer className="bg-concrete-900 text-concrete-400 py-10 border-t border-concrete-800">
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-10">
              
              {/* Brand Column */}
              <div>
                <h5 className="text-white font-bold text-xl mb-4 flex items-center">
                   {projectInfo.logoUrl && <img src={projectInfo.logoUrl} className="w-8 h-8 mr-3 rounded bg-white/10 p-0.5" />}
                   {projectInfo.name}
                </h5>
                <p className="text-sm leading-relaxed mb-6 max-w-xs text-concrete-500">
                   {projectInfo.description.substring(0, 80)}...
                </p>
                <div className="inline-block px-3 py-1 border border-concrete-700 rounded text-xs text-concrete-500">
                   数字化建造 · 智慧化运维
                </div>
              </div>

              {/* Contact Column (Moved from Main Page) */}
              <div>
                 <h5 className="text-white font-bold text-lg mb-6 border-l-4 border-wood-600 pl-3">联系与合作</h5>
                 <ul className="space-y-4">
                    <li className="flex items-start">
                       <MapPin size={18} className="mr-3 text-wood-500 mt-0.5 flex-shrink-0" />
                       <div>
                          <span className="block text-concrete-300 font-medium">项目地址</span>
                          <span className="text-sm">{projectInfo.location}</span>
                       </div>
                    </li>
                    <li className="flex items-start">
                       <Phone size={18} className="mr-3 text-wood-500 mt-0.5 flex-shrink-0" />
                       <div>
                          <span className="block text-concrete-300 font-medium">合作热线</span>
                          <span className="text-sm">010-8888-9999 (项目部)</span>
                       </div>
                    </li>
                    <li className="flex items-start">
                       <Navigation size={18} className="mr-3 text-wood-500 mt-0.5 flex-shrink-0" />
                       <div>
                          <span className="block text-concrete-300 font-medium">来访导航</span>
                          <span className="text-sm">金融岛核心区建设指挥部 · 接待中心</span>
                       </div>
                    </li>
                 </ul>
              </div>

              {/* Quick Links Column */}
              <div>
                 <h5 className="text-white font-bold text-lg mb-6 border-l-4 border-wood-600 pl-3">快速导航</h5>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <a href="#location" className="hover:text-wood-400 transition-colors">项目区位与现场实况</a>
                    <a href="#team" className="hover:text-wood-400 transition-colors">BIM团队架构</a>
                    <a href="#highlights" className="hover:text-wood-400 transition-colors">应用亮点</a>
                    <a href="#achievements" className="hover:text-wood-400 transition-colors">应用成效</a>
                    <a href="/login" className="hover:text-wood-400 transition-colors">管理后台</a>
                 </div>
              </div>

           </div>

           <div className="border-t border-concrete-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
              <div className="mb-2 md:mb-0">
                &copy; {new Date().getFullYear()} {projectInfo.name} Project Team. All Rights Reserved.
              </div>
              <div className="flex space-x-6">
                 <span className="text-concrete-600 hover:text-concrete-400 cursor-pointer">隐私政策</span>
                 <span className="text-concrete-600 hover:text-concrete-400 cursor-pointer">使用条款</span>
              </div>
           </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;