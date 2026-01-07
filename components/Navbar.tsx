import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Menu, X, Settings } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { projectInfo } = useData(); // Use dynamic data

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '项目区位与现场实况', path: '/#location' },
    { name: 'BIM团队架构', path: '/#team' },
    { name: '应用亮点', path: '/#highlights' },
    { name: '应用成效', path: '/#achievements' },
  ];

  // Helper to handle hash scrolling if on home page
  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    if (path.startsWith('/#') && location.pathname === '/') {
      const elementId = path.replace('/#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAdminClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/admin');
  };

  // Common button styles for size and shape
  const commonBtnClass = "flex items-center justify-center px-6 py-2.5 rounded-full text-base md:text-lg font-medium transition-all duration-300";
  
  // Hero state (transparent background) - Glassmorphism for all items (consistent style as requested)
  const heroBtnStyle = "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 shadow-sm";
  
  // Scrolled state (white background)
  // Links become clean pill buttons, Management button remains prominent
  const scrolledLinkStyle = "text-concrete-700 hover:bg-concrete-100 hover:text-wood-600"; 
  const scrolledMgmtStyle = "bg-wood-600 text-white hover:bg-wood-700 shadow-md";

  // Check if we are on the admin page to adjust navbar style always to "scrolled" look (solid background)
  const isAdmin = location.pathname.startsWith('/admin');
  const forceSolidNav = isAdmin || isScrolled;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${forceSolidNav ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-concrete-200 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          {projectInfo.logoUrl ? (
            <img 
              src={projectInfo.logoUrl} 
              alt="Logo" 
              className="h-12 w-12 object-contain rounded-lg bg-white/10 backdrop-blur-sm p-0.5" 
            />
          ) : (
            <div className={`p-2.5 rounded-lg transition-colors ${forceSolidNav ? 'bg-wood-600 text-white' : 'bg-white text-wood-600'}`}>
              <Building2 size={28} />
            </div>
          )}
          
          <span className={`text-2xl font-bold tracking-tight transition-colors ${forceSolidNav ? 'text-concrete-800' : 'text-white drop-shadow-md'}`}>
            {projectInfo.navTitle}<span className="font-light">{projectInfo.navSubtitle}</span>
          </span>
        </Link>

        {/* Desktop Nav - Hidden on mobile/tablet, visible on large screens */}
        <div className="hidden lg:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => handleNavClick(link.path)}
              className={`${commonBtnClass} ${forceSolidNav ? scrolledLinkStyle : heroBtnStyle}`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Management Entry */}
          <button 
            className={`${commonBtnClass} gap-2 ml-2 ${forceSolidNav ? scrolledMgmtStyle : heroBtnStyle}`}
            onClick={handleAdminClick}
          >
            <Settings size={20} />
            <span>管理后台</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-wood-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} className={!forceSolidNav ? "text-white" : ""} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-concrete-200 shadow-lg py-6 px-6 flex flex-col space-y-4 animate-in slide-in-from-top-5 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => handleNavClick(link.path)}
              className="text-concrete-800 font-medium text-lg py-3 border-b border-concrete-100 last:border-0 hover:text-wood-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={handleAdminClick}
            className="flex items-center gap-3 text-wood-600 font-medium text-lg py-3 text-left hover:text-wood-700 transition-colors"
          >
            <Settings size={22} />
            <span>管理后台</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;