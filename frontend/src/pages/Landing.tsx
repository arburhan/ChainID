import React from 'react';
import { motion } from "motion/react";
import { Link } from 'react-router-dom';
import memberData from './team.json';
import member1 from '../lib/images/member1.jpeg';
import member2 from '../lib/images/member2.jpeg';
import member3 from '../lib/images/member3.jpeg';
import member4 from '../lib/images/member4.jpeg';
import member5 from '../lib/images/member5.jpeg';
import member6 from '../lib/images/member6.jpeg';
import githubLogo from '../lib/images/github.png';



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
              <Link to="/" className="text-white text-2xl font-bold">IdentiChain </Link>

            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              <Link to="/government" className="text-slate-300 hover:text-white transition-colors">
                Government
              </Link>
              <Link to="/telecommunication" className="text-slate-300 hover:text-white transition-colors">
                Telecommunication
              </Link>
              {/* <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-700/40"
              >
                Get Started
              </Link> */}
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
            <Link to="/government" className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-700/40">
              <ShieldIcon className="w-6 h-6" />
              <PersonIcon className="w-6 h-6" />
              <span>Government Portal</span>
            </Link>
            <Link to="/telecommunication" className="border-2 border-indigo-400/50 text-indigo-200 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-500/10 transition-colors">
              Telecom Portal
            </Link>
            <Link to="/user-registration" className="border-2 border-green-400/50 text-green-200 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-500/10 transition-colors">
              User Registration
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

      {/* How IdentiChain Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              How IdentiChain Works
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

      {/* Why IdentiChain Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why IdentiChain?
            </h2>
            <p className="text-xl text-slate-300/80">
              The future of digital identity is here. Experience the power of self-sovereign identity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-700/40">
                <ShieldIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Complete Privacy Control</h3>
              <p className="text-slate-300/80">
                You own your data completely. No central authority can access, modify, or revoke your identity without your explicit consent.
              </p>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-700/40">
                <LockIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Zero-Knowledge Verification</h3>
              <p className="text-slate-300/80">
                Prove your credentials without revealing sensitive information. Verify your age without showing your birth date.
              </p>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-700/40">
                <NetworkIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Interoperable & Portable</h3>
              <p className="text-slate-300/80">
                Your identity works across all platforms and services. No more creating new accounts everywhere you go.
              </p>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-700/40">
                <LightningIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Verification</h3>
              <p className="text-slate-300/80">
                Verify credentials instantly without waiting for third-party verification. Blockchain ensures immediate trust.
              </p>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-700/40">
                <PersonIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">User-Centric Design</h3>
              <p className="text-slate-300/80">
                Built for users, by users. Simple, intuitive interface that puts you in complete control of your digital identity.
              </p>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-700/40">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Tamper-Proof Security</h3>
              <p className="text-slate-300/80">
                Immutable blockchain records ensure your credentials cannot be forged or altered. Cryptographic security at its finest.
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
            <p className="text-slate-300/80">Builders behind IdentiChain</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {memberData.map((member) => (
              <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: member.id * 0.05 }} className="bg-slate-900/60 rounded-xl border border-slate-800/60 p-4 text-center shadow-lg">
                <img src={member.id === 1 ? member1 : member.id === 2 ? member2 : member.id === 3 ? member3 : member.id === 4 ? member4 : member.id === 5 ? member5 : member.id === 6 ? member6 : ''} alt={`${member.name}`} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border border-slate-700" />

                {/* <img src={`https://picsum.photos/seed/IdentiChain${i}/240/240`} alt={`Member ${i}`} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border border-slate-700" /> */}

                <div className="text-lg font-semibold">{member.name}</div>
                <div className="text-sm text-slate-400">{member.role}</div>
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
          <Link to="/government" className="bg-gradient-to-r from-indigo-600 to-sky-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-indigo-700 hover:to-sky-700 transition-all flex items-center justify-center space-x-2 mx-auto shadow-lg shadow-indigo-700/40">
            <LightningIcon className="w-6 h-6" />
            <span>Access Government Portal</span>
          </Link>
        </div>
      </section>

      {/* Who Can Use Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Who Can Use IdentiChain?
            </h2>
            <p className="text-xl text-slate-300/80">
              IdentiChain serves diverse sectors with secure, verifiable digital identity solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-700/40">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Government Agencies</h3>
              <ul className="text-slate-300/80 space-y-2">
                <li>• Issue national ID credentials</li>
                <li>• Verify citizen identities</li>
                <li>• Digital voting systems</li>
                <li>• Social welfare programs</li>
                <li>• Tax and benefits verification</li>
              </ul>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-700/40">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-green-400">Telecommunications</h3>
              <ul className="text-slate-300/80 space-y-2">
                <li>• SIM card registration</li>
                <li>• Customer identity verification</li>
                <li>• Fraud prevention</li>
                <li>• Age verification for services</li>
                <li>• Compliance with regulations</li>
              </ul>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-700/40">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Financial Services</h3>
              <ul className="text-slate-300/80 space-y-2">
                <li>• KYC/AML compliance</li>
                <li>• Account opening verification</li>
                <li>• Loan application processes</li>
                <li>• Anti-fraud measures</li>
                <li>• Cross-border transactions</li>
              </ul>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-700/40">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Healthcare</h3>
              <ul className="text-slate-300/80 space-y-2">
                <li>• Patient identity verification</li>
                <li>• Medical record access</li>
                <li>• Prescription verification</li>
                <li>• Insurance claim processing</li>
                <li>• Telemedicine authentication</li>
              </ul>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-teal-700/40">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-teal-400">Education</h3>
              <ul className="text-slate-300/80 space-y-2">
                <li>• Student identity verification</li>
                <li>• Digital certificates</li>
                <li>• Online exam authentication</li>
                <li>• Academic record verification</li>
                <li>• Scholarship applications</li>
              </ul>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-800/60">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-700/40">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-indigo-400">Enterprise</h3>
              <ul className="text-slate-300/80 space-y-2">
                <li>• Employee identity management</li>
                <li>• Access control systems</li>
                <li>• Supply chain verification</li>
                <li>• Partner authentication</li>
                <li>• Compliance reporting</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-8 rounded-xl border border-indigo-500/30">
              <h3 className="text-2xl font-bold mb-4 text-white">Ready to Get Started?</h3>
              <p className="text-slate-300/80 mb-6 max-w-2xl mx-auto">
                Join thousands of organizations already using IdentiChain to secure their digital identity infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/government" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all">
                  Government Portal
                </Link>
                <Link to="/telecommunication" className="border-2 border-indigo-400/50 text-indigo-200 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-500/10 transition-colors">
                  Telecom Portal
                </Link>
                <Link to="/user-registration" className="border-2 border-green-400/50 text-green-200 px-8 py-3 rounded-lg font-semibold hover:bg-green-500/10 transition-colors">
                  User Registration
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-transparent border-t border-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-700/40">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-2xl font-bold">IdentiChain</span>
          </div>

          <div className="text-sm text-slate-400">
            Built on Ethereum • Powered by zero-knowledge proofs
          </div>
          <div>
            <span className="text-sm text-slate-400">© 2025 IdentiChain. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com/arburhan/ChainID" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <img src={githubLogo} alt="github logo" className='w-12 h-12 ' />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
