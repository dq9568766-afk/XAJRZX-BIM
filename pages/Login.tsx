import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Building2, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate(from, { replace: true });
    } else {
      setError('访问密码错误，请联系管理员获取权限。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-concrete-100 px-4 relative">
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-6 left-6 flex items-center text-concrete-500 hover:text-wood-600 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> 返回首页
      </Link>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-concrete-200">
        <div className="bg-concrete-900 p-10 text-center relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          <div className="relative z-10">
            <div className="inline-flex p-4 rounded-2xl bg-wood-600 text-white mb-6 shadow-lg shadow-wood-900/50">
              <Building2 size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">管理后台登录</h2>
            <p className="text-concrete-400 mt-2 text-sm font-light">金融岛站周边一体化项目 · 数字中心</p>
          </div>
        </div>

        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-concrete-700 mb-2 uppercase tracking-wide">
                访问密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-concrete-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="block w-full pl-11 pr-4 py-3.5 bg-concrete-50 border border-concrete-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-wood-500 focus:border-wood-500 transition-all text-concrete-900 placeholder-concrete-400"
                  placeholder="请输入管理员密码"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center animate-in fade-in slide-in-from-top-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white bg-wood-600 hover:bg-wood-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wood-500 transition-all transform hover:translate-y-[-1px]"
            >
              验证身份并进入
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};

export default Login;