/**
 * AI Insights — two-stage flow inspired by PortableMind's AI Assistant.
 *
 * Stage 1: Command palette — search/prompt input + quick actions list.
 *          Provides discovery of available AI capabilities per page context.
 * Stage 2: Results overlay — large modal with markdown rendering,
 *          copy-to-clipboard, regenerate. Renders output of chosen action.
 *
 * The button and modal are page-agnostic; callers provide available
 * actions via the `generations` prop.
 */
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, X, Loader2, Copy, Check, RefreshCw,
  Search, Play, ArrowLeft, Lightbulb,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

export interface AiGeneration {
  label: string
  description: string
  onGenerate: () => Promise<Record<string, unknown>>
  initialResult?: Record<string, unknown> | null
}

interface AiInsightsModalProps {
  generations: AiGeneration[]
  /** Called when user submits a freeform prompt (no matching quick action) */
  onAsk?: (prompt: string) => Promise<Record<string, unknown>>
}

type Stage = 'palette' | 'results'

export function AiInsightsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1"
      style={{
        borderColor: 'rgba(0, 163, 224, 0.4)',
        background: 'linear-gradient(135deg, rgba(0, 163, 224, 0.08) 0%, rgba(0, 119, 182, 0.04) 100%)',
        color: '#0077B6',
      }}
    >
      <Sparkles className="w-3.5 h-3.5 text-[#00A3E0]" />
      AI Insights
    </button>
  )
}

export function AiInsightsModal({ generations, onAsk }: AiInsightsModalProps) {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState<Stage>('palette')
  const [activeIndex, setActiveIndex] = useState(0)
  const [results, setResults] = useState<(Record<string, unknown> | null)[]>(
    generations.map(g => g.initialResult ?? null)
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [filter, setFilter] = useState('')
  const [freeformResult, setFreeformResult] = useState<Record<string, unknown> | null>(null)
  const [freeformLabel, setFreeformLabel] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setResults(generations.map(g => g.initialResult ?? null))
  }, [generations.length])

  // Focus search on palette open
  useEffect(() => {
    if (open && stage === 'palette') {
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [open, stage])

  const handleClose = () => {
    setOpen(false)
    setStage('palette')
    setFilter('')
    setError(null)
    setCopied(false)
  }

  const handleSelectAction = async (index: number) => {
    setActiveIndex(index)
    setStage('results')
    setError(null)
    setCopied(false)

    // If we already have a result, show it; otherwise auto-generate
    if (results[index]) return

    setLoading(true)
    try {
      const data = await generations[index].onGenerate()
      setResults(prev => {
        const next = [...prev]
        next[index] = data
        return next
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleFreeformSubmit = async () => {
    if (!onAsk || !filter.trim()) return
    const prompt = filter.trim()
    setFreeformLabel(prompt)
    setFreeformResult(null)
    setStage('results')
    setActiveIndex(-1) // -1 signals freeform mode
    setLoading(true)
    setError(null)
    try {
      const data = await onAsk(prompt)
      setFreeformResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      if (activeIndex === -1 && onAsk) {
        const data = await onAsk(freeformLabel)
        setFreeformResult(data)
      } else {
        const data = await generations[activeIndex].onGenerate()
        setResults(prev => {
          const next = [...prev]
          next[activeIndex] = data
          return next
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const activeResult = activeIndex === -1 ? freeformResult : results[activeIndex]
  const response = activeResult?.response as string || activeResult?.structuredContext as string || ''
  const mode = activeResult?.mode as string || ''
  const model = activeResult?.model as string || ''
  const tokens = ((activeResult?.inputTokens as number) || 0) + ((activeResult?.outputTokens as number) || 0)
  const latency = activeResult?.latencyMs as number || activeResult?.contextPackagingMs as number || 0

  const handleCopy = () => {
    navigator.clipboard.writeText(response).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const filteredGenerations = filter
    ? generations.filter(g =>
        g.label.toLowerCase().includes(filter.toLowerCase()) ||
        g.description.toLowerCase().includes(filter.toLowerCase())
      )
    : generations

  return (
    <>
      <AiInsightsButton onClick={() => setOpen(true)} />

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={handleClose}
            />

            {stage === 'palette' ? (
              /* ── STAGE 1: Command Palette ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="fixed left-1/2 top-[20%] -translate-x-1/2 z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #00A3E0 0%, #0077B6 100%)' }}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-[#3D3D3D]">AI Insights</span>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search input */}
                <div className="px-5 py-3">
                  <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg focus-within:border-[#00A3E0] focus-within:ring-2 focus-within:ring-[#00A3E0]/20 transition-all">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={filter}
                      onChange={e => setFilter(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && filteredGenerations.length === 0 && filter.trim()) {
                          handleFreeformSubmit()
                        }
                      }}
                      placeholder="Ask AI anything or choose a quick action below..."
                      className="flex-1 text-sm text-[#3D3D3D] placeholder:text-gray-400 outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="px-5 pb-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quick Actions</p>
                </div>

                <div className="px-3 pb-4 max-h-64 overflow-y-auto">
                  {filteredGenerations.map((g) => {
                    const originalIndex = generations.indexOf(g)
                    const hasResult = !!results[originalIndex]
                    return (
                      <button
                        key={g.label}
                        onClick={() => handleSelectAction(originalIndex)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-[#00A3E0]/10 flex items-center justify-center shrink-0 transition-colors">
                          <Lightbulb className="w-4 h-4 text-gray-500 group-hover:text-[#00A3E0] transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#3D3D3D]">
                            {g.label}
                            {hasResult && (
                              <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
                            )}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{g.description}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#00A3E0] flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                        </div>
                      </button>
                    )
                  })}

                  {filteredGenerations.length === 0 && filter.trim() && onAsk && (
                    <button
                      onClick={handleFreeformSubmit}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left hover:bg-[#00A3E0]/5 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-[#00A3E0]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#3D3D3D]">Ask: "{filter}"</p>
                        <p className="text-xs text-gray-500">Submit as a freeform question with your assessment context</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#00A3E0] flex items-center justify-center shrink-0">
                        <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                      </div>
                    </button>
                  )}
                  {filteredGenerations.length === 0 && (!filter.trim() || !onAsk) && (
                    <p className="text-sm text-gray-400 text-center py-4">No matching actions</p>
                  )}
                </div>
              </motion.div>
            ) : (
              /* ── STAGE 2: Results Overlay ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-x-24 lg:inset-y-12 z-50 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setStage('palette'); setFilter(''); setCopied(false) }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#00A3E0] hover:bg-gray-50 transition-colors"
                      aria-label="Back to actions"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #00A3E0 0%, #0077B6 100%)' }}
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#3D3D3D]">
                        {activeIndex === -1 ? freeformLabel : generations[activeIndex]?.label}
                      </h2>
                      <p className="text-xs text-gray-500">Powered by structured context injection</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  {loading && (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Loader2 className="w-8 h-8 text-[#00A3E0] animate-spin mb-4" />
                      <p className="text-sm text-gray-500">Generating insights...</p>
                    </div>
                  )}

                  {activeResult && !loading && (
                    <div className="prose prose-sm max-w-none prose-headings:text-[#3D3D3D] prose-headings:font-bold prose-h1:text-xl prose-h2:text-lg prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:mt-6 prose-h3:text-base prose-p:text-[#3D3D3D] prose-p:leading-relaxed prose-strong:text-[#3D3D3D] prose-li:text-[#3D3D3D] prose-ul:my-2 prose-ol:my-2">
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                        {response}
                      </ReactMarkdown>
                    </div>
                  )}

                  {error && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="p-3 rounded-lg bg-red-50 text-sm text-red-600 mb-4">
                        {error}
                      </div>
                      <button
                        onClick={handleRegenerate}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#00A3E0] border border-[#00A3E0]/30 hover:bg-[#00A3E0]/5 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Try Again
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                  <div className="text-xs text-gray-400">
                    {activeResult && mode === 'live' && (
                      <span>{model} · {tokens} tokens · {(latency / 1000).toFixed(1)}s</span>
                    )}
                    {activeResult && mode === 'dry_run' && (
                      <span className="text-orange-500">Structured context (no API key)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {activeResult && !loading && (
                      <>
                        <button
                          onClick={handleRegenerate}
                          disabled={loading}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-[#00A3E0] border border-gray-200 rounded-lg hover:border-[#00A3E0] transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Regenerate
                        </button>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-[#00A3E0] border border-gray-200 rounded-lg hover:border-[#00A3E0] transition-colors"
                        >
                          {copied
                            ? <><Check className="w-3 h-3 text-green-500" />Copied!</>
                            : <><Copy className="w-3 h-3" />Copy to Clipboard</>
                          }
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  )
}
