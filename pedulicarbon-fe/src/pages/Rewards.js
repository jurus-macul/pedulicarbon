import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  Star,
  Award,
  Clock,
  CheckCircle,
  X,
  Loader2,
  Search,
  Filter,
  ShoppingCart,
  Heart,
  Leaf,
  Coffee,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Rewards = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedReward, setSelectedReward] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Mock rewards data - replace with actual API calls
  const rewards = [
    {
      id: 1,
      name: 'Eco-Friendly Water Bottle',
      description: 'Reusable stainless steel water bottle to reduce plastic waste',
      category: 'physical',
      points: 500,
      image: '/rewards/bottle.jpg',
      available: true,
      popular: true,
    },
    {
      id: 2,
      name: 'Plant a Tree Certificate',
      description: 'Certificate for planting a tree in your name',
      category: 'environmental',
      points: 1000,
      image: '/rewards/tree.jpg',
      available: true,
      popular: false,
    },
    {
      id: 3,
      name: 'Coffee Shop Voucher',
      description: '$10 voucher for eco-friendly coffee shops',
      category: 'voucher',
      points: 300,
      image: '/rewards/coffee.jpg',
      available: true,
      popular: true,
    },
    {
      id: 4,
      name: 'E-Book: Sustainable Living',
      description: 'Digital guide to sustainable living practices',
      category: 'digital',
      points: 200,
      image: '/rewards/ebook.jpg',
      available: true,
      popular: false,
    },
    {
      id: 5,
      name: 'Carbon Offset Credits',
      description: 'Purchase carbon offset credits for your footprint',
      category: 'environmental',
      points: 800,
      image: '/rewards/carbon.jpg',
      available: true,
      popular: true,
    },
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'physical':
        return <Gift className="w-4 h-4" />;
      case 'environmental':
        return <Leaf className="w-4 h-4" />;
      case 'voucher':
        return <ShoppingCart className="w-4 h-4" />;
      case 'digital':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'physical':
        return 'bg-blue-100 text-blue-800';
      case 'environmental':
        return 'bg-green-100 text-green-800';
      case 'voucher':
        return 'bg-purple-100 text-purple-800';
      case 'digital':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-carbon-100 text-carbon-800';
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'physical':
        return t('rewards.physical');
      case 'environmental':
        return t('rewards.environmental');
      case 'voucher':
        return t('rewards.voucher');
      case 'digital':
        return t('rewards.digital');
      default:
        return t('rewards.other');
    }
  };

  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || reward.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRedeem = async (rewardId) => {
    setIsRedeeming(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRedeeming(false);
    setSelectedReward(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-carbon-900 mb-2">{t('rewards.title')}</h1>
          <p className="text-carbon-600">
            {t('rewards.subtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">
              {user?.points || 0} {t('rewards.availablePoints')}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-carbon-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('rewards.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-carbon-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-carbon-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-carbon-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">{t('rewards.allCategories')}</option>
              <option value="physical">{t('rewards.physical')}</option>
              <option value="environmental">{t('rewards.environmental')}</option>
              <option value="voucher">{t('rewards.voucher')}</option>
              <option value="digital">{t('rewards.digital')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward, index) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="reward-card group"
          >
            {/* Reward Image */}
            <div className="relative overflow-hidden rounded-lg mb-4">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-earth-100 flex items-center justify-center">
                <Gift className="w-16 h-16 text-primary-600" />
              </div>
              {reward.popular && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    {t('rewards.popular')}
                  </span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(reward.category)}`}>
                  {getCategoryIcon(reward.category)}
                  <span className="ml-1">{getCategoryText(reward.category)}</span>
                </span>
              </div>
            </div>

            {/* Reward Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-carbon-900 group-hover:text-primary-600 transition-colors">
                {reward.name}
              </h3>
              <p className="text-sm text-carbon-600 line-clamp-2">
                {reward.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-carbon-500">
                  {t('rewards.pointsRequired')}
                </span>
                <span className="text-sm font-medium text-primary-600">
                  {reward.points} pts
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setSelectedReward(reward)}
              disabled={!reward.available || (user?.points || 0) < reward.points}
              className={`w-full mt-3 btn-primary flex items-center justify-center space-x-2 ${
                !reward.available || (user?.points || 0) < reward.points
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>
                {!reward.available
                  ? t('rewards.unavailable')
                  : (user?.points || 0) < reward.points
                  ? t('rewards.insufficientPoints')
                  : t('rewards.redeem')}
              </span>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-carbon-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-carbon-900 mb-2">
            {t('rewards.noRewardsFound')}
          </h3>
          <p className="text-carbon-600 mb-4">
            {t('rewards.tryAdjustingFilters')}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('all');
            }}
            className="btn-secondary"
          >
            {t('rewards.resetFilter')}
          </button>
        </div>
      )}

      {/* Reward Detail Modal */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-carbon-900">{selectedReward.name}</h2>
                <button
                  onClick={() => setSelectedReward(null)}
                  className="text-carbon-400 hover:text-carbon-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Reward Image */}
                <div className="relative overflow-hidden rounded-lg">
                  <div className="aspect-square bg-gradient-to-br from-primary-100 to-earth-100 flex items-center justify-center">
                    <Gift className="w-24 h-24 text-primary-600" />
                  </div>
                  {selectedReward.popular && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        {t('rewards.popular')}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedReward.category)}`}>
                      {getCategoryIcon(selectedReward.category)}
                      <span className="ml-1">{getCategoryText(selectedReward.category)}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-carbon-600">{selectedReward.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-carbon-600">{t('rewards.pointsRequired')}:</span>
                    <span className="font-semibold text-primary-600">{selectedReward.points} pts</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-carbon-600">{t('rewards.yourPoints')}:</span>
                    <span className="font-semibold text-carbon-900">{user?.points || 0} pts</span>
                  </div>

                  {selectedReward.available && (user?.points || 0) >= selectedReward.points ? (
                    <button
                      onClick={() => handleRedeem(selectedReward.id)}
                      disabled={isRedeeming}
                      className="w-full btn-primary"
                    >
                      {isRedeeming ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          {t('rewards.redeeming')}
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4 mr-2" />
                          {t('rewards.redeem')}
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-red-600 font-medium">
                        {!selectedReward.available
                          ? t('rewards.unavailable')
                          : t('rewards.insufficientPoints')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Rewards; 