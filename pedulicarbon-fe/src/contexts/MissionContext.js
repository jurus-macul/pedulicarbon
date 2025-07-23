import React, { createContext, useContext, useReducer } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import api from '../services/api';

const MissionContext = createContext();

const initialState = {
  missions: [],
  userMissions: [],
  loading: false,
  error: null,
};

const missionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MISSIONS':
      return { ...state, missions: action.payload };
    case 'SET_USER_MISSIONS':
      return { ...state, userMissions: action.payload };
    case 'ADD_USER_MISSION':
      return { ...state, userMissions: [...state.userMissions, action.payload] };
    case 'UPDATE_USER_MISSION':
      return {
        ...state,
        userMissions: state.userMissions.map(mission =>
          mission.id === action.payload.id ? action.payload : mission
        ),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const MissionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(missionReducer, initialState);
  const queryClient = useQueryClient();

  // Fetch all missions
  const { data: missions = [], isLoading: missionsLoading } = useQuery(
    'missions',
    async () => {
      const response = await api.get('/missions');
      dispatch({ type: 'SET_MISSIONS', payload: response.data });
      return response.data;
    },
    {
      onError: (error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        toast.error('Gagal memuat missions');
      },
    }
  );

  // Fetch user missions
  const { data: userMissions = [], isLoading: userMissionsLoading } = useQuery(
    'userMissions',
    async () => {
      const response = await api.get(`/users/${localStorage.getItem('userId')}/missions`);
      dispatch({ type: 'SET_USER_MISSIONS', payload: response.data });
      return response.data;
    },
    {
      enabled: !!localStorage.getItem('userId'),
      onError: (error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        toast.error('Gagal memuat user missions');
      },
    }
  );

  // Take mission mutation
  const takeMissionMutation = useMutation(
    async (missionId) => {
      const response = await api.post(`/missions/${missionId}/take`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        dispatch({ type: 'ADD_USER_MISSION', payload: data });
        queryClient.invalidateQueries('userMissions');
        toast.success('Mission berhasil diambil!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal mengambil mission');
      },
    }
  );

  // Submit proof mutation
  const submitProofMutation = useMutation(
    async ({ missionId, proofData }) => {
      const response = await api.post(`/missions/${missionId}/submit-proof`, {
        proof_data: proofData,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        dispatch({ type: 'UPDATE_USER_MISSION', payload: data });
        queryClient.invalidateQueries('userMissions');
        queryClient.invalidateQueries('userNFTs');
        toast.success('Proof berhasil disubmit!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal submit proof');
      },
    }
  );

  // Verify mission mutation
  const verifyMissionMutation = useMutation(
    async (missionId) => {
      const response = await api.post(`/missions/${missionId}/verify`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        dispatch({ type: 'UPDATE_USER_MISSION', payload: data });
        queryClient.invalidateQueries('userMissions');
        queryClient.invalidateQueries('userNFTs');
        toast.success('Mission berhasil diverifikasi!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal verifikasi mission');
      },
    }
  );

  const takeMission = (missionId) => {
    takeMissionMutation.mutate(missionId);
  };

  const submitProof = (missionId, proofData) => {
    submitProofMutation.mutate({ missionId, proofData });
  };

  const verifyMission = (missionId) => {
    verifyMissionMutation.mutate(missionId);
  };

  const value = {
    ...state,
    missions,
    userMissions,
    missionsLoading,
    userMissionsLoading,
    takeMission,
    submitProof,
    verifyMission,
    isTakingMission: takeMissionMutation.isLoading,
    isSubmittingProof: submitProofMutation.isLoading,
    isVerifyingMission: verifyMissionMutation.isLoading,
  };

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
}; 