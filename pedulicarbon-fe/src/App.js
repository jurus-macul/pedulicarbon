import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { MissionProvider } from './contexts/MissionContext';
import { NFTProvider } from './contexts/NFTContext';
import { validateEnvironment } from './utils/envValidation';
import config from './config';

// Import i18n configuration
import './i18n';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import MissionDetail from './pages/MissionDetail';
import NFTGallery from './pages/NFTGallery';
import Rewards from './pages/Rewards';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // Validate environment variables on app startup
  useEffect(() => {
    try {
      validateEnvironment();
      
      if (config.features.debugMode) {
        console.log('🔧 Debug mode enabled');
        console.log('📊 App configuration:', config);
      }
    } catch (error) {
      console.error('App initialization error:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <MissionProvider>
              <NFTProvider>
                <div className="App">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/missions" element={
                    <ProtectedRoute>
                      <Layout>
                        <Missions />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/missions/:id" element={
                    <ProtectedRoute>
                      <Layout>
                        <MissionDetail />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/nfts" element={
                    <ProtectedRoute>
                      <Layout>
                        <NFTGallery />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/rewards" element={
                    <ProtectedRoute>
                      <Layout>
                        <Rewards />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/wallet" element={
                    <ProtectedRoute>
                      <Layout>
                        <Wallet />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#22c55e',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </NFTProvider>
          </MissionProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App; 