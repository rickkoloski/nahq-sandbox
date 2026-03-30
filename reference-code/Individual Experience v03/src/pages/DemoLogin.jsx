import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ChevronLeft, ChevronRight, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLIDES = [
  {
    title: 'See Where You Stand',
    subtitle: 'Assess your level of work aligned to the NAHQ Healthcare Quality Competency Framework™ to see where you stand today.',
    stat: '28',
    statLabel: 'Competencies Assessed',
  },
  {
    title: 'Compare Yourself to Peers',
    subtitle: 'See how your results compare to healthcare professionals in similar roles and settings across the country.',
    stat: '3,000+',
    statLabel: 'Professionals Benchmarked',
  },
  {
    title: 'Accelerate Your Impact',
    subtitle: "Get a personalized development plan mapped to the NAHQ Framework and aligned to your organization's expectations for your role.",
    stat: '600+',
    statLabel: 'Skills Defined',
  },
];

// ── Forgot Password — Request ───────────────────────────────────────────────
function ForgotPasswordRequest({ onBack, onSent }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSent(email);
  };

  return (
    <motion.div
      key="request"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 mb-8 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2 rounded"
      >
        <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" /> Back to sign in
      </button>

      <div aria-hidden="true" className="w-12 h-12 rounded-full bg-[#00A3E0]/10 flex items-center justify-center mb-6">
        <Mail aria-hidden="true" className="w-6 h-6 text-[#00A3E0]" />
      </div>

      <h2 className="text-2xl font-bold text-[#3D3D3D] mb-2">Forgot password?</h2>
      <p className="text-gray-600 text-sm mb-8">No worries — enter your email and we'll send you reset instructions.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium text-[#3D3D3D] mb-1.5">
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sarah@hospital.org"
            required
            autoComplete="email"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-[#3D3D3D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A3E0]/60 focus:border-[#00A3E0] transition"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#00A3E0] hover:bg-[#0087bd] text-white font-semibold py-2.5 rounded-lg text-sm transition focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2"
        >
          Send reset instructions
        </Button>
      </form>
    </motion.div>
  );
}

// ── Forgot Password — Sent ─────────────────────────────────────────────────
function ForgotPasswordSent({ email, onBack }) {
  return (
    <motion.div
      key="sent"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="text-center"
    >
      <div aria-hidden="true" className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
        <CheckCircle aria-hidden="true" className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-[#3D3D3D] mb-2">Check your email</h2>
      <p className="text-gray-600 text-sm mb-2">We sent a password reset link to</p>
      <p className="font-semibold text-[#3D3D3D] text-sm mb-8">{email || 'your email address'}</p>

      <div className="bg-gray-50 rounded-lg px-4 py-3 mb-8 text-xs text-gray-600 leading-relaxed">
        Didn't receive the email? Check your spam folder or{' '}
        <button
          type="button"
          onClick={onBack}
          className="text-[#00A3E0] hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1 rounded"
        >
          try a different email
        </button>.
      </div>

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 mx-auto transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2 rounded"
      >
        <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" /> Back to sign in
      </button>
    </motion.div>
  );
}

// ── Main Login Form ────────────────────────────────────────────────────────
function LoginForm({ onForgotPassword, onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
    >
      <h1 className="text-3xl font-bold text-[#3D3D3D] mb-2">Welcome to NAHQ Accelerate</h1>
      <p className="text-gray-600 text-sm mb-8">Sign in to your account</p>

      <form onSubmit={onSignIn} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-[#3D3D3D] mb-1.5">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sarah@hospital.org"
            autoComplete="email"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-[#3D3D3D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A3E0]/60 focus:border-[#00A3E0] transition"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-sm font-medium text-[#3D3D3D]">
              Password
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-[#00A3E0] hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1 rounded"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-[#3D3D3D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A3E0]/60 focus:border-[#00A3E0] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              aria-controls="login-password"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1 rounded"
            >
              {showPassword
                ? <EyeOff aria-hidden="true" className="w-4 h-4" />
                : <Eye aria-hidden="true" className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#00A3E0] hover:bg-[#0087bd] text-white font-semibold py-2.5 rounded-lg text-sm transition focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2"
        >
          Sign in
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onSignIn}
          className="text-xs text-gray-600 hover:text-gray-800 underline underline-offset-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2 rounded"
        >
          Skip sign in (demo)
        </button>
      </div>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function DemoLogin() {
  const navigate = useNavigate();
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'sent'
  const [sentEmail, setSentEmail] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);
  // Live region text for view changes
  const [announcement, setAnnouncement] = useState('');

  const changeView = (nextView, msg) => {
    setView(nextView);
    if (msg) setAnnouncement(msg);
  };

  const handleSignIn = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigate(createPageUrl('IndividualHome'));
  };

  const handleSent = (email) => {
    setSentEmail(email);
    changeView('sent', 'Password reset email sent. Check your inbox.');
  };

  const slide = SLIDES[slideIndex];
  const prevSlide = () => setSlideIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const nextSlide = () => setSlideIndex((i) => (i + 1) % SLIDES.length);

  return (
    <div className="min-h-screen flex">
      {/* Skip to main content */}
      <a
        href="#login-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00A3E0] focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Screen-reader live region for view transitions */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Left — Form */}
      <main id="login-main" className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-white">
        <div className="max-w-sm w-full mx-auto">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978f965d09546069bd9609b/a94c116b2_image.png"
            alt="NAHQ Accelerate"
            className="h-10 w-auto mb-10"
          />

          <AnimatePresence mode="wait">
            {view === 'login' && (
              <LoginForm
                key="login"
                onForgotPassword={() => changeView('forgot', 'Forgot password form. Enter your email to receive reset instructions.')}
                onSignIn={handleSignIn}
              />
            )}
            {view === 'forgot' && (
              <ForgotPasswordRequest
                key="forgot"
                onBack={() => changeView('login', 'Sign in form.')}
                onSent={handleSent}
              />
            )}
            {view === 'sent' && (
              <ForgotPasswordSent
                key="sent"
                email={sentEmail}
                onBack={() => changeView('login', 'Sign in form.')}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Right — Carousel */}
      <section
        aria-label="NAHQ Accelerate features"
        className="hidden lg:flex flex-col flex-1 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #009FE8 0%, #414042 100%)' }}
      >
        {/* Decorative background shapes */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <circle cx="85%" cy="-10%" r="220" fill="rgba(0,163,224,0.13)" />
          <circle cx="70%" cy="120%" r="180" fill="rgba(0,61,165,0.18)" />
          <circle cx="5%" cy="80%" r="140" fill="rgba(0,163,224,0.09)" />
          <ellipse cx="55%" cy="50%" rx="300" ry="120" fill="rgba(255,255,255,0.03)" transform="rotate(-20 55% 50%)" />
          <polygon points="80%,0 100%,0 100%,60%" fill="rgba(0,163,224,0.08)" />
          <polygon points="0,100% 30%,100% 0,40%" fill="rgba(61,61,61,0.15)" />
        </svg>

        {/* Slide content */}
        <div
          role="region"
          aria-label={`Feature ${slideIndex + 1} of ${SLIDES.length}: ${slide.title}`}
          aria-live="polite"
          aria-atomic="true"
          className="flex-1 flex flex-col items-center justify-center px-16 text-white relative z-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slideIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
              className="text-center max-w-md"
            >
              <div className="inline-block bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-6 mb-8">
                <p className="text-5xl font-bold text-white mb-1">{slide.stat}</p>
                <p className="text-sm text-white font-medium">{slide.statLabel}</p>
              </div>
              <h2 className="text-2xl font-bold mb-3">{slide.title}</h2>
              <p className="text-white/90 text-sm leading-relaxed">{slide.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center justify-center gap-4 pb-10 relative z-10">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <ChevronLeft aria-hidden="true" className="w-4 h-4 text-white" />
          </button>

          <div role="tablist" aria-label="Feature slides" className="flex gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === slideIndex}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                onClick={() => setSlideIndex(i)}
                className={`rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 ${
                  i === slideIndex ? 'w-6 h-2 bg-[#FFED00]' : 'w-2 h-2 bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <ChevronRight aria-hidden="true" className="w-4 h-4 text-white" />
          </button>
        </div>
      </section>
    </div>
  );
}