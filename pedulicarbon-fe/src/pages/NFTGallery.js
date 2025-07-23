import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Image,
  Star,
  Crown,
  Zap,
  Gem,
  Download,
  Eye,
  X,
  Loader2,
  Filter,
  Search,
} from 'lucide-react';
import { useNFT } from '../contexts/NFTContext';
import { useTranslation } from 'react-i18next';

const NFTGallery = () => {
  const { t } = useTranslation();
  const { userNFTs, userNFTsLoading, claimNFT, isClaimingNFT } = useNFT();
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('all');

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800';
      case 'rare':
        return 'bg-blue-100 text-blue-800';
      case 'epic':
        return 'bg-purple-100 text-purple-800';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'common':
        return <Star className="w-3 h-3" />;
      case 'rare':
        return <Gem className="w-3 h-3" />;
      case 'epic':
        return <Zap className="w-3 h-3" />;
      case 'legendary':
        return <Crown className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  const getRarityText = (rarity) => {
    switch (rarity) {
      case 'common':
        return t('nftGallery.common');
      case 'rare':
        return t('nftGallery.rare');
      case 'epic':
        return t('nftGallery.epic');
      case 'legendary':
        return t('nftGallery.legendary');
      default:
        return t('nftGallery.common');
    }
  };

  const handleClaimNFT = async (nftId) => {
    await claimNFT(nftId);
  };

  const filteredNFTs = userNFTs.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'all' || nft.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  if (userNFTsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-carbon-600">{t('nftGallery.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-carbon-900 mb-2">{t('nftGallery.title')}</h1>
          <p className="text-carbon-600">
            {t('nftGallery.subtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
            <Image className="w-4 h-4" />
            <span className="text-sm font-medium">
              {userNFTs.length} {t('nftGallery.collected')}
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
                placeholder={t('nftGallery.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-carbon-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Rarity Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-carbon-500" />
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="px-3 py-2 border border-carbon-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">{t('nftGallery.allRarities')}</option>
              <option value="common">{t('nftGallery.common')}</option>
              <option value="rare">{t('nftGallery.rare')}</option>
              <option value="epic">{t('nftGallery.epic')}</option>
              <option value="legendary">{t('nftGallery.legendary')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* NFTs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNFTs.map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="nft-card group cursor-pointer"
            onClick={() => setSelectedNFT(nft)}
          >
            {/* NFT Image */}
            <div className="relative overflow-hidden rounded-lg mb-4">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-earth-100 flex items-center justify-center">
                <Image className="w-16 h-16 text-primary-600" />
              </div>
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(nft.rarity)}`}>
                  {getRarityIcon(nft.rarity)}
                  <span className="ml-1">{getRarityText(nft.rarity)}</span>
                </span>
              </div>
              {nft.status === 'claimed' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-medium">{t('nftGallery.claimed')}</span>
                </div>
              )}
            </div>

            {/* NFT Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-carbon-900 group-hover:text-primary-600 transition-colors">
                {nft.name}
              </h3>
              <p className="text-sm text-carbon-600 line-clamp-2">
                {nft.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-carbon-500">
                  {t('nftGallery.minted')}: {new Date(nft.minted_at).toLocaleDateString('en-US')}
                </span>
                <span className="text-sm font-medium text-primary-600">
                  {nft.points} pts
                </span>
              </div>
            </div>

            {/* Action Button */}
            {nft.status !== 'claimed' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClaimNFT(nft.id);
                }}
                disabled={isClaimingNFT}
                className="w-full mt-3 btn-primary flex items-center justify-center space-x-2"
              >
                {isClaimingNFT ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('nftGallery.claiming')}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{t('nftGallery.claimNFT')}</span>
                  </>
                )}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNFTs.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-carbon-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-carbon-900 mb-2">
            {t('nftGallery.noNFTsFound')}
          </h3>
          <p className="text-carbon-600 mb-4">
            {t('nftGallery.completeMissionsToEarn')}
          </p>
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-carbon-900">{selectedNFT.name}</h2>
                <button
                  onClick={() => setSelectedNFT(null)}
                  className="text-carbon-400 hover:text-carbon-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* NFT Image */}
                <div className="relative overflow-hidden rounded-lg">
                  <div className="aspect-square bg-gradient-to-br from-primary-100 to-earth-100 flex items-center justify-center">
                    <Image className="w-24 h-24 text-primary-600" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(selectedNFT.rarity)}`}>
                      {getRarityIcon(selectedNFT.rarity)}
                      <span className="ml-1">{getRarityText(selectedNFT.rarity)}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-carbon-600">{selectedNFT.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(selectedNFT.rarity)}`}>
                      {getRarityIcon(selectedNFT.rarity)}
                      <span className="ml-1">{getRarityText(selectedNFT.rarity)}</span>
                    </span>
                    <span className="text-sm text-carbon-500">
                      {t('nftGallery.minted')}: {new Date(selectedNFT.minted_at).toLocaleDateString('en-US')}
                    </span>
                  </div>

                  {selectedNFT.status !== 'claimed' && (
                    <button
                      onClick={() => {
                        handleClaimNFT(selectedNFT.id);
                        setSelectedNFT(null);
                      }}
                      disabled={isClaimingNFT}
                      className="w-full btn-primary"
                    >
                      {isClaimingNFT ? t('nftGallery.claiming') : t('nftGallery.claimNFT')}
                    </button>
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

export default NFTGallery; 