
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { parseFileContent } from '../utils/docParser';
import {
  LayoutDashboard,
  Layers,
  Award,
  Users,
  Settings,
  Plus,
  Search,
  Edit3,
  Trash2,
  Save,
  Image as ImageIcon,
  Home,
  MapPin,
  Upload,
  Video,
  FileVideo,
  LogOut,
  Type,
  Check,
  X,
  FileText,
  Box,
  Link as LinkIcon,
  Activity,
  MessageCircle,
  Download,
  Bot,
  Monitor,
  Globe
} from 'lucide-react';
import { Highlight, Achievement, TeamMember, LocationSlide, SiteSlide, BIMFile, HeroVideo, AIConfig } from '../types';

type Tab = 'overview' | 'home' | 'site' | 'highlights' | 'achievements' | 'team' | 'heroVideos' | 'settings';

// --- Generic Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-concrete-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-concrete-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-concrete-100 rounded-full transition-colors">
            <X size={20} className="text-concrete-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Image Uploader Component ---
interface ImageUploaderProps {
  value: string;
  onChange: (base64: string) => void;
  label?: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, label = "图片", className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) processFile(file);
        break;
      }
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`space - y - 2 ${className} `}>
      <label className="block text-sm font-medium text-concrete-700">{label}</label>
      <div
        className="relative border-2 border-dashed border-concrete-300 rounded-lg p-4 hover:border-wood-400 transition-colors bg-concrete-50 cursor-pointer min-h-[160px] flex flex-col items-center justify-center"
        onClick={() => fileInputRef.current?.click()}
        onPaste={handlePaste}
        tabIndex={0} // Make div focusable for paste events
      >
        {value ? (
          <div className="relative w-full h-48 group">
            <img src={value} alt="Preview" className="w-full h-full object-contain rounded" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-medium">
              点击更换或 Ctrl+V 粘贴
            </div>
          </div>
        ) : (
          <div className="text-center text-concrete-500">
            <ImageIcon size={32} className="mx-auto mb-2 text-concrete-400" />
            <p className="text-sm font-medium">点击上传或直接粘贴图片</p>
            <p className="text-xs mt-1">支持 JPG, PNG, WEBP</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

// --- File Uploader Helper ---
const FileUploadBtn: React.FC<{ onFileSelect: (file: File) => void }> = ({ onFileSelect }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="text-xs bg-concrete-100 hover:bg-concrete-200 text-concrete-600 px-2 py-1 rounded border border-concrete-300 flex items-center"
      >
        <Upload size={12} className="mr-1" /> 上传
      </button>
      <input type="file" ref={ref} className="hidden" onChange={(e) => {
        if (e.target.files?.[0]) onFileSelect(e.target.files[0])
      }} />
    </>
  )
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sidebar Component
  const SidebarItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: React.ElementType, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center space-x-3 px-6 py-3 my-1 mx-2 rounded-lg transition-all duration-200 group ${activeTab === tab
        ? 'bg-wood-600 text-white shadow-md' // Active state: solid color, white text, nice shadow
        : 'text-concrete-600 hover:bg-concrete-100 hover:text-concrete-900' // Inactive state
        } max-w-[calc(100%-1rem)]`}
    >
      <Icon size={18} className={`${activeTab === tab ? 'text-white' : 'text-concrete-400 group-hover:text-concrete-600'}`} />
      <span className="font-medium text-sm tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-concrete-100 pt-20 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-concrete-200 fixed h-full z-10 hidden md:block overflow-y-auto pb-20">
        <div className="p-6 border-b border-concrete-100">
          <h2 className="text-xl font-bold text-concrete-800">内容管理系统</h2>
          <p className="text-xs text-concrete-400 mt-1">V1.2.0 Release</p>
        </div>
        <nav className="mt-2">
          <div className="px-6 pt-6 pb-3 text-xs font-bold text-concrete-500 uppercase tracking-wider">概览</div>
          <SidebarItem tab="overview" icon={LayoutDashboard} label="系统概览" />

          <div className="px-6 pt-6 pb-3 text-xs font-bold text-concrete-500 uppercase tracking-wider">首页模块</div>
          <SidebarItem tab="home" icon={Home} label="首页信息配置" />
          <SidebarItem tab="heroVideos" icon={Video} label="首页视频管理" />
          <SidebarItem tab="site" icon={MapPin} label="现场与位置管理" />

          <div className="px-6 pt-6 pb-3 text-xs font-bold text-concrete-500 uppercase tracking-wider">其他模块</div>
          <SidebarItem tab="highlights" icon={Layers} label="亮点应用管理" />
          <SidebarItem tab="achievements" icon={Award} label="应用成效管理" />
          <SidebarItem tab="team" icon={Users} label="团队人员管理" />

          <div className="my-4 border-t border-concrete-100 mx-4"></div>
          <SidebarItem tab="settings" icon={Settings} label="系统设置 (AI配置)" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-concrete-900">
              {activeTab === 'overview' && '系统概览'}
              {activeTab === 'home' && '首页信息配置'}
              {activeTab === 'heroVideos' && '首页视频管理'}
              {activeTab === 'site' && '现场与位置管理'}
              {activeTab === 'highlights' && '亮点应用管理'}
              {activeTab === 'achievements' && '应用成效管理'}
              {activeTab === 'team' && '团队人员管理'}
              {activeTab === 'settings' && '系统设置与 AI 配置'}
            </h1>
            <p className="text-concrete-500 text-sm mt-1">欢迎回来，管理员。您可以配置网站的所有展示内容。</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-concrete-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">退出</span>
            </button>
            <div className="bg-white p-1 rounded-full shadow-sm border border-concrete-200">
              <div className="w-8 h-8 rounded-full bg-wood-100 flex items-center justify-center text-wood-700 font-bold">A</div>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-concrete-200 min-h-[600px] p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'home' && <HomeInfoTab />}
          {activeTab === 'heroVideos' && <HeroVideosTab />}
          {activeTab === 'site' && <SiteLocationTab />}
          {activeTab === 'highlights' && <HighlightsTab />}
          {activeTab === 'achievements' && <AchievementsTab />}
          {activeTab === 'team' && <TeamTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
};

// --- Tab Components ---

const OverviewTab: React.FC = () => {
  const { highlights } = useData();
  const stats = [
    { label: '总访问量', value: '12,450', change: '+12%', color: 'bg-blue-50 text-blue-600', icon: Activity },
    { label: '亮点应用数', value: highlights.length, change: 'Running', color: 'bg-green-50 text-green-600', icon: Layers },
    { label: '成果文件下载', value: '856', change: '+5%', color: 'bg-purple-50 text-purple-600', icon: Download },
    { label: 'AI 问答次数', value: '3,200', change: '+18%', color: 'bg-orange-50 text-orange-600', icon: MessageCircle },
  ];

  // Mock data for the line chart (15 points)
  const chartData = [45, 52, 49, 60, 55, 65, 70, 68, 75, 72, 85, 80, 95, 90, 100];
  const maxVal = Math.max(...chartData);
  // Generate SVG points
  const points = chartData.map((val, index) => {
    const x = (index / (chartData.length - 1)) * 100;
    const y = 100 - ((val / maxVal) * 80); // Leave some headroom
    return `${x},${y} `;
  }).join(' ');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-6 rounded-xl border border-concrete-100 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className={`p - 3 rounded - lg ${stat.color} font - bold`}>
                <stat.icon size={20} />
              </div>
              <span className={`text - xs font - medium px - 2 py - 1 rounded - full ${stat.change.includes('+') ? 'bg-green-50 text-green-600' : 'bg-concrete-100 text-concrete-500'} `}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-concrete-800 mb-1">{stat.value}</h3>
            <p className="text-concrete-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Traffic Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-concrete-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-concrete-800">系统访问趋势</h3>
              <p className="text-xs text-concrete-400">近 15 天 PV/UV 统计</p>
            </div>
            <select className="text-xs border-none bg-concrete-50 p-2 rounded text-concrete-600 outline-none cursor-pointer">
              <option>最近15天</option>
              <option>最近30天</option>
            </select>
          </div>

          <div className="h-64 w-full relative">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map(y => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
              ))}

              {/* Area Fill */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`0, 100 ${points} 100, 100`} fill="url(#chartGradient)" />

              {/* Line Path */}
              <polyline points={points} fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

              {/* Dots on points */}
              {chartData.map((val, index) => {
                const x = (index / (chartData.length - 1)) * 100;
                const y = 100 - ((val / maxVal) * 80);
                return (
                  <circle key={index} cx={x} cy={y} r="0.8" fill="white" stroke="#d97706" strokeWidth="0.5" className="hover:scale-150 transition-transform origin-center" />
                );
              })}
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-xs text-concrete-400 mt-2 px-1">
              <span>11-01</span>
              <span>11-05</span>
              <span>11-10</span>
              <span>11-15</span>
            </div>
          </div>
        </div>

        {/* Top Downloads / Resources */}
        <div className="bg-white p-6 rounded-xl border border-concrete-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-concrete-800 mb-6">热门资源下载</h3>
          <div className="flex-1 space-y-5">
            {[
              { name: '节点深化报告.pdf', count: 324, percent: 85 },
              { name: '施工模拟动画.mp4', count: 256, percent: 70 },
              { name: '机电管线图.dwg', count: 189, percent: 55 },
              { name: '项目汇报PPT.pptx', count: 145, percent: 40 },
              { name: 'BIM执行标准.pdf', count: 98, percent: 25 }
            ].map((item, i) => (
              <div key={i} className="group cursor-default">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-concrete-700 font-medium truncate pr-4">{item.name}</span>
                  <span className="text-concrete-500 text-xs">{item.count}次</span>
                </div>
                <div className="h-1.5 bg-concrete-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-wood-500 rounded-full transition-all duration-1000 ease-out group-hover:bg-wood-600"
                    style={{ width: `${item.percent}% ` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-xs text-concrete-500 hover:text-wood-600 border border-concrete-200 rounded-lg hover:bg-concrete-50 transition-colors">
            查看全部数据
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsTab: React.FC = () => {
  const { aiConfig, updateAiConfig } = useData();
  const [formData, setFormData] = useState<AIConfig>(aiConfig);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value as AIConfig['provider'];
    let newConfig = { ...formData, provider };

    // Apply Presets
    if (provider === 'deepseek') {
      newConfig.baseUrl = 'https://api.deepseek.com';
      newConfig.model = 'deepseek-chat';
      newConfig.providerName = 'DeepSeek (深度求索)';
    } else if (provider === 'moonshot') {
      newConfig.baseUrl = 'https://api.moonshot.cn/v1';
      newConfig.model = 'moonshot-v1-8k';
      newConfig.providerName = 'Moonshot AI (Kimi)';
    } else if (provider === 'zhipu') {
      newConfig.baseUrl = 'https://open.bigmodel.cn/api/paas/v4';
      newConfig.model = 'glm-4';
      newConfig.providerName = 'Zhipu AI (智谱)';
    } else {
      newConfig.providerName = '自定义模型';
      newConfig.baseUrl = '';
      newConfig.model = '';
    }
    setFormData(newConfig);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    setTimeout(() => {
      updateAiConfig(formData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  return (
    <div className="max-w-4xl">
      <h3 className="text-xl font-bold text-concrete-800 mb-6 flex items-center">
        <Bot size={24} className="mr-3 text-wood-600" />
        AI 助手配置
      </h3>

      <div className="bg-concrete-50 border border-concrete-200 rounded-xl p-8 mb-8">
        <h4 className="font-bold text-lg mb-4 text-concrete-800 border-b pb-2">基础连接配置</h4>
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-start">
          <Activity size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <strong>费用提示：</strong>
            此处配置的 API Key 将暴露在前端代码中。这意味网站访客使用 AI 问答时，扣除的是您的账户余额。
            <br />由于是国内模型（如 DeepSeek），费用通常非常低廉，但请务必在服务商后台设置<strong>消费限额</strong>以防滥用。
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-bold text-concrete-700 mb-2">模型供应商</label>
              <select
                name="provider"
                value={formData.provider}
                onChange={handleProviderChange}
                className="w-full p-3 border border-concrete-300 rounded-lg bg-white focus:ring-2 focus:ring-wood-200 outline-none"
              >
                <option value="deepseek">DeepSeek (深度求索) - 推荐</option>
                <option value="moonshot">Moonshot AI (Kimi)</option>
                <option value="zhipu">Zhipu AI (智谱GLM)</option>
                <option value="custom">自定义 (OpenAI 兼容接口)</option>
              </select>
            </div>

            {/* Provider Name Display */}
            <div>
              <label className="block text-sm font-bold text-concrete-700 mb-2">显示名称</label>
              <input
                type="text"
                name="providerName"
                value={formData.providerName}
                onChange={handleChange}
                className="w-full p-3 border border-concrete-300 rounded-lg focus:ring-2 focus:ring-wood-200 outline-none"
              />
            </div>

            {/* API Key */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-concrete-700 mb-2">API Key (令牌)</label>
              <input
                type="password"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full p-3 border border-concrete-300 rounded-lg focus:ring-2 focus:ring-wood-200 outline-none font-mono"
                required
              />
              <p className="text-xs text-concrete-500 mt-2">请前往对应服务商官网申请 API Key。</p>
            </div>

            {/* Base URL */}
            <div>
              <label className="block text-sm font-bold text-concrete-700 mb-2">API Base URL</label>
              <input
                type="text"
                name="baseUrl"
                value={formData.baseUrl}
                onChange={handleChange}
                placeholder="https://api.example.com/v1"
                className="w-full p-3 border border-concrete-300 rounded-lg focus:ring-2 focus:ring-wood-200 outline-none font-mono text-sm"
                required
              />
            </div>

            {/* Model Name */}
            <div>
              <label className="block text-sm font-bold text-concrete-700 mb-2">模型名称 (Model ID)</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="gpt-3.5-turbo, deepseek-chat, etc."
                className="w-full p-3 border border-concrete-300 rounded-lg focus:ring-2 focus:ring-wood-200 outline-none font-mono text-sm"
                required
              />
            </div>

            {/* System Prompt */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-concrete-700 mb-2">系统提示词 (System Prompt)</label>
              <textarea
                name="systemPrompt"
                value={formData.systemPrompt}
                onChange={handleChange}
                rows={5}
                className="w-full p-3 border border-concrete-300 rounded-lg focus:ring-2 focus:ring-wood-200 outline-none text-sm"
              ></textarea>
              <p className="text-xs text-concrete-500 mt-2">系统会自动追加项目的具体信息（如位置、亮点等）到此提示词之后。</p>
            </div>
          </div>

          <div className="pt-8 border-t border-concrete-200">
            <h4 className="font-bold text-lg mb-4 text-concrete-800 flex items-center">
              <FileText size={20} className="mr-2 text-wood-600" />
              知识拓展 (Knowledge Base)
            </h4>
            <p className="text-sm text-concrete-600 mb-4">
              上传项目文档（PDF, Word, TXT等），AI助手将学习这些内容并根据其回答问题。
            </p>

            {/* Upload Area */}
            <div className="mb-6">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-concrete-300 border-dashed rounded-lg cursor-pointer bg-concrete-50 hover:bg-wood-50 hover:border-wood-400 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload size={32} className="text-concrete-400 mb-2" />
                  <p className="text-sm text-concrete-600"><span className="font-semibold">点击上传</span> 或拖拽文件至此</p>
                  <p className="text-xs text-concrete-500 mt-1">支持 .pdf, .docx, .txt, .md, .csv</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".txt,.md,.json,.csv,.pdf,.docx"
                  className="hidden"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    const newDocs: any[] = [];

                    // Process each file
                    for (let i = 0; i < files.length; i++) {
                      const file = files[i];
                      // Check dup
                      if (formData.documents?.some(d => d.name === file.name)) {
                        if (!confirm(`文件 "${file.name}" 已存在，要覆盖吗？`)) continue;
                      }

                      try {
                        setSaveStatus('saving'); // Show busy
                        const text = await parseFileContent(file);
                        newDocs.push({
                          id: Date.now().toString() + Math.random().toString(),
                          name: file.name,
                          type: file.name.split('.').pop()?.toLowerCase() || 'txt',
                          size: file.size,
                          content: text,
                          uploadDate: Date.now()
                        });
                      } catch (err) {
                        console.error("Failed to parse", file.name, err);
                        alert(`解析文件 ${file.name} 失败: ` + err);
                      }
                    }

                    // Remove overwritten ones
                    const existing = (formData.documents || []).filter(d => !newDocs.some(n => n.name === d.name));

                    setFormData(prev => ({
                      ...prev,
                      documents: [...existing, ...newDocs]
                    }));
                    setSaveStatus('idle');
                  }}
                />
              </label>
            </div>

            {/* Documents List */}
            {(formData.documents && formData.documents.length > 0) ? (
              <div className="space-y-3">
                <h5 className="font-bold text-sm text-concrete-700 mb-2">已上传文档 ({formData.documents.length})</h5>
                <div className="grid gap-3">
                  {formData.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-concrete-200 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className={`p-2 rounded-lg ${doc.type === 'pdf' ? 'bg-red-50 text-red-600' : doc.type === 'docx' ? 'bg-blue-50 text-blue-600' : 'bg-concrete-100 text-concrete-600'}`}>
                          <FileText size={18} />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium text-concrete-800 truncate">{doc.name}</p>
                          <p className="text-xs text-concrete-400">
                            {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.uploadDate).toLocaleDateString()}
                            {doc.content.length > 500 && ` • 字数: ${doc.content.length} `}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          documents: prev.documents?.filter(d => d.id !== doc.id)
                        }))}
                        className="p-2 text-concrete-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="删除文档"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-concrete-50 rounded-lg border border-dashed border-concrete-200 text-concrete-400 text-sm">
                暂无上传文档
              </div>
            )}

            {/* Legacy Knowledge Base (Hidden or Minimized?) - Let's keep it as an "Advanced Manual Input" */}
            <div className="mt-6">
              <details className="text-xs text-concrete-500 cursor-pointer">
                <summary className="hover:text-wood-600">高级：手动编辑纯文本知识库 (Legacy)</summary>
                <textarea
                  name="knowledgeBase"
                  value={formData.knowledgeBase || ""}
                  onChange={handleChange}
                  rows={5}
                  className="w-full mt-2 p-3 border border-concrete-200 rounded-lg outline-none text-xs font-mono bg-concrete-50"
                  placeholder="此处内容将追加在上传文档之后..."
                ></textarea>
              </details>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saveStatus === 'saving'}
              className={`flex items - center px - 6 py - 3 rounded - lg text - white font - bold transition - all shadow - md ${saveStatus === 'saved' ? 'bg-green-600' : 'bg-wood-600 hover:bg-wood-700'
                } `}
            >
              {saveStatus === 'saving' ? <span className="flex items-center"><Activity className="animate-spin mr-2" /> 保存中...</span> :
                saveStatus === 'saved' ? <span className="flex items-center"><Check className="mr-2" /> 已保存</span> :
                  <span className="flex items-center"><Save className="mr-2" /> 保存配置</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const HomeInfoTab: React.FC = () => {
  const { projectInfo, updateProjectInfo } = useData();
  const [formData, setFormData] = useState(projectInfo);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    updateProjectInfo(formData);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 animate-in fade-in">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-concrete-700 mb-2">项目名称</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-wood-200 outline-none" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-concrete-700 mb-2">项目简介</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-wood-200 outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-concrete-700 mb-2">地理位置</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-wood-200 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-concrete-700 mb-2">总建筑面积</label>
          <input type="text" name="totalArea" value={formData.totalArea} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-wood-200 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-concrete-700 mb-2">总投资额</label>
          <input type="text" name="investment" value={formData.investment} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-wood-200 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-concrete-700 mb-2">BIM模型URL</label>
          <input type="text" name="bimModelUrl" value={formData.bimModelUrl} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-wood-200 outline-none" placeholder="https://..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-concrete-700 mb-2">BIM应用概述 (显示在应用亮点板块前)</label>
          <textarea
            name="bimOverview"
            value={formData.bimOverview || ""}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-wood-200 outline-none"
            placeholder="请输入一段简短的BIM应用总体介绍..."
          />
        </div>
      </div>

      {/* Branding & Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-concrete-100">
        <ImageUploader label="项目Logo" value={formData.logoUrl} onChange={(v) => setFormData(prev => ({ ...prev, logoUrl: v }))} />
        <ImageUploader label="组织架构图" value={formData.orgChartUrl} onChange={(v) => setFormData(prev => ({ ...prev, orgChartUrl: v }))} />
        <ImageUploader label="团队风采图" value={formData.teamPhotoUrl} onChange={(v) => setFormData(prev => ({ ...prev, teamPhotoUrl: v }))} />
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" disabled={saveStatus === 'saving'} className={`flex items - center px - 8 py - 3 rounded - lg text - white font - bold transition - all ${saveStatus === 'saved' ? 'bg-green-600' : 'bg-wood-600 hover:bg-wood-700'} `}>
          {saveStatus === 'saving' ? '保存中...' : saveStatus === 'saved' ? '已保存' : '保存更改'}
        </button>
      </div>
      {/* Participating Units Config */}
      <div className="pt-8 border-t border-concrete-100">
        <h4 className="font-bold text-lg mb-4 text-concrete-800 flex items-center">
          <Users size={20} className="mr-2 text-wood-600" />
          BIM参建单位配置
        </h4>
        <ParticipatingUnitsConfig />
      </div>

    </form>
  );
};

const ParticipatingUnitsConfig: React.FC = () => {
  const { participatingUnits, saveParticipatingUnit } = useData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {participatingUnits.map(unit => (
        <div key={unit.id} className="bg-concrete-50 p-4 rounded-lg border border-concrete-200">
          <div className="text-xs font-bold text-wood-600 uppercase mb-2 tracking-wider">{unit.category}</div>
          <div className="mb-3">
            <label className="block text-[10px] text-concrete-500 mb-1">单位名称</label>
            <input
              type="text"
              value={unit.name}
              onChange={(e) => saveParticipatingUnit({ ...unit, name: e.target.value })}
              className="w-full p-2 text-xs border border-concrete-300 rounded focus:ring-1 focus:ring-wood-300 outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] text-concrete-500 mb-1">Logo (推荐白色透明底)</label>
            <ImageUploader
              value={unit.logo}
              onChange={(v) => saveParticipatingUnit({ ...unit, logo: v })}
              label="上传Logo"
              className="h-20"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const HeroVideosTab: React.FC = () => {
  const { heroVideos, saveHeroVideo, deleteHeroVideo } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HeroVideo | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      saveHeroVideo(editingItem);
      setIsModalOpen(false);
      setEditingItem(null);
    }
  };

  const openNew = () => {
    setEditingItem({ id: Date.now().toString(), title: '', videoUrl: '', coverUrl: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">首页视频列表</h3>
        <button onClick={openNew} className="flex items-center px-4 py-2 bg-wood-600 text-white rounded-lg hover:bg-wood-700 transition-colors">
          <Plus size={18} className="mr-2" /> 新增视频
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {heroVideos.map(video => (
          <div key={video.id} className="border border-concrete-200 rounded-xl overflow-hidden group bg-white shadow-sm">
            <div className="h-40 bg-gray-100 relative">
              <img src={video.coverUrl} alt={video.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                <button onClick={() => { setEditingItem(video); setIsModalOpen(true); }} className="p-2 bg-white rounded-full text-wood-600 hover:bg-wood-50"><Edit3 size={18} /></button>
                <button onClick={() => deleteHeroVideo(video.id)} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-concrete-800 truncate">{video.title}</h4>
              <p className="text-xs text-concrete-400 truncate mt-1">{video.videoUrl}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="编辑视频">
        {editingItem && (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">视频标题</label>
              <input type="text" value={editingItem.title} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">视频URL (MP4)</label>
              <input type="text" value={editingItem.videoUrl} onChange={e => setEditingItem({ ...editingItem, videoUrl: e.target.value })} className="w-full p-2 border rounded" required placeholder="https://..." />
            </div>
            <ImageUploader label="封面图" value={editingItem.coverUrl} onChange={v => setEditingItem({ ...editingItem, coverUrl: v })} />
            <div className="flex justify-end pt-4">
              <button type="submit" className="px-6 py-2 bg-wood-600 text-white rounded-lg hover:bg-wood-700">保存</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

const SiteLocationTab: React.FC = () => {
  const { locationSlides, saveLocationSlide, deleteLocationSlide, siteSlides, saveSiteSlide, deleteSiteSlide } = useData();
  const [editingLoc, setEditingLoc] = useState<LocationSlide | null>(null);
  const [editingSite, setEditingSite] = useState<SiteSlide | null>(null);

  const handleLocSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLoc) { saveLocationSlide(editingLoc); setEditingLoc(null); }
  };
  const handleSiteSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSite) { saveSiteSlide(editingSite); setEditingSite(null); }
  };

  return (
    <div className="space-y-12">
      {/* Location Slides Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center"><MapPin className="mr-2" /> 区位幻灯片</h3>
          <button onClick={() => setEditingLoc({ id: Date.now(), title: '', description: '', image: '', iconName: 'MapPin' })} className="text-sm px-3 py-1 bg-wood-600 text-white rounded hover:bg-wood-700"><Plus size={16} className="inline mr-1" />添加</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locationSlides.map(slide => (
            <div key={slide.id} className="border p-3 rounded-lg relative group bg-white">
              <img src={slide.image} alt="" className="h-32 w-full object-cover rounded mb-2 bg-gray-100" />
              <h4 className="font-bold">{slide.title}</h4>
              <p className="text-xs text-concrete-500 line-clamp-2">{slide.description}</p>
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingLoc(slide)} className="p-1.5 bg-white rounded shadow text-wood-600"><Edit3 size={14} /></button>
                <button onClick={() => deleteLocationSlide(slide.id)} className="p-1.5 bg-white rounded shadow text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Site Slides Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center"><Monitor className="mr-2" /> 现场实况幻灯片</h3>
          <button onClick={() => setEditingSite({ id: Date.now(), title: '', tag: '', desc: '', image: '' })} className="text-sm px-3 py-1 bg-wood-600 text-white rounded hover:bg-wood-700"><Plus size={16} className="inline mr-1" />添加</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {siteSlides.map(slide => (
            <div key={slide.id} className="border p-3 rounded-lg relative group bg-white">
              <img src={slide.image} alt="" className="h-32 w-full object-cover rounded mb-2 bg-gray-100" />
              <div className="flex justify-between items-start">
                <h4 className="font-bold">{slide.title}</h4>
                <span className="text-xs bg-wood-100 text-wood-600 px-1.5 rounded">{slide.tag}</span>
              </div>
              <p className="text-xs text-concrete-500 line-clamp-2 mt-1">{slide.desc}</p>
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingSite(slide)} className="p-1.5 bg-white rounded shadow text-wood-600"><Edit3 size={14} /></button>
                <button onClick={() => deleteSiteSlide(slide.id)} className="p-1.5 bg-white rounded shadow text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={!!editingLoc} onClose={() => setEditingLoc(null)} title="编辑区位幻灯片">
        {editingLoc && (
          <form onSubmit={handleLocSave} className="space-y-4">
            <input type="text" placeholder="标题" value={editingLoc.title} onChange={e => setEditingLoc({ ...editingLoc, title: e.target.value })} className="w-full p-2 border rounded" required />
            <textarea placeholder="描述" value={editingLoc.description} onChange={e => setEditingLoc({ ...editingLoc, description: e.target.value })} className="w-full p-2 border rounded" required />
            <div>
              <label className="block text-sm mb-1">图标</label>
              <select value={editingLoc.iconName || 'MapPin'} onChange={e => setEditingLoc({ ...editingLoc, iconName: e.target.value as any })} className="w-full p-2 border rounded">
                <option value="MapPin">MapPin (地标)</option>
                <option value="Layers">Layers (图层)</option>
                <option value="User">User (人文)</option>
              </select>
            </div>
            <ImageUploader value={editingLoc.image} onChange={v => setEditingLoc({ ...editingLoc, image: v })} />
            <button type="submit" className="w-full py-2 bg-wood-600 text-white rounded hover:bg-wood-700">保存</button>
          </form>
        )}
      </Modal>

      <Modal isOpen={!!editingSite} onClose={() => setEditingSite(null)} title="编辑现场幻灯片">
        {editingSite && (
          <form onSubmit={handleSiteSave} className="space-y-4">
            <input type="text" placeholder="标题" value={editingSite.title} onChange={e => setEditingSite({ ...editingSite, title: e.target.value })} className="w-full p-2 border rounded" required />
            <input type="text" placeholder="标签 (如: 施工进度)" value={editingSite.tag} onChange={e => setEditingSite({ ...editingSite, tag: e.target.value })} className="w-full p-2 border rounded" required />
            <textarea placeholder="描述" value={editingSite.desc} onChange={e => setEditingSite({ ...editingSite, desc: e.target.value })} className="w-full p-2 border rounded" required />
            <ImageUploader value={editingSite.image} onChange={v => setEditingSite({ ...editingSite, image: v })} />
            <button type="submit" className="w-full py-2 bg-wood-600 text-white rounded hover:bg-wood-700">保存</button>
          </form>
        )}
      </Modal>
    </div>
  );
};

const HighlightsTab: React.FC = () => {
  const { highlights, saveHighlight, deleteHighlight } = useData();
  const [editingItem, setEditingItem] = useState<Highlight | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      saveHighlight(editingItem);
      setEditingItem(null);
    }
  };

  const openNew = () => setEditingItem({
    id: Date.now().toString(),
    title: '', summary: '', fullDescription: '', thumbnail: '', images: [], files: [], videoUrl: ''
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">亮点应用列表</h3>
        <button onClick={openNew} className="flex items-center px-4 py-2 bg-wood-600 text-white rounded-lg hover:bg-wood-700"><Plus size={18} className="mr-2" /> 新增亮点</button>
      </div>

      <div className="space-y-4">
        {highlights.map(item => (
          <div key={item.id} className="flex items-center border p-4 rounded-xl bg-white hover:shadow-md transition-shadow">
            <img src={item.thumbnail} className="w-24 h-24 object-cover rounded-lg bg-gray-200 mr-6" />
            <div className="flex-1">
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="text-concrete-500 line-clamp-2 text-sm">{item.summary}</p>
            </div>
            <div className="flex space-x-2 ml-4">
              <button onClick={() => setEditingItem(item)} className="p-2 text-wood-600 hover:bg-wood-50 rounded-full"><Edit3 size={20} /></button>
              <button onClick={() => deleteHighlight(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title="编辑亮点应用">
        {editingItem && (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Tabs for modal could be added here, for simplicity using stacked sections */}
            <div className="space-y-6">
              {/* Text Section */}
              <div className="space-y-4 bg-concrete-50 p-4 rounded-xl border border-concrete-100">
                <div>
                  <label className="block text-xs font-bold text-concrete-500 mb-1">应用标题</label>
                  <input type="text" value={editingItem.title} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} className="w-full p-2.5 bg-white border border-concrete-300 rounded-lg font-bold text-gray-800 focus:ring-2 focus:ring-wood-200 outline-none" placeholder="输入精炼的标题" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-concrete-500 mb-1">功能摘要</label>
                  <textarea value={editingItem.summary} onChange={e => setEditingItem({ ...editingItem, summary: e.target.value })} className="w-full p-2.5 bg-white border border-concrete-300 rounded-lg text-sm" rows={2} placeholder="一句话描述核心价值" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-concrete-500 mb-1">详细介绍</label>
                  <textarea value={editingItem.fullDescription} onChange={e => setEditingItem({ ...editingItem, fullDescription: e.target.value })} className="w-full p-2.5 bg-white border border-concrete-300 rounded-lg text-sm font-mono" rows={6} placeholder="支持详细的技术描述..." required />
                </div>
              </div>

              {/* Media Section (Thumbnail & Video) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Thumbnail */}
                <div className="bg-white p-4 rounded-xl border border-concrete-200 shadow-sm">
                  <ImageUploader label="封面缩略图 (推荐 16:9)" value={editingItem.thumbnail} onChange={v => setEditingItem({ ...editingItem, thumbnail: v })} className="h-48" />
                </div>

                {/* Right: Video */}
                <div className="bg-white p-4 rounded-xl border border-concrete-200 shadow-sm flex flex-col">
                  <label className="block text-sm font-bold text-concrete-700 mb-3 flex items-center">
                    <Video size={16} className="mr-2 text-wood-600" /> 成果演示视频
                  </label>

                  <div className="flex-1 flex flex-col justify-center">
                    {editingItem.videoUrl ? (
                      <div className="relative group rounded-lg overflow-hidden border border-concrete-900 bg-black">
                        <video src={editingItem.videoUrl} className="w-full h-40 object-contain" controls />
                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, videoUrl: '' })}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          title="删除视频"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-concrete-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-wood-400 transition-colors bg-concrete-50">
                        <div className="flex gap-4 w-full justify-center">
                          {/* Upload Button */}
                          <label className="cursor-pointer group">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-concrete-200 group-hover:border-wood-500 transition-colors mx-auto mb-2">
                              <Upload size={20} className="text-concrete-400 group-hover:text-wood-600" />
                            </div>
                            <span className="text-xs font-bold text-concrete-600 group-hover:text-wood-600">本地上传</span>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 20 * 1024 * 1024) { alert("文件过大(>20MB)"); return; }
                                  const reader = new FileReader();
                                  reader.onloadend = () => setEditingItem({ ...editingItem, videoUrl: reader.result as string });
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>

                          <div className="w-[1px] bg-concrete-200 h-16 self-center mx-2"></div>

                          {/* URL Input Trigger */}
                          <div className="w-full max-w-[140px] flex flex-col justify-center">
                            <input
                              type="text"
                              placeholder="粘贴视频链接..."
                              className="w-full text-xs p-2 border border-concrete-300 rounded mb-1 focus:border-wood-500 outline-none"
                              onBlur={(e) => { if (e.target.value) setEditingItem({ ...editingItem, videoUrl: e.target.value }) }}
                            />
                            <span className="text-[10px] text-concrete-400">支持 MP4 直链</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery & Files Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Gallery */}
                <div className="bg-white p-4 rounded-xl border border-concrete-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4 border-b border-concrete-100 pb-2">
                    <label className="text-sm font-bold text-concrete-800 flex items-center">
                      <ImageIcon size={16} className="mr-2 text-wood-600" />多图展示
                    </label>
                    <label className="cursor-pointer text-xs bg-wood-50 text-wood-600 px-3 py-1.5 rounded-lg border border-wood-100 hover:bg-wood-100 hover:border-wood-300 transition-all font-medium flex items-center">
                      <Plus size={14} className="mr-1" /> 添加图片
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            const newImages: string[] = [];
                            let processed = 0;
                            Array.from(files).forEach((file: File) => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                newImages.push(reader.result as string);
                                processed++;
                                if (processed === files.length) {
                                  setEditingItem(prev => prev ? ({ ...prev, images: [...(prev.images || []), ...newImages] }) : null);
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                      />
                    </label>
                  </div>

                  {(!editingItem.images || editingItem.images.length === 0) ? (
                    <div className="h-32 flex flex-col items-center justify-center bg-concrete-50 rounded-lg border-2 border-dashed border-concrete-200 text-concrete-400">
                      <ImageIcon size={24} className="mb-2 opacity-50" />
                      <span className="text-xs">暂无图片</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[200px] pr-1">
                      {editingItem.images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-concrete-200">
                          <img src={img} className="w-full h-full object-cover" />
                          <button onClick={() => setEditingItem({ ...editingItem, images: editingItem.images.filter((_, i) => i !== idx) })} className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Files */}
                <div className="bg-white p-4 rounded-xl border border-concrete-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4 border-b border-concrete-100 pb-2">
                    <label className="text-sm font-bold text-concrete-800 flex items-center">
                      <FileText size={16} className="mr-2 text-wood-600" />成果文件
                    </label>
                    <label className="cursor-pointer text-xs bg-wood-50 text-wood-600 px-3 py-1.5 rounded-lg border border-wood-100 hover:bg-wood-100 hover:border-wood-300 transition-all font-medium flex items-center">
                      <Plus size={14} className="mr-1" /> 上传附件
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.rvt,.dwg,.doc,.docx,.xls,.xlsx,.zip"
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            const newFiles: BIMFile[] = [];
                            Array.from(files).forEach((file: File) => {
                              newFiles.push({
                                id: Date.now().toString() + Math.random(),
                                name: file.name,
                                size: (file.size / 1024 / 1024).toFixed(1) + 'MB',
                                type: file.name.split('.').pop()?.toLowerCase() || 'file',
                                url: '#'
                              });
                            });
                            setEditingItem(prev => prev ? ({ ...prev, files: [...(prev.files || []), ...newFiles] }) : null);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {(!editingItem.files || editingItem.files.length === 0) ? (
                    <div className="h-32 flex flex-col items-center justify-center bg-concrete-50 rounded-lg border-2 border-dashed border-concrete-200 text-concrete-400">
                      <FileText size={24} className="mb-2 opacity-50" />
                      <span className="text-xs">暂无文件</span>
                    </div>
                  ) : (
                    <div className="space-y-2 overflow-y-auto max-h-[200px] pr-1">
                      {editingItem.files.map((file, idx) => (
                        <div key={file.id} className="flex items-center justify-between p-2.5 bg-concrete-50 rounded-lg border border-concrete-100 hover:border-wood-200 transition-colors group">
                          <div className="flex items-center overflow-hidden">
                            <div className="p-1.5 bg-white rounded border border-concrete-200 mr-2.5 shadow-sm text-wood-600">
                              <FileText size={14} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-concrete-700 truncate max-w-[140px]">{file.name}</span>
                              <span className="text-[10px] text-concrete-400 uppercase">{file.type} · {file.size}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingItem({ ...editingItem, files: editingItem.files.filter(f => f.id !== file.id) })}
                            className="p-1.5 text-concrete-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
            <div className="flex justify-end pt-4 border-t">
              <button type="submit" className="px-6 py-2 bg-wood-600 text-white rounded-lg hover:bg-wood-700">保存所有更改</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

const AchievementsTab: React.FC = () => {
  const { achievements, saveAchievement, deleteAchievement } = useData();
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) { saveAchievement(editingItem); setEditingItem(null); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">成效列表</h3>
        <button onClick={() => setEditingItem({ id: Date.now().toString(), title: '', type: 'award', date: '', description: '', imageUrl: '' })} className="flex items-center px-4 py-2 bg-wood-600 text-white rounded-lg hover:bg-wood-700"><Plus size={18} className="mr-2" /> 新增成效</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map(item => (
          <div key={item.id} className="flex border p-3 rounded-lg bg-white relative group">
            <img src={item.imageUrl} className="w-20 h-20 object-cover rounded bg-gray-100" />
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <span className={`text - xs px - 2 py - 0.5 rounded ${item.type === 'award' ? 'bg-yellow-100 text-yellow-700' : item.type === 'visit' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'} `}>{item.type}</span>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
              <h4 className="font-bold text-sm mt-1">{item.title}</h4>
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
            </div>
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <button onClick={() => setEditingItem(item)} className="p-1 bg-gray-100 rounded hover:text-wood-600"><Edit3 size={14} /></button>
              <button onClick={() => deleteAchievement(item.id)} className="p-1 bg-gray-100 rounded hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title="编辑成效">
        {editingItem && (
          <form onSubmit={handleSave} className="space-y-4">
            <input type="text" placeholder="标题" value={editingItem.title} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} className="w-full p-2 border rounded" required />
            <div className="grid grid-cols-2 gap-4">
              <select value={editingItem.type} onChange={e => setEditingItem({ ...editingItem, type: e.target.value as any })} className="w-full p-2 border rounded">
                <option value="award">奖项 (Award)</option>
                <option value="publication">期刊/论文 (Publication)</option>
                <option value="visit">参观/领导关怀 (Visit)</option>
              </select>
              <input type="text" placeholder="日期 (YYYY-MM)" value={editingItem.date} onChange={e => setEditingItem({ ...editingItem, date: e.target.value })} className="w-full p-2 border rounded" />
            </div>
            <textarea placeholder="描述" value={editingItem.description} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full p-2 border rounded" rows={3} required />
            <ImageUploader value={editingItem.imageUrl || ''} onChange={v => setEditingItem({ ...editingItem, imageUrl: v })} />
            <button type="submit" className="w-full py-2 bg-wood-600 text-white rounded hover:bg-wood-700">保存</button>
          </form>
        )}
      </Modal>
    </div>
  );
};

const TeamTab: React.FC = () => {
  const { teamMembers, saveTeamMember, deleteTeamMember } = useData();
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) { saveTeamMember(editingItem); setEditingItem(null); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">团队成员</h3>
        <button onClick={() => setEditingItem({ id: Date.now().toString(), name: '', role: '', contact: '', avatar: '', parentId: '' })} className="flex items-center px-4 py-2 bg-wood-600 text-white rounded-lg hover:bg-wood-700"><Plus size={18} className="mr-2" /> 新增成员</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map(member => (
          <div key={member.id} className="border p-4 rounded-xl flex flex-col items-center text-center bg-white relative group">
            <img src={member.avatar || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-full object-cover mb-3 bg-gray-100" />
            <h4 className="font-bold">{member.name}</h4>
            <p className="text-xs text-wood-600 bg-wood-50 px-2 py-0.5 rounded my-1">{member.role}</p>
            <p className="text-xs text-gray-400">{member.contact}</p>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-1">
              <button onClick={() => setEditingItem(member)} className="p-1.5 bg-gray-50 rounded hover:text-wood-600"><Edit3 size={14} /></button>
              <button onClick={() => deleteTeamMember(member.id)} className="p-1.5 bg-gray-50 rounded hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title="编辑成员">
        {editingItem && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 space-y-4">
                <input type="text" placeholder="姓名" value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full p-2 border rounded" required />
                <input type="text" placeholder="职位" value={editingItem.role} onChange={e => setEditingItem({ ...editingItem, role: e.target.value })} className="w-full p-2 border rounded" required />
                <input type="text" placeholder="联系方式" value={editingItem.contact} onChange={e => setEditingItem({ ...editingItem, contact: e.target.value })} className="w-full p-2 border rounded" />
                <select value={editingItem.parentId || ''} onChange={e => setEditingItem({ ...editingItem, parentId: e.target.value })} className="w-full p-2 border rounded">
                  <option value="">无上级 (顶级节点)</option>
                  {teamMembers.filter(m => m.id !== editingItem.id).map(m => (
                    <option key={m.id} value={m.id}>{m.name} - {m.role}</option>
                  ))}
                </select>
              </div>
              <div className="w-32">
                <ImageUploader label="头像" value={editingItem.avatar || ''} onChange={v => setEditingItem({ ...editingItem, avatar: v })} className="h-full" />
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-wood-600 text-white rounded hover:bg-wood-700">保存</button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
