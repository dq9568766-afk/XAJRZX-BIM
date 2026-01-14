import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Phone, User, Users, Network, Image as ImageIcon, Briefcase } from 'lucide-react';

type TabId = 'members' | 'org' | 'photo';

const Team: React.FC = () => {
  const { teamMembers, projectInfo } = useData();
  const [activeTab, setActiveTab] = useState<TabId>('org');

  return (
    <section id="team" className="py-8 bg-concrete-50 scroll-mt-24">
      <div className="container mx-auto px-6">

        {/* Updated Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b border-concrete-200 pb-4">
          <div className="flex items-center gap-4">
            <div className="bg-wood-100 p-3 rounded-xl text-wood-600 shadow-sm">
              <Briefcase size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-concrete-900">BIM团队架构</h2>
              <p className="text-concrete-500 mt-1 font-medium">专业分工明确的高效协作体系</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-concrete-100 overflow-hidden min-h-[450px] flex flex-col">
          {/* Tabs Header */}
          <div className="flex border-b border-concrete-200 flex-col md:flex-row">
            <button
              onClick={() => setActiveTab('org')}
              className={`flex-1 py-4 text-center font-bold text-lg transition-colors flex items-center justify-center ${activeTab === 'org'
                ? 'bg-white text-wood-600 border-b-2 border-wood-600'
                : 'bg-concrete-50 text-concrete-500 hover:bg-concrete-100'
                }`}
            >
              <Network size={20} className="mr-2" /> 组织架构
            </button>
            <button
              onClick={() => setActiveTab('photo')}
              className={`flex-1 py-4 text-center font-bold text-lg transition-colors flex items-center justify-center ${activeTab === 'photo'
                ? 'bg-white text-wood-600 border-b-2 border-wood-600'
                : 'bg-concrete-50 text-concrete-500 hover:bg-concrete-100'
                }`}
            >
              <Users size={20} className="mr-2" /> 团队风采
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 py-4 text-center font-bold text-lg transition-colors flex items-center justify-center ${activeTab === 'members'
                ? 'bg-white text-wood-600 border-b-2 border-wood-600'
                : 'bg-concrete-50 text-concrete-500 hover:bg-concrete-100'
                }`}
            >
              <User size={20} className="mr-2" /> 核心成员
            </button>
          </div>

          {/* Content Area */}
          <div className="p-8 flex-1 bg-white relative">

            {/* Tab: Org Chart */}
            {activeTab === 'org' && (
              <div className="h-full flex items-center justify-center animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-[400px]">
                {projectInfo.orgChartUrl ? (
                  <img
                    src={projectInfo.orgChartUrl}
                    alt="组织架构图"
                    className="max-w-full max-h-[500px] object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-concrete-400">
                    <Network size={48} className="mb-4 opacity-50" />
                    <p>暂无组织架构图</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Team Photo */}
            {activeTab === 'photo' && (
              <div className="h-full flex items-center justify-center animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-[400px]">
                {projectInfo.teamPhotoUrl ? (
                  <img
                    src={projectInfo.teamPhotoUrl}
                    alt="团队风采"
                    className="w-full h-full object-cover rounded-xl shadow-sm max-h-[500px]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-concrete-400">
                    <ImageIcon size={48} className="mb-4 opacity-50" />
                    <p>暂无团队风采照片</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Members */}
            {activeTab === 'members' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="p-4 rounded-xl border border-concrete-100 bg-concrete-50 flex flex-col items-center text-center hover:shadow-md transition-all group">
                      <div className="w-20 h-20 mb-3 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-concrete-400 overflow-hidden group-hover:border-wood-200 transition-colors">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={32} />
                        )}
                      </div>
                      <div className="font-bold text-concrete-900">{member.name}</div>
                      <div className="text-xs text-wood-600 bg-wood-50 px-2 py-0.5 rounded-full mb-2 border border-wood-100">{member.role}</div>
                      <div className="text-concrete-500 text-xs flex items-center">
                        <Phone size={12} className="mr-1" /> {member.contact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;