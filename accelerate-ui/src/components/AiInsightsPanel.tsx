import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Loader2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

interface AiInsightsPanelProps {
  title: string
  onGenerate: () => Promise<Record<string, unknown>>
  initialResult?: Record<string, unknown> | null
  defaultOpen?: boolean
  className?: string
}

export function AiInsightsPanel({ title, onGenerate, initialResult = null, defaultOpen = false, className = '' }: AiInsightsPanelProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Record<string, unknown> | null>(initialResult)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await onGenerate()
      setResult(data)
      setOpen(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const response = result?.response as string || result?.structuredContext as string || ''
  const mode = result?.mode as string || 'unknown'
  const model = result?.model as string || ''
  const tokens = ((result?.inputTokens as number) || 0) + ((result?.outputTokens as number) || 0)
  const latency = result?.latencyMs as number || result?.contextPackagingMs as number || 0

  return (
    <div className={className}>
      {!result ? (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #00A3E0 0%, #0077B6 100%)' }}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" />{title}</>
          )}
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-[#00A3E0]/20 rounded-xl overflow-hidden bg-gradient-to-br from-[#00A3E0]/5 to-white"
        >
          <div className="flex items-center justify-between px-5 py-3">
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 cursor-pointer flex-1 hover:opacity-80 transition-opacity"
              role="button"
              tabIndex={0}
            >
              <Sparkles className="w-4 h-4 text-[#00A3E0]" />
              <span className="text-sm font-semibold text-[#3D3D3D]">{title}</span>
              {mode === 'live' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00A3E0]/10 text-[#00A3E0] font-medium">
                  {model} · {tokens} tokens · {(latency / 1000).toFixed(1)}s
                </span>
              )}
              {mode === 'dry_run' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 font-medium">
                  Structured Context (no API key)
                </span>
              )}
              {open ? <ChevronUp className="w-4 h-4 text-gray-400 ml-2" /> : <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(response).then(() => {
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                })
              }}
              className="text-gray-400 hover:text-[#00A3E0] p-1 ml-2 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => { setResult(null); setOpen(false); setCopied(false) }}
              className="text-gray-400 hover:text-gray-600 p-1"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 prose prose-sm max-w-none prose-headings:text-[#3D3D3D] prose-headings:font-bold prose-h1:text-xl prose-h2:text-lg prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:mt-6 prose-h3:text-base prose-p:text-[#3D3D3D] prose-p:leading-relaxed prose-strong:text-[#3D3D3D] prose-li:text-[#3D3D3D] prose-ul:my-2 prose-ol:my-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                    {response}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  )
}
