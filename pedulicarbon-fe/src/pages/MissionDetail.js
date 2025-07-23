import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target as TargetIcon,
  Clock,
  MapPin,
  Award,
  Users,
  Calendar,
  CheckCircle,
  Upload,
  Send,
  ArrowLeft,
  Loader2,
  Star,
  AlertCircle,
} from 'lucide-react';
import { useMission } from '../contexts/MissionContext';

const MissionDetail = () => {
  const { id } = useParams();
  const { missions, userMissions, submitProof, verifyMission, isSubmittingProof, isVerifyingMission } = useMission();
  const [proofData, setProofData] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Find the mission
  const mission = missions.find(m => m.id === parseInt(id));
  const userMission = userMissions.find(um => um.mission_id === parseInt(id));

  if (!mission) {
    return (
      <div className="text-center py-12">
        <TargetIcon className="w-16 h-16 text-carbon-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-carbon-900 mb-2">Mission not found</h3>
        <p className="text-carbon-600 mb-4">The mission you're looking for doesn't exist.</p>
        <Link to="/missions" className="btn-primary">
          Back to Missions
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-carbon-600 bg-carbon-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

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

  const handleSubmitProof = () => {
    if (proofData.trim() || selectedFile) {
      submitProof(mission.id, {
        text: proofData,
        file: selectedFile,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/missions"
            className="flex items-center space-x-2 text-carbon-600 hover:text-carbon-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Missions</span>
          </Link>
        </div>
        {userMission && (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(userMission.status)}`}>
            {getStatusIcon(userMission.status)}
            <span className="ml-1 capitalize">{userMission.status.replace('_', ' ')}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mission Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-carbon-900 mb-2">{mission.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-carbon-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{mission.location || 'Lokasi fleksibel'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Durasi: {mission.duration || '1-3 hari'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{mission.participants || 0} participants</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">{mission.points}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mission.difficulty)}`}>
                {mission.difficulty?.toUpperCase() || 'MEDIUM'}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {mission.category || 'GENERAL'}
              </span>
            </div>

            <p className="text-carbon-700 leading-relaxed">{mission.description}</p>
          </motion.div>

          {/* Mission Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-carbon-900 mb-4">Requirements</h3>
            <div className="space-y-3">
              {mission.requirements?.map((requirement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-carbon-700">{requirement}</p>
                </div>
              )) || (
                <p className="text-carbon-600">No specific requirements for this mission.</p>
              )}
            </div>
          </motion.div>

          {/* Mission Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-carbon-900 mb-4">How to Complete</h3>
            <div className="space-y-4">
              {mission.steps?.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-carbon-900 mb-1">{step.title}</h4>
                    <p className="text-carbon-600">{step.description}</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-carbon-500">
                  <TargetIcon className="w-12 h-12 mx-auto mb-2 text-carbon-300" />
                  <p>No specific steps provided for this mission.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Submit Proof */}
          {userMission && userMission.status !== 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-carbon-900 mb-4">Submit Proof</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-carbon-700 mb-2">
                    Description of your completion
                  </label>
                  <textarea
                    value={proofData}
                    onChange={(e) => setProofData(e.target.value)}
                    placeholder="Describe how you completed this mission..."
                    className="input-field h-32 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-carbon-700 mb-2">
                    Upload evidence (optional)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx"
                    className="input-field"
                  />
                  <p className="text-xs text-carbon-500 mt-1">
                    Supported formats: JPG, PNG, PDF, DOC (max 5MB)
                  </p>
                </div>

                <button
                  onClick={handleSubmitProof}
                  disabled={isSubmittingProof || (!proofData.trim() && !selectedFile)}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isSubmittingProof ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Proof</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Verification Status */}
          {userMission && userMission.status === 'in_progress' && userMission.proof_data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card bg-yellow-50 border-yellow-200"
            >
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-900">Proof Submitted</h4>
                  <p className="text-yellow-700 text-sm">
                    Your proof has been submitted and is awaiting verification.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mission Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-carbon-900 mb-4">Mission Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-carbon-600">Points Reward</span>
                <span className="font-semibold text-primary-600">{mission.points} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-carbon-600">Difficulty</span>
                <span className={`font-semibold ${getDifficultyColor(mission.difficulty).replace('bg-', 'text-').replace('-100', '-800')}`}>
                  {mission.difficulty?.toUpperCase() || 'MEDIUM'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-carbon-600">Category</span>
                <span className="font-semibold text-carbon-900">{mission.category || 'General'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-carbon-600">Duration</span>
                <span className="font-semibold text-carbon-900">{mission.duration || '1-3 days'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-carbon-600">Participants</span>
                <span className="font-semibold text-carbon-900">{mission.participants || 0}</span>
              </div>
            </div>
          </motion.div>

          {/* Rewards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-br from-primary-50 to-earth-50 border-primary-200"
          >
            <h3 className="text-lg font-semibold text-carbon-900 mb-4">Rewards</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-carbon-900">{mission.points} Points</p>
                  <p className="text-sm text-carbon-600">Add to your balance</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-carbon-900">Unique NFT</p>
                  <p className="text-sm text-carbon-600">Collectible digital asset</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TargetIcon className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-carbon-900">Achievement</p>
                  <p className="text-sm text-carbon-600">Unlock new badges</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Related Missions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-carbon-900 mb-4">Related Missions</h3>
            <div className="space-y-3">
              {missions
                .filter(m => m.id !== mission.id && m.category === mission.category)
                .slice(0, 3)
                .map((relatedMission) => (
                  <Link
                    key={relatedMission.id}
                    to={`/missions/${relatedMission.id}`}
                    className="block p-3 bg-carbon-50 rounded-lg hover:bg-carbon-100 transition-colors"
                  >
                    <h4 className="font-medium text-carbon-900 mb-1">{relatedMission.title}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-carbon-600">{relatedMission.points} pts</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(relatedMission.difficulty)}`}>
                        {relatedMission.difficulty?.toUpperCase()}
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MissionDetail; 