import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Leaf,
  Target,
  Image,
  Gift,
  Wallet,
  ArrowRight,
  Users,
  TrendingUp,
  Globe,
  Shield,
} from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Target,
      title: t('home.features.missions.title'),
      description: t('home.features.missions.description'),
    },
    {
      icon: Image,
      title: t('home.features.nft.title'),
      description: t('home.features.nft.description'),
    },
    {
      icon: Gift,
      title: t('home.features.points.title'),
      description: t('home.features.points.description'),
    },
    {
      icon: Wallet,
      title: t('home.features.wallet.title'),
      description: t('home.features.wallet.description'),
    },
  ];

  const stats = [
    { label: t('home.stats.activeUsers'), value: '10,000+', icon: Users },
    { label: t('home.stats.completedMissions'), value: '50,000+', icon: Target },
    { label: t('home.stats.carbonOffset'), value: '1000+ ton', icon: TrendingUp },
    { label: t('home.stats.nftsMinted'), value: '25,000+', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-earth-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-carbon-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="carboncare logo" className="w-12 h-12" />
              <span className="text-xl font-bold text-gradient">carboncare</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-carbon-600 hover:text-carbon-900 transition-colors"
              >
                {t('common.login')}
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                {t('common.register')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-carbon-900 mb-6">
                {t('home.hero.title')}{' '}
                <span className="text-gradient">{t('home.hero.highlight')}</span>
              </h1>
              <p className="text-xl text-carbon-600 mb-8 max-w-3xl mx-auto">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                >
                  <span>{t('home.hero.ctaPrimary')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn-outline text-lg px-8 py-3"
                >
                  {t('home.hero.ctaSecondary')}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-primary-200 rounded-full opacity-20"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-16 h-16 bg-earth-200 rounded-full opacity-20"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-12 h-12 bg-primary-300 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-full">
                    <stat.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-carbon-900 mb-2">{stat.value}</div>
                <div className="text-carbon-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-carbon-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-carbon-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-carbon-600 max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary-100 rounded-full">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-carbon-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-carbon-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              {t('home.cta.subtitle')}
            </p>
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-carbon-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>{t('home.cta.button')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-carbon-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="carboncare logo" className="w-6 h-6" />
                <span className="text-xl font-bold">carboncare</span>
              </div>
              <p className="text-carbon-400">
                {t('home.footer.description')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('home.footer.platform.title')}</h3>
              <ul className="space-y-2 text-carbon-400">
                <li><Link to="/missions" className="hover:text-white transition-colors">{t('common.missions')}</Link></li>
                <li><Link to="/nfts" className="hover:text-white transition-colors">{t('common.nftGallery')}</Link></li>
                <li><Link to="/rewards" className="hover:text-white transition-colors">{t('common.rewards')}</Link></li>
                <li><Link to="/wallet" className="hover:text-white transition-colors">{t('common.wallet')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('home.footer.support.title')}</h3>
              <ul className="space-y-2 text-carbon-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('home.footer.support.helpCenter')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('home.footer.support.contactUs')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('home.footer.support.faq')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('home.footer.legal.title')}</h3>
              <ul className="space-y-2 text-carbon-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('home.footer.legal.privacyPolicy')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('home.footer.legal.termsOfService')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('home.footer.legal.cookiePolicy')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-carbon-800 mt-8 pt-8 text-center text-carbon-400">
            <p>&copy; 2024 carboncare. {t('home.footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 