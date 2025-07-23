import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Image,
  Gift,
  Wallet,
  Leaf,
  Calendar,
  Award,
  Users,
  Activity,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMission } from '../contexts/MissionContext';
import { useNFT } from '../contexts/NFTContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { userMissions, missionsLoading } = useMission();
  const { userNFTs, userNFTsLoading } = useNFT();

  // Mock data for charts
  const carbonFootprintData = [
    { name: 'Jan', carbon: 120 },
    { name: 'Feb', carbon: 110 },
    { name: 'Mar', carbon: 95 },
    { name: 'Apr', carbon: 85 },
    { name: 'May', carbon: 75 },
    { name: 'Jun', carbon: 65 },
  ];

  const missionProgressData = [
    { name: t('dashboard.completed'), value: 12, color: '#22c55e' },
    { name: t('dashboard.inProgress'), value: 5, color: '#f59e0b' },
    { name: t('missions.available'), value: 8, color: '#6b7280' },
  ];

  const stats = [
    {
      title: t('dashboard.totalPoints'),
      value: user?.points || 0,
      icon: Gift,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: t('dashboard.completedMissions'),
      value: userMissions.filter(m => m.status === 'completed').length,
      icon: Target,
      color: 'text-earth-600',
      bgColor: 'bg-earth-100',
    },
    {
      title: t('dashboard.totalNFTs'),
      value: userNFTs.length,
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: t('dashboard.carbonOffset'),
      value: `${(user?.points || 0) * 0.1} kg`,
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  const recentMissions = userMissions.slice(0, 5);
  const recentNFTs = userNFTs.slice(0, 3);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return t('dashboard.completed');
      case 'in_progress':
        return t('dashboard.inProgress');
      default:
        return t('dashboard.waiting');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-2">
            {t('dashboard.welcomeBack')}, {user?.name || 'User'}! 🌱
          </h1>
          <p className="text-primary-100">
            {t('dashboard.continueJourney')}
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-carbon-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-carbon-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carbon Footprint Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-carbon-900">{t('dashboard.carbonFootprintTrend')}</h3>
            <TrendingUp className="w-5 h-5 text-primary-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={carbonFootprintData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="carbon"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Mission Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-carbon-900">{t('dashboard.missionProgress')}</h3>
            <Target className="w-5 h-5 text-earth-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={missionProgressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {missionProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {missionProgressData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-carbon-600">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Missions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-carbon-900">{t('dashboard.recentMissions')}</h3>
            <Link
              to="/missions"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>{t('dashboard.viewAll')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {missionsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : recentMissions.length > 0 ? (
              recentMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="flex items-center justify-between p-3 bg-carbon-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(mission.status)}
                    <div>
                      <p className="font-medium text-carbon-900">{mission.title}</p>
                      <p className="text-sm text-carbon-600">{getStatusText(mission.status)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary-600">{mission.points} pts</p>
                    <p className="text-xs text-carbon-500">
                      {new Date(mission.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-carbon-500">
                <Target className="w-12 h-12 mx-auto mb-2 text-carbon-300" />
                <p>{t('dashboard.noMissionsYet')}</p>
                <Link
                  to="/missions"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('dashboard.startFirstMission')}
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent NFTs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-carbon-900">{t('dashboard.recentNFTs')}</h3>
            <Link
              to="/nfts"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>{t('dashboard.viewAll')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {userNFTsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : recentNFTs.length > 0 ? (
              recentNFTs.map((nft) => (
                <div
                  key={nft.id}
                  className="flex items-center justify-between p-3 bg-carbon-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Image className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-medium text-carbon-900">{nft.name}</p>
                      <p className="text-sm text-carbon-600">{nft.rarity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary-600">{nft.points} pts</p>
                    <p className="text-xs text-carbon-500">
                      {new Date(nft.minted_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-carbon-500">
                <Image className="w-12 h-12 mx-auto mb-2 text-carbon-300" />
                <p>{t('nftGallery.subtitle')}</p>
                <Link
                  to="/nfts"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('dashboard.viewAll')}
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-carbon-900 mb-4">{t('dashboard.quickActions')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/missions"
            className="flex items-center space-x-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200"
          >
            <Target className="w-6 h-6 text-primary-600" />
            <span className="font-medium text-carbon-900">{t('dashboard.browseMissions')}</span>
          </Link>
          <Link
            to="/rewards"
            className="flex items-center space-x-3 p-4 bg-earth-50 hover:bg-earth-100 rounded-lg transition-colors duration-200"
          >
            <Gift className="w-6 h-6 text-earth-600" />
            <span className="font-medium text-carbon-900">{t('dashboard.redeemRewards')}</span>
          </Link>
          <Link
            to="/wallet"
            className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
          >
            <Wallet className="w-6 h-6 text-purple-600" />
            <span className="font-medium text-carbon-900">{t('dashboard.viewWallet')}</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 