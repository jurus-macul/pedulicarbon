import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
  Settings,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  LogOut,
  Award,
  Target,
  Image as ImageIcon,
  Gift,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const stats = [
    {
      label: t('profile.totalPoints'),
      value: user?.points || 0,
      icon: Award,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      label: t('profile.completedMissions'),
      value: 12,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: t('profile.totalNFTs'),
      value: 8,
      icon: ImageIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: t('profile.redeemedRewards'),
      value: 5,
      icon: Gift,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-carbon-900 mb-2">{t('profile.title')}</h1>
        <p className="text-carbon-600">
          {t('profile.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-lg font-semibold text-carbon-900">{t('profile.personalInfo')}</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <Edit className="w-4 h-4" />
                  <span>{t('profile.edit')}</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                        <span>{t('profile.saving')}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{t('profile.save')}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 text-carbon-600 hover:text-carbon-700"
                  >
                    <X className="w-4 h-4" />
                    <span>{t('profile.cancel')}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md">
                      <Camera className="w-4 h-4 text-carbon-600" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-carbon-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-carbon-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder={t('profile.namePlaceholder')}
                      />
                    ) : (
                      formData.name
                    )}
                  </h3>
                  <p className="text-carbon-600">{t('profile.memberSince')} {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US')}</p>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-carbon-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    {t('profile.email')}
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-carbon-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={t('profile.emailPlaceholder')}
                    />
                  ) : (
                    <p className="text-carbon-900">{formData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-carbon-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    {t('profile.location')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-carbon-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={t('profile.locationPlaceholder')}
                    />
                  ) : (
                    <p className="text-carbon-900">{formData.location || t('profile.notSpecified')}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-carbon-700 mb-2">
                  {t('profile.bio')}
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-carbon-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={t('profile.bioPlaceholder')}
                  />
                ) : (
                  <p className="text-carbon-900">{formData.bio || t('profile.noBio')}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-carbon-900 mb-4">{t('profile.statistics')}</h3>
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-carbon-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <span className="text-sm text-carbon-600">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-carbon-900">{stat.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold text-carbon-900 mb-4">{t('profile.settings')}</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-carbon-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-carbon-600" />
                  <span className="text-carbon-700">{t('profile.language')}</span>
                </div>
                <span className="text-sm text-carbon-500">English</span>
              </button>

              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-carbon-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Sun className="w-4 h-4 text-carbon-600" />
                  <span className="text-carbon-700">{t('profile.theme')}</span>
                </div>
                <span className="text-sm text-carbon-500">Light</span>
              </button>

              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-carbon-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-carbon-600" />
                  <span className="text-carbon-700">{t('profile.notifications')}</span>
                </div>
                <span className="text-sm text-carbon-500">On</span>
              </button>

              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-carbon-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-carbon-600" />
                  <span className="text-carbon-700">{t('profile.privacy')}</span>
                </div>
                <span className="text-sm text-carbon-500">Public</span>
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="card">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('profile.logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 