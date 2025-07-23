import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Upload,
  Download,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Wallet = () => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Mock data - replace with actual API calls
  const walletData = {
    balance: 1250.75,
    currency: 'USD',
    totalEarned: 3500.00,
    totalSpent: 2249.25,
  };

  const transactions = [
    {
      id: 1,
      type: 'credit',
      amount: 500,
      description: 'Mission completion reward',
      category: 'mission_reward',
      status: 'completed',
      date: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      type: 'debit',
      amount: 150,
      description: 'NFT purchase',
      category: 'nft_purchase',
      status: 'completed',
      date: '2024-01-14T15:45:00Z',
    },
    {
      id: 3,
      type: 'credit',
      amount: 300,
      description: 'Referral bonus',
      category: 'referral',
      status: 'pending',
      date: '2024-01-13T09:20:00Z',
    },
  ];

  const getTransactionIcon = (category) => {
    switch (category) {
      case 'mission_reward':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'nft_purchase':
        return <Download className="w-4 h-4 text-red-600" />;
      case 'referral':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default:
        return <TrendingUp className="w-4 h-4 text-carbon-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-carbon-100 text-carbon-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <TrendingUp className="w-3 h-3" />;
      case 'pending':
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case 'failed':
        return <X className="w-3 h-3" />;
      default:
        return <Loader2 className="w-3 h-3" />;
    }
  };

  const handleWithdraw = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  const handleDeposit = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-carbon-900 mb-2">{t('wallet.title')}</h1>
        <p className="text-carbon-600">
          {t('wallet.subtitle')}
        </p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-carbon-900">{t('wallet.balance')}</h3>
            <TrendingUp className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {walletData.currency} {walletData.balance.toLocaleString()}
          </div>
          <p className="text-carbon-600 text-sm">{t('wallet.availableBalance')}</p>
        </motion.div>

        {/* Total Earned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-carbon-900">{t('wallet.totalEarned')}</h3>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {walletData.currency} {walletData.totalEarned.toLocaleString()}
          </div>
          <p className="text-carbon-600 text-sm">{t('wallet.lifetimeEarnings')}</p>
        </motion.div>

        {/* Total Spent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-carbon-900">{t('wallet.totalSpent')}</h3>
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">
            {walletData.currency} {walletData.totalSpent.toLocaleString()}
          </div>
          <p className="text-carbon-600 text-sm">{t('wallet.lifetimeSpending')}</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-carbon-900 mb-4">{t('wallet.quickActions')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleDeposit}
            disabled={isProcessing}
            className="flex items-center justify-center space-x-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin text-green-600" />
            ) : (
              <Upload className="w-5 h-5 text-green-600" />
            )}
            <span className="font-medium text-green-700">{t('wallet.deposit')}</span>
          </button>

          <button
            onClick={handleWithdraw}
            disabled={isProcessing}
            className="flex items-center justify-center space-x-2 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin text-red-600" />
            ) : (
              <Download className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium text-red-700">{t('wallet.withdraw')}</span>
          </button>

          <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-700">{t('wallet.addPaymentMethod')}</span>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-carbon-900">{t('wallet.recentTransactions')}</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            {t('wallet.viewAll')}
          </button>
        </div>

        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-carbon-50 rounded-lg hover:bg-carbon-100 transition-colors duration-200 cursor-pointer"
              onClick={() => setSelectedTransaction(transaction)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'credit' ? (
                    <ArrowUpRight className={`w-4 h-4 ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-carbon-900">{transaction.description}</p>
                  <p className="text-sm text-carbon-500">
                    {new Date(transaction.date).toLocaleDateString('en-US')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}{walletData.currency} {transaction.amount.toLocaleString()}
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {getStatusIcon(transaction.status)}
                  <span className="ml-1 capitalize">{transaction.status}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Transaction Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-carbon-900">{t('wallet.transactionDetails')}</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-carbon-400 hover:text-carbon-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-carbon-600">{t('wallet.amount')}:</span>
                  <span className={`font-semibold ${
                    selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedTransaction.type === 'credit' ? '+' : '-'}{walletData.currency} {selectedTransaction.amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-carbon-600">{t('wallet.type')}:</span>
                  <span className="font-medium capitalize">{selectedTransaction.type}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-carbon-600">{t('wallet.category')}:</span>
                  <span className="font-medium capitalize">{selectedTransaction.category.replace('_', ' ')}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-carbon-600">{t('wallet.status')}:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                    {getStatusIcon(selectedTransaction.status)}
                    <span className="ml-1 capitalize">{selectedTransaction.status}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-carbon-600">{t('wallet.date')}:</span>
                  <span className="font-medium">
                    {new Date(selectedTransaction.date).toLocaleString('en-US')}
                  </span>
                </div>

                <div className="pt-4 border-t border-carbon-200">
                  <p className="text-carbon-900 font-medium">{selectedTransaction.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Wallet; 