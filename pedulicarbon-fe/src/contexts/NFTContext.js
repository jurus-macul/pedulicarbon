import React, { createContext, useContext, useReducer } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import api from '../services/api';

const NFTContext = createContext();

const initialState = {
  userNFTs: [],
  loading: false,
  error: null,
};

const nftReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER_NFTS':
      return { ...state, userNFTs: action.payload };
    case 'ADD_USER_NFT':
      return { ...state, userNFTs: [...state.userNFTs, action.payload] };
    case 'UPDATE_USER_NFT':
      return {
        ...state,
        userNFTs: state.userNFTs.map(nft =>
          nft.id === action.payload.id ? action.payload : nft
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

export const NFTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(nftReducer, initialState);
  const queryClient = useQueryClient();

  // Fetch user NFTs
  const { data: userNFTs = [], isLoading: userNFTsLoading } = useQuery(
    'userNFTs',
    async () => {
      const response = await api.get(`/users/${localStorage.getItem('userId')}/nfts`);
      dispatch({ type: 'SET_USER_NFTS', payload: response.data });
      return response.data;
    },
    {
      enabled: !!localStorage.getItem('userId'),
      onError: (error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        toast.error('Gagal memuat NFTs');
      },
    }
  );

  // Claim NFT mutation
  const claimNFTMutation = useMutation(
    async (nftId) => {
      const response = await api.post(`/nfts/${nftId}/claim`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        dispatch({ type: 'UPDATE_USER_NFT', payload: data });
        queryClient.invalidateQueries('userNFTs');
        toast.success('NFT berhasil di-claim!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal claim NFT');
      },
    }
  );

  const claimNFT = (nftId) => {
    claimNFTMutation.mutate(nftId);
  };

  const value = {
    ...state,
    userNFTs,
    userNFTsLoading,
    claimNFT,
    isClaimingNFT: claimNFTMutation.isLoading,
  };

  return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
};

export const useNFT = () => {
  const context = useContext(NFTContext);
  if (!context) {
    throw new Error('useNFT must be used within an NFTProvider');
  }
  return context;
}; 