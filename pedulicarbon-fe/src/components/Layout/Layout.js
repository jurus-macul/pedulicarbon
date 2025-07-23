import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Target,
  Image,
  Gift,
  Wallet,
  User,
  Menu,
  X,
  LogOut,
  Leaf,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const navigation = [
    { name: t('navigation.dashboard'), href: '/dashboard', icon: Home },
    { name: t('navigation.missions'), href: '/missions', icon: Target },
    { name: t('navigation.nftGallery'), href: '/nfts', icon: Image },
    { name: t('navigation.rewards'), href: '/rewards', icon: Gift },
    { name: t('navigation.wallet'), href: '/wallet', icon: Wallet },
    { name: t('navigation.profile'), href: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-carbon-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-carbon-900/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-carbon-200">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="carboncare logo" className="w-12 h-12" />
              <span className="text-xl font-bold text-gradient">carboncare</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-carbon-500 hover:text-carbon-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-carbon-600 hover:bg-carbon-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="space-y-2">
              <LanguageSwitcher />
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-3 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('navigation.logout')}</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-xl">
          <div className="flex items-center p-4 border-b border-carbon-200">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img src="/logo.png" alt="carboncare logo" className="w-12 h-12" />
              <span className="text-xl font-bold text-gradient">carboncare</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-carbon-600 hover:bg-carbon-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-carbon-200">
            <div className="space-y-2">
              <LanguageSwitcher />
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-3 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('navigation.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-carbon-200">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-carbon-500 hover:text-carbon-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="carboncare logo" className="w-12 h-12" />
              <span className="font-bold text-gradient">carboncare</span>
            </div>
            <div className="w-8" />
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 