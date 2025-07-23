import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target,
  Clock,
  CheckCircle,
  Star,
  Filter,
  Search,
  MapPin,
  Calendar,
  Award,
  ArrowRight,
  Loader2,
  Leaf,
  Recycle as RecycleIcon,
  Users,
} from 'lucide-react';
import { useMission } from '../contexts/MissionContext';
import { useTranslation } from 'react-i18next';

const Missions = () => {
  const { t } = useTranslation();
  const { missions, userMissions, takeMission, isTakingMission, missionsLoading } = useMission();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-carbon-100 text-carbon-800';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return t('missions.easy');
      case 'medium':
        return t('missions.medium');
      case 'hard':
        return t('missions.hard');
      default:
        return t('missions.unknown');
    }
  };

  const getStatusBadge = (missionId) => {
    const userMission = userMissions.find(um => um.mission_id === missionId);
    if (!userMission) return null;

    switch (userMission.status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('dashboard.completed')}
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            {t('dashboard.inProgress')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-carbon-100 text-carbon-800">
            <Clock className="w-3 h-3 mr-1" />
            {t('dashboard.waiting')}
          </span>
        );
    }
  };

  const isMissionTaken = (missionId) => {
    return userMissions.some(um => um.mission_id === missionId);
  };

  const filteredMissions = (Array.isArray(missions) ? missions : []).filter(mission => {
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'taken' && isMissionTaken(mission.id)) ||
                         (filterStatus === 'available' && !isMissionTaken(mission.id));
    
    const matchesDifficulty = filterDifficulty === 'all' || mission.difficulty === filterDifficulty;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const handleTakeMission = (missionId) => {
    takeMission(missionId);
  };

  if (missionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-carbon-600">{t('missions.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-carbon-900 mb-2">{t('missions.title')}</h1>
          <p className="text-carbon-600">
            {t('missions.subtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">
              {userMissions.filter(m => m.status === 'completed').length} {t('dashboard.completed')}
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
                placeholder={t('missions.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-carbon-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-carbon-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-carbon-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">{t('missions.allStatus')}</option>
              <option value="available">{t('missions.available')}</option>
              <option value="taken">{t('missions.taken')}</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2 border border-carbon-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">{t('missions.allDifficulty')}</option>
              <option value="easy">{t('missions.easy')}</option>
              <option value="medium">{t('missions.medium')}</option>
              <option value="hard">{t('missions.hard')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mission-card group"
          >
            {/* Mission Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-carbon-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {mission.title}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mission.difficulty)}`}>
                    {getDifficultyText(mission.difficulty)}
                  </span>
                  {getStatusBadge(mission.id)}
                </div>
              </div>
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{mission.points}</span>
              </div>
            </div>

            {/* Mission Description */}
            <p className="text-carbon-600 mb-4 line-clamp-3">
              {mission.description}
            </p>

            {/* Mission Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-carbon-500">
                <MapPin className="w-4 h-4" />
                <span>{mission.location || t('missions.flexibleLocation')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-carbon-500">
                <Calendar className="w-4 h-4" />
                <span>{t('missions.duration')}: {mission.duration || t('missions.defaultDuration')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-carbon-500">
                <Award className="w-4 h-4" />
                <span>{t('missions.reward')}: {mission.asset_type} {mission.asset_amount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              {isMissionTaken(mission.id) ? (
                <Link
                  to={`/missions/${mission.id}`}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>{t('missions.viewDetails')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => handleTakeMission(mission.id)}
                  disabled={isTakingMission}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isTakingMission ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('missions.processing')}</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      <span>{t('missions.takeMission')}</span>
                    </>
                  )}
                </button>
              )}
              <div className="text-right">
                <p className="text-sm text-carbon-500">{t('missions.points')}</p>
                <p className="text-lg font-bold text-primary-600">{mission.points}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMissions.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-carbon-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-carbon-900 mb-2">
            {t('missions.noMissionsFound')}
          </h3>
          <p className="text-carbon-600 mb-4">
            {t('missions.tryAdjustingFilters')}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterDifficulty('all');
            }}
            className="btn-secondary"
          >
            {t('missions.resetFilter')}
          </button>
        </div>
      )}

      {/* Mission Categories */}
      <div className="card">
        <h3 className="text-lg font-semibold text-carbon-900 mb-4">{t('missions.missionCategories')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <Leaf className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-medium text-carbon-900">{t('missions.ecoFriendly')}</h4>
              <p className="text-sm text-carbon-600">{t('missions.ecoFriendlyDesc')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <RecycleIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h4 className="font-medium text-carbon-900">{t('missions.recycling')}</h4>
              <p className="text-sm text-carbon-600">{t('missions.recyclingDesc')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
            <Users className="w-8 h-8 text-purple-600" />
            <div>
              <h4 className="font-medium text-carbon-900">{t('missions.community')}</h4>
              <p className="text-sm text-carbon-600">{t('missions.communityDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missions; 