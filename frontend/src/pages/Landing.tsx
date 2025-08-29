import React from 'react';
import { motion } from "motion/react";
import { Link } from 'react-router-dom';

// Icon components
const ShieldIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const PersonIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const LockIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

const NetworkIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
  </svg>
);

const LightningIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
  </svg>
);

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-700/40">
                <span className="text-white font-bold text-lg">Ξ</span>
              </div>
              <span className="text-2xl font-bold">ChainID</span>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              <Link to="/verify" className="text-slate-300 hover:text-white transition-colors">
                Verify Identity
              </Link>
              <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-700/40"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.25),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(14,165,233,0.2),transparent_50%)]" />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-6 border border-indigo-500/30">
            Decentralized Identity Platform
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="text-5xl md:text-6xl font-extrabold mb-6">
            Own Your <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">Digital Identity</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-xl text-slate-300/80 mb-10 max-w-2xl mx-auto">
            Control your data, verify credentials, and manage access with privacy — powered by Ethereum.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-700/40">
              <ShieldIcon className="w-6 h-6" />
              <PersonIcon className="w-6 h-6" />
              <span>Create Your Identity</span>
            </Link>
            <Link to="/verify" className="border-2 border-indigo-400/50 text-indigo-200 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-500/10 transition-colors">
              Verify Identity
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Revolutionary Identity Solutions */}
      <section className="py-20 px-4 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Revolutionary Identity Solutions
            </h2>
            <p className="text-xl text-slate-300/80">
              Built on Ethereum with zero-knowledge proofs for maximum privacy and security.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-indigo-700/40">
                <ShieldIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Self-Sovereign Identity</h3>
              <p className="text-slate-300/80">
                Complete control over your personal data and digital credentials.
              </p>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-indigo-700/40">
                <LockIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Zero-Knowledge Proofs</h3>
              <p className="text-slate-300/80">
                Verify credentials without revealing sensitive information.
              </p>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-indigo-700/40">
                <NetworkIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Decentralized Network</h3>
              <p className="text-slate-300/80">
                Built on Ethereum for transparency and immutable records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How ChainID Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              How ChainID Works
            </h2>
            <p className="text-xl text-slate-300/80">
              Simple, secure, and completely under your control.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your DID</h3>
              <p className="text-slate-300/80">
                Generate a unique decentralized identifier on the Ethereum blockchain.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Manage Credentials</h3>
              <p className="text-slate-300/80">
                Receive, store, and manage verifiable credentials from trusted issuers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Control Access</h3>
              <p className="text-slate-300/80">
                Share only what's needed with selective disclosure and consent management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">Our Team</h2>
            <p className="text-slate-300/80">Builders behind ChainID</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="bg-slate-900/60 rounded-xl border border-slate-800/60 p-4 text-center shadow-lg">
                <img src={`https://picsum.photos/seed/chainid${i}/240/240`} alt={`Member ${i}`} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border border-slate-700" />
                <div className="text-lg font-semibold">Member {i}</div>
                <div className="text-sm text-slate-400">Blockchain Engineer</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to Take Control */}
      <section className="py-20 px-4 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-xl text-slate-300/80 mb-8">
            Join the decentralized identity revolution and experience true digital sovereignty.
          </p>
          <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-sky-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-indigo-700 hover:to-sky-700 transition-all flex items-center justify-center space-x-2 mx-auto shadow-lg shadow-indigo-700/40">
            <LightningIcon className="w-6 h-6" />
            <span>Start Building Your Identity</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-transparent border-t border-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-700/40">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-2xl font-bold">ChainID</span>
          </div>

          <div className="text-sm text-slate-400">
            Built on Ethereum • Powered by zero-knowledge proofs
          </div>
        </div>
      </footer>
    </div>
  );
};
