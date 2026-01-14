import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Play, Maximize2, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const HighlightDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { highlights } = useData();
  const highlight = highlights.find(h => h.id === id);
  const [viewingMedia, setViewingMedia] = useState<{ type: 'image' | 'video', url: string } | null>(null);

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

              {/* Results Gallery (Images & Video) */}
              <section>
                <h3 className="text-2xl font-bold text-concrete-800 mb-6 flex items-center">
                  <span className="w-1.5 h-8 bg-wood-500 rounded-full mr-3"></span>
                  成果展示
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Video Item */}
                  {highlight.videoUrl && (
                    <div
                      className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-64 bg-black"
                      onClick={() => setViewingMedia({ type: 'video', url: highlight.videoUrl! })}
                    >
                      <video src={highlight.videoUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play size={32} className="text-white fill-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded flex items-center backdrop-blur-md">
                        <Maximize2 size={12} className="mr-1" /> 成果演示
                      </div>
                    </div>
                  )}

                  {/* Image Items */}
                  {highlight.images.map((img, index) => (
                    <div
                      key={index}
                      className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-64"
                      onClick={() => setViewingMedia({ type: 'image', url: img })}
                    >
                      <img
                        src={img}
                        alt={"Detail " + index}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 size={32} className="text-white drop-shadow-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Sidebar: Files */}
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

            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Media Modal */}
      {viewingMedia && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setViewingMedia(null)}>
          <button
            onClick={() => setViewingMedia(null)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-[60]"
          >
            <X size={32} />
          </button>

          <div className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            {viewingMedia.type === 'video' ? (
              <video src={viewingMedia.url} controls autoPlay className="max-w-full max-h-[85vh] rounded shadow-2xl outline-none" />
            ) : (
              <img src={viewingMedia.url} alt="Full view" className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HighlightDetail;