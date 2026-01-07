import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, CheckCircle2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const HighlightDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { highlights } = useData();
  const highlight = highlights.find(h => h.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!highlight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-concrete-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-concrete-800">未找到相关应用点</h2>
          <Link to="/" className="mt-4 text-wood-600 hover:underline block">返回首页</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-concrete-50 pb-20 pt-20">
      {/* Top Navigation */}
      <div className="container mx-auto px-6 py-6">
        <Link to="/#highlights" className="inline-flex items-center text-concrete-500 hover:text-wood-600 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> 返回列表
        </Link>
      </div>

      <div className="container mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header Image */}
          <div className="relative h-[400px]">
            <img src={highlight.thumbnail} alt={highlight.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{highlight.title}</h1>
              <p className="text-xl text-concrete-200 max-w-2xl">{highlight.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 p-8 md:p-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Description */}
              <section>
                <h3 className="text-2xl font-bold text-concrete-800 mb-6 flex items-center">
                  <span className="w-1.5 h-8 bg-wood-500 rounded-full mr-3"></span>
                  应用详情
                </h3>
                <div className="prose prose-lg text-concrete-600 leading-relaxed">
                  <p>{highlight.fullDescription}</p>
                </div>
              </section>

              {/* Image Gallery */}
              <section>
                <h3 className="text-2xl font-bold text-concrete-800 mb-6 flex items-center">
                  <span className="w-1.5 h-8 bg-wood-500 rounded-full mr-3"></span>
                  成果展示
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highlight.images.map((img, index) => (
                    <div key={index} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <img src={img} alt={`Detail ${index}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Sidebar: Files & Specs */}
            <div className="space-y-10">
              
              {/* Files Download */}
              <div className="bg-concrete-50 p-6 rounded-xl border border-concrete-200">
                <h4 className="text-lg font-bold text-concrete-800 mb-4 flex items-center">
                  <Download size={20} className="mr-2 text-wood-600" /> 
                  成果文件下载
                </h4>
                {highlight.files.length > 0 ? (
                  <ul className="space-y-3">
                    {highlight.files.map(file => (
                      <li key={file.id} className="group flex items-center justify-between p-3 bg-white rounded-lg border border-concrete-200 hover:border-wood-300 transition-colors">
                        <div className="flex items-center overflow-hidden">
                          <FileText size={18} className="text-concrete-400 mr-3 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-concrete-700 truncate group-hover:text-wood-700">{file.name}</p>
                            <p className="text-xs text-concrete-400">{file.size} · {file.type.toUpperCase()}</p>
                          </div>
                        </div>
                        <a href={file.url} className="p-2 text-concrete-400 hover:text-wood-600 hover:bg-concrete-100 rounded-full transition-colors">
                          <Download size={16} />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-concrete-500 italic">暂无公开文件下载</p>
                )}
              </div>

              {/* Technical Specs */}
              {highlight.technicalSpecs && (
                <div className="bg-concrete-900 text-white p-6 rounded-xl">
                  <h4 className="text-lg font-bold mb-4 flex items-center text-wood-400">
                    <CheckCircle2 size={20} className="mr-2" />
                    技术指标
                  </h4>
                  <ul className="space-y-4">
                    {Object.entries(highlight.technicalSpecs).map(([key, value]) => (
                      <li key={key}>
                        <span className="block text-xs text-concrete-400 uppercase tracking-wider mb-1">{key}</span>
                        <span className="text-sm font-medium text-concrete-100">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightDetail;