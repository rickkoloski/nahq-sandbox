import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ArrowRight, ArrowLeft, Eye, EyeOff,
  ChevronLeft, ChevronRight, CheckCircle2,
  Target, TrendingUp, BookOpen, Award, Check, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ── Data ─────────────────────────────────────────────────────────────────────

const LOCKED_EMAIL = 'sarah.johnson@healthcare.org';

const PRIMARY_RESPONSIBILITIES = [
  'Administration', 'Ancillary to clinical (radiology, lab techs)', 'Case Management',
  'Clinician — other (excludes physicians, nurses)', 'Education / Training', 'Executive Leadership',
  'Finance', 'Health Data Analytics', 'Infection Prevention / Control', 'Marketing', 'Medicine',
  'Nursing', 'Operations (IT, data abstraction, facilities, etc.)', 'Patient Experience / Relations / Advocacy',
  'Patient Safety', 'Performance & Process Improvement (Lean, Six Sigma)', 'Population Health & Care Transitions',
  'Project Management', 'Quality Management', 'Regulatory/Accreditation', 'Risk Management', 'Other',
];

const YEARS_OPTIONS = ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', 'More than 10 years'];
const YEARS_IN_ROLE_OPTIONS = ['Less than 1 year', '1–2 years', '3–4 years', '5–10 years', 'More than 10 years'];
const CPHQ_OPTIONS = ['CPHQ Certified', 'Not Certified', 'Certification Lapsed'];
const PERCENT_OPTIONS = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

// Individual-focused slides
const SLIDES = [
  {
    icon: Target,
    headline: 'Know exactly where you stand.',
    sub: 'Your personalized competency assessment maps your skills across the full NAHQ framework — giving you an honest, data-driven baseline.',
    card: {
      title: 'Your Competency Snapshot',
      items: [
        { label: 'Patient Safety Risk Mitigation', score: 1.8, max: 3, color: '#ED1C24' },
        { label: 'Quality Leadership & Integration', score: 2.3, max: 3, color: '#003DA5' },
        { label: 'Health Data Analytics', score: 1.5, max: 3, color: '#F68B1F' },
        { label: 'Performance Improvement', score: 2.6, max: 3, color: '#8BC53F' },
      ],
    },
  },
  {
    icon: BookOpen,
    headline: 'A learning plan built just for you.',
    sub: 'Based on your results, the platform generates a prioritized upskill plan — curated NAHQ courses matched to your exact gaps and career goals.',
    card: {
      title: 'Your Upskill Plan Preview',
      items: [
        { label: 'Patient Safety Essentials', tag: 'High Priority', tagColor: '#ED1C24', hours: '4h' },
        { label: 'Data-Driven Decision Making', tag: 'Recommended', tagColor: '#F68B1F', hours: '3h' },
        { label: 'Quality Metrics Masterclass', tag: 'Next Step', tagColor: '#003DA5', hours: '2h' },
      ],
      type: 'courses',
    },
  },
  {
    icon: TrendingUp,
    headline: 'Track your growth over time.',
    sub: 'Every course you complete moves the needle. Watch your upskill plan progress in real time and celebrate each milestone along the way.',
    card: {
      title: 'Upskill Plan Progress',
      items: [
        { label: 'Patient Safety Essentials', tag: 'Completed', tagColor: '#8BC53F', hours: '4h' },
        { label: 'Data-Driven Decision Making', tag: 'In Progress', tagColor: '#00A3E0', hours: '3h' },
        { label: 'Quality Metrics Masterclass', tag: 'Up Next', tagColor: '#F68B1F', hours: '2h' },
      ],
      type: 'courses',
    },
  },
];

// ── Password strength ─────────────────────────────────────────────────────────

function getPasswordStrength(pw) {
  const rules = [
    { label: 'At least 8 characters', ok: pw.length >= 8 },
    { label: 'One uppercase letter', ok: /[A-Z]/.test(pw) },
    { label: 'One number', ok: /[0-9]/.test(pw) },
    { label: 'One special character', ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const score = rules.filter(r => r.ok).length;
  return { rules, score };
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const { rules, score } = getPasswordStrength(password);
  const colors = ['#ED1C24', '#F68B1F', '#FFED00', '#8BC53F'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-colors"
            style={{ backgroundColor: i < score ? colors[score - 1] : '#E5E7EB' }} />
        ))}
      </div>
      {score > 0 && (
        <p className="text-[11px] font-semibold" style={{ color: colors[score - 1] }}>{labels[score - 1]}</p>
      )}
      <div className="space-y-0.5">
        {rules.map(r => (
          <div key={r.label} className="flex items-center gap-1.5">
            {r.ok
              ? <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
              : <X className="w-3 h-3 text-gray-300 flex-shrink-0" />}
            <span className={`text-[11px] ${r.ok ? 'text-gray-600' : 'text-gray-400'}`}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Right panel sub-components ────────────────────────────────────────────────

function ScoreBar({ label, score, max, color }) {
  const pct = (score / max) * 100;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600 font-medium leading-tight">{label}</span>
        <span className="text-xs font-bold text-[#3D3D3D]">{score}/{max}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full">
        <motion.div className="h-2 rounded-full" style={{ backgroundColor: color }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, delay: 0.15 }} />
      </div>
    </div>
  );
}

function ProgressBar({ label, pct, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600 font-medium">{label}</span>
        <span className="text-xs font-bold text-[#3D3D3D]">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full">
        <motion.div className="h-2 rounded-full" style={{ backgroundColor: color }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, delay: 0.15 }} />
      </div>
    </div>
  );
}

function CourseItem({ label, tag, tagColor, hours }) {
  return (
    <div className="flex items-center justify-between gap-2 py-2 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#3D3D3D] truncate">{label}</p>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: tagColor + '18', color: tagColor }}>{tag}</span>
      </div>
      <span className="text-[11px] text-gray-400 flex-shrink-0">{hours}</span>
    </div>
  );
}

function SlideCard({ card }) {
  if (!card) return null;
  return (
    <div className="bg-white rounded-2xl shadow-xl p-5">
      <p className="text-xs font-bold text-[#3D3D3D] uppercase tracking-wide mb-3">{card.title}</p>
      {card.type === 'courses' ? (
        <div className="divide-y divide-gray-100">
          {card.items.map(item => <CourseItem key={item.label} {...item} />)}
        </div>
      ) : card.type === 'bars' ? (
        <div className="space-y-3">
          {card.items.map(item => <ProgressBar key={item.label} label={item.label} pct={item.pct} color={item.color} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {card.items.map(item => <ScoreBar key={item.label} label={item.label} score={item.score} max={item.max} color={item.color} />)}
        </div>
      )}
    </div>
  );
}

function RightPanel() {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const Icon = current.icon;

  return (
    <div className="flex flex-col h-full p-10 relative overflow-hidden select-none" style={{ background: 'linear-gradient(135deg, #009FE8 0%, #414042 100%)' }}>
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 bg-white" />
      <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full opacity-10 bg-white" />
      <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full opacity-5 bg-white" />

      {/* NAHQ white logo */}
      <div className="relative z-10 mb-10">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978f965d09546069bd9609b/a94c116b2_image.png"
          alt="NAHQ"
          className="h-9 w-auto brightness-0 invert"
        />
      </div>

      {/* Main copy */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={slide}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}>

            <h2 className="text-3xl font-bold text-white leading-tight mb-3">{current.headline}</h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm mb-8">{current.sub}</p>
            <SlideCard card={current.card} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel controls */}
      <div className="relative z-10 flex items-center justify-between mt-8">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === slide ? 'w-7 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/35 hover:bg-white/55'}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length)}
            className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/15 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setSlide(s => (s + 1) % SLIDES.length)}
            className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/15 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function IndividualOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouch] = useState({});

  const [form, setForm] = useState({
    first_name: '', last_name: '', password: '', confirm_password: '',
    job_title: '', site_facility: '', primary_responsibility: '',
    percent_time_quality: '', cphq_status: '', years_with_employer: '', years_in_role: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const touch = (key) => setTouch(t => ({ ...t, [key]: true }));

  const { score: pwScore } = getPasswordStrength(form.password);
  const passwordsMatch = form.password === form.confirm_password;
  const canStep1 = form.first_name.trim() && form.last_name.trim() && pwScore >= 2 && passwordsMatch;

  const handleFinish = () => navigate(createPageUrl('IndividualHome'));

  return (
    <div className="h-screen flex overflow-hidden">
      {/* ── LEFT: Form ── */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white">
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-[400px]">
            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}>

                {/* ── STEP 1 ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-[#00A3E0] mb-1">Welcome</p>
                      <h1 className="text-2xl font-bold text-[#3D3D3D] mb-1">Set up your account</h1>
                      <p className="text-sm text-gray-500">
                        You're joining <span className="font-semibold text-[#3D3D3D]">Metro Healthcare System</span>'s Workforce Intelligence Platform.
                      </p>
                    </div>

                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">First Name</Label>
                        <Input
                          placeholder="Sarah"
                          value={form.first_name}
                          onChange={e => set('first_name', e.target.value)}
                          className="h-10"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">Last Name</Label>
                        <Input
                          placeholder="Johnson"
                          value={form.last_name}
                          onChange={e => set('last_name', e.target.value)}
                          className="h-10"
                        />
                      </div>
                    </div>

                    {/* Email — locked */}
                    <div>
                      <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">Email</Label>
                      <Input
                        type="email"
                        value={LOCKED_EMAIL}
                        readOnly
                        className="h-10 bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                      />
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" /> This is the email your invitation was sent to.
                      </p>
                    </div>

                    {/* Password */}
                    <div>
                      <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">Create Password</Label>
                      <div className="relative">
                        <Input
                          type={showPass ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={form.password}
                          onChange={e => set('password', e.target.value)}
                          onBlur={() => touch('password')}
                          className="h-10 pr-10"
                        />
                        <button type="button" onClick={() => setShowPass(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <PasswordStrength password={form.password} />
                    </div>

                    {/* Confirm password */}
                    <div>
                      <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={form.confirm_password}
                          onChange={e => set('confirm_password', e.target.value)}
                          onBlur={() => touch('confirm_password')}
                          className={`h-10 pr-10 ${touched.confirm_password && !passwordsMatch ? 'border-red-400 focus:ring-red-300' : ''}`}
                        />
                        <button type="button" onClick={() => setShowConfirm(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {touched.confirm_password && form.confirm_password && !passwordsMatch && (
                        <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
                      )}
                    </div>

                    <Button
                      onClick={() => canStep1 && setStep(2)}
                      disabled={!canStep1}
                      className="w-full h-11 bg-[#00A3E0] hover:bg-[#0086b8] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* ── STEP 2 ── */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-[#00A3E0] mb-1">Almost there</p>
                      <h1 className="text-2xl font-bold text-[#3D3D3D] mb-1">Complete your profile</h1>
                      <p className="text-sm text-gray-500">Help us personalise your experience with a few professional details.</p>
                    </div>

                    {/* Organization — locked */}
                    <div>
                      <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">Organization</Label>
                      <Input
                        value="Metro Healthcare System"
                        readOnly
                        className="h-10 bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                      />
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" /> Set by your organization's administrator.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">Job Title</Label>
                        <Input placeholder="e.g. Director of Quality" value={form.job_title}
                          onChange={e => set('job_title', e.target.value)} className="h-10" />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">Site / Facility</Label>
                        <Input placeholder="Community Hospital" value={form.site_facility}
                          onChange={e => set('site_facility', e.target.value)} className="h-10" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">Primary Responsibility</Label>
                      <Select value={form.primary_responsibility} onValueChange={v => set('primary_responsibility', v)}>
                        <SelectTrigger className="h-10"><SelectValue placeholder="Select responsibility" /></SelectTrigger>
                        <SelectContent>
                          {PRIMARY_RESPONSIBILITIES.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">% Time in Quality</Label>
                        <Select value={String(form.percent_time_quality)} onValueChange={v => set('percent_time_quality', Number(v))}>
                          <SelectTrigger className="h-10"><SelectValue placeholder="Select %" /></SelectTrigger>
                          <SelectContent>
                            {PERCENT_OPTIONS.map(o => <SelectItem key={o} value={String(o)}>{o}%</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">CPHQ Status</Label>
                        <Select value={form.cphq_status} onValueChange={v => set('cphq_status', v)}>
                          <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {CPHQ_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">Years with Employer</Label>
                        <Select value={form.years_with_employer} onValueChange={v => set('years_with_employer', v)}>
                          <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {YEARS_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-[#3D3D3D] mb-1.5 block">Years in Current Role</Label>
                        <Select value={form.years_in_role} onValueChange={v => set('years_in_role', v)}>
                          <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {YEARS_IN_ROLE_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <Button variant="outline" onClick={() => setStep(1)} className="px-5 h-11">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                      </Button>
                      <Button onClick={handleFinish}
                        className="flex-1 h-11 bg-[#00A3E0] hover:bg-[#0086b8] text-white font-semibold">
                        Save & Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Step dots */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-[#00A3E0]' : 'w-4 bg-[#00A3E0]'}`} />
                <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-[#00A3E0]' : 'w-4 bg-gray-200'}`} />
                <span className="text-xs text-gray-400 ml-1">Step {step} of 2</span>
              </div>
              <button
                onClick={handleFinish}
                className="text-[11px] text-gray-400 hover:text-gray-500 underline transition-colors"
              >
                Demo: Skip Onboarding
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Branded Panel ── */}
      <div className="hidden lg:block w-[50%] flex-shrink-0 h-full">
        <RightPanel />
      </div>
    </div>
  );
}