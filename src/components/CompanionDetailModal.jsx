import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getById } from '../data'
import EntryDetailContent from './EntryDetailContent'

export default function CompanionDetailModal({ entryId, category, onClose }) {
  const entry = entryId ? getById(category, entryId) : null

  useEffect(() => {
    if (!entry) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [entry, onClose])

  return createPortal(
    <AnimatePresence>
      {entry && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[201] flex items-center justify-center px-4 py-8 pointer-events-none"
          >
            <div
              className="w-full max-w-3xl max-h-full pointer-events-auto flex flex-col
                bg-navy-950 border-2 border-gold/60 shadow-gold-lg overflow-hidden"
              style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-gold/8 border-b border-gold/25 px-5 py-2.5 shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    className="page-title-badge text-xs"
                    style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                  >
                    Board Entry
                  </div>
                  <span className="font-mono text-xs text-moonstone-dark/45 truncate max-w-[300px]">
                    {entry.name}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 text-xs font-mono text-gold/35 hover:text-gold transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <EntryDetailContent entry={entry} category={category} />
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-gold/10 bg-navy-900/50 px-5 py-2 flex justify-end">
                <span className="text-xs font-mono text-moonstone-dark/30">
                  <kbd className="text-gold/40">esc</kbd> to close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
