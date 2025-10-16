import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

interface RegistrationForm {
  email: string;
  name: string;
  phone: string;
}

export function UserRegistration() {
  const [form, setForm] = useState<RegistrationForm>({
    email: '',
    name: '',
    phone: ''
  });
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserRegistration();
  }, []);

  const checkUserRegistration = async () => {
    try {
      const eth = (window as any).ethereum;
      if (!eth) {
        setError('MetaMask is not installed. Please install MetaMask to continue.');
        return;
      }

      const provider = new ethers.BrowserProvider(eth);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      // Check if user is already registered
      const baseURL = (import.meta.env.VITE_BACKEND_URL || 'https://chainid.onrender.com').replace(/\/$/, '');
      const response = await fetch(`${baseURL}/api/user/${address}`);
      const data = await response.json();
      
      if (data.success && data.user) {
        // User is already registered, redirect to dashboard
        setSuccess('You are already registered! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 2000);
      }
    } catch (error: any) {
      // User not registered or other error, continue with registration
      console.log('User not registered, continuing with registration process');
    }
  };

  const connectWallet = async () => {
    try {
      const eth = (window as any).ethereum;
      if (!eth) {
        setError('MetaMask is not installed. Please install MetaMask to continue.');
        return;
      }

      const provider = new ethers.BrowserProvider(eth);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } catch (error: any) {
      setError('Failed to connect wallet: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!walletAddress) {
        throw new Error('Please connect your wallet first');
      }

      const baseURL = (import.meta.env.VITE_BACKEND_URL || 'https://chainid.onrender.com').replace(/\/$/, '');
      const response = await fetch(`${baseURL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          email: form.email,
          name: form.name,
          phone: form.phone || undefined
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Registration successful! You can now use the user dashboard.');
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-700/40">
              <span className="text-white font-bold text-2xl">👤</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">User Registration</h1>
            <p className="text-slate-300">Create your IdentiChain account</p>
          </div>

          {/* Wallet Status */}
          {walletAddress ? (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-200 text-sm">Wallet Connected</span>
              </div>
              <p className="text-green-300 text-xs mt-1 font-mono">{walletAddress}</p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-200 text-sm">Wallet Not Connected</span>
              </div>
              <button
                onClick={connectWallet}
                className="mt-2 text-red-300 hover:text-red-200 text-sm underline"
              >
                Click to connect
              </button>
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-200">
              {success}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                placeholder="+1234567890"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !walletAddress}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isLoading ? 'Registering...' : 'Register Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/user-dashboard')}
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Go to Dashboard
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
