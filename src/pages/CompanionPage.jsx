import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getById } from '../data'
import CompanionCard from '../components/CompanionCard'
import CompanionDetailModal from '../components/CompanionDetailModal'

export default function CompanionPage() {
  const [board, setBoard] = useState(() => {
    try { return JSON.parse(localStorage.getItem('companion-board') ?? '[]') } catch { return [] }
  })
  const [selected, setSelected] = useState(null) // { id, category } | null
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    localStorage.setItem('companion-board', JSON.stringify(board))
  }, [board])

  useEffect(() => {
    const handler = (e) => {
      const { id, category } = e.detail
      setBoard(prev =>
        prev.find(x => x.id === id && x.category === category)
          ? prev
          : [...prev, { id, category }]
      )
    }
    window.addEventListener('companion-add-entry', handler)
    return () => window.removeEventListener('companion-add-entry', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault()
        window.dispatchEvent(new Event('open-companion-picker'))
        return
      }
      if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
        const n = parseInt(e.key, 10)
        if (n >= 1 && n <= board.length) {
          e.preventDefault()
          const { id, category } = board[n - 1]
          setSelected({ id, category })
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [board])

  const selectedIndex = selected
    ? board.findIndex(x => x.id === selected.id && x.category === selected.category)
    : -1

  function remove(id, category) {
    setBoard(prev => prev.filter(x => !(x.id === id && x.category === category)))
    if (selected?.id === id && selected?.category === category) setSelected(null)
  }

  function removeAll() {
    setBoard([])
    setSelected(null)
    setConfirmClear(false)
  }

  function navigate(delta) {
    if (selectedIndex < 0) return
    const next = selectedIndex + delta
    if (next >= 0 && next < board.length) setSelected(board[next])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-5 border border-gold/35 overflow-hidden"
      style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between bg-gold/8 border-b border-gold/25 px-5 py-2.5">
        <div className="flex items-center gap-3">
          <div
            className="page-title-badge text-xs"
            style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            Companion
          </div>
          <span className="font-mono text-[10px] text-moonstone-dark/40 tracking-wider">
            Active board — {board.length} {board.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {board.length > 0 && (
            <button
              onClick={() => setConfirmClear(true)}
              className="text-xs font-mono text-gold/30 hover:text-tier-aleph
                border border-gold/15 hover:border-tier-aleph/50
                px-3 py-1 transition-all"
            >
              Remove All
            </button>
          )}
          <div className="hidden sm:flex items-center divide-x divide-gold/15">
            <span className="flex items-center gap-1 font-mono text-[10px] text-moonstone-dark/50 tracking-wider pr-3">
              <kbd className="text-[9px] font-mono text-gold/60 bg-navy-800 border border-gold/35 px-1 py-0.5 leading-none">1–9</kbd>
              <span>to open</span>
            </span>
            <span className="hint-glitter flex items-center gap-1 font-mono text-[10px] text-moonstone-dark/50 tracking-wider pl-3">
              <kbd className="text-[9px] font-mono text-gold/60 bg-navy-800 border border-gold/35 px-1 py-0.5 leading-none">Ctrl</kbd>
              +<span className="text-gold/60">A</span>
            </span>
          </div>
          <button
            onClick={() => window.dispatchEvent(new Event('open-companion-picker'))}
            className="flex items-center gap-1.5 text-xs font-mono text-gold/50 hover:text-gold
              border border-gold/25 hover:border-gold/60 bg-navy-800/60 hover:bg-navy-800
              px-3 py-1 transition-all"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Abnormality
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="px-5 pb-5">
        {board.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <svg className="w-10 h-10 text-gold/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            <p className="font-mono text-xs text-moonstone-dark/35 tracking-wider">
              No entries on board.
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event('open-companion-picker'))}
              className="text-xs font-mono text-gold/40 hover:text-gold transition-colors underline underline-offset-2"
            >
              Add your first abnormality →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {board.map(({ id, category }, idx) => {
              const entry = getById(category, id)
              if (!entry) return null
              return (
                <CompanionCard
                  key={`${category}-${id}`}
                  entry={entry}
                  category={category}
                  index={idx + 1}
                  onClick={() => setSelected({ id, category })}
                  onRemove={() => remove(id, category)}
                />
              )
            })}
          </div>
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {confirmClear && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200]"
                onClick={() => setConfirmClear(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="fixed inset-0 z-[201] flex items-center justify-center px-4 pointer-events-none"
              >
                <div
                  className="pointer-events-auto bg-navy-950 border-2 border-gold/50 shadow-gold-lg px-8 py-6 flex flex-col gap-4 text-center"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                >
                  <p className="font-display text-base text-moonstone tracking-wide">Clear the entire board?</p>
                  <p className="font-mono text-xs text-moonstone-dark/45">This will remove all {board.length} {board.length === 1 ? 'entry' : 'entries'}.</p>
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="text-xs font-mono text-gold/50 hover:text-gold border border-gold/25 hover:border-gold/60 px-5 py-1.5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={removeAll}
                      className="text-xs font-mono text-tier-aleph/70 hover:text-tier-aleph border border-tier-aleph/30 hover:border-tier-aleph/60 px-5 py-1.5 transition-all"
                    >
                      Remove All
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      <CompanionDetailModal
        entryId={selected?.id}
        category={selected?.category}
        onClose={() => setSelected(null)}
        onPrev={() => navigate(-1)}
        onNext={() => navigate(1)}
        index={selectedIndex}
        total={board.length}
      />
    </motion.div>
  )
}
