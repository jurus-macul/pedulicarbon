import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-earth-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-earth-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-6xl font-bold text-carbon-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-carbon-800 mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-carbon-600 mb-8">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn-outline inline-flex items-center space-x-2 w-full justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back to Previous Page</span>
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-8 border-t border-carbon-200">
            <p className="text-sm text-carbon-500 mb-4">
              Atau coba halaman populer ini:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                to="/missions"
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                Missions
              </Link>
              <span className="text-carbon-300">•</span>
              <Link
                to="/nfts"
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                NFT Gallery
              </Link>
              <span className="text-carbon-300">•</span>
              <Link
                to="/rewards"
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                Rewards
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound; 