import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAll, CATEGORY_META } from '../data'

const CATEGORY_ICONS = {
  abnormalities: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 3-4 4.5-4 8a4 4 0 0 0 8 0c0-3.5-2.5-5-4-8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v1a3 3 0 0 0 6 0v-1" />
      <circle cx="12" cy="11" r="1.5" fill="currentColor" />
    </svg>
  ),
  tools: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.472-2.472M11.42 15.17 6.343 20.246a2.652 2.652 0 0 1-3.75-3.75l5.076-5.077m0 0 2.473-2.472m0 0L14.25 5.25a2.652 2.652 0 0 1 3.75 3.75l-3.472 3.47" />
    </svg>
  ),
  ordeals: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const containerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
}

export default function HomePage() {
  const counts = {
    abnormalities: getAll('abnormalities').length,
    tools: getAll('tools').length,
    ordeals: getAll('ordeals').length,
  }

  return (
    <div className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border border-gold/35 h-full flex flex-col"
        style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}
      >
        {/* ── Panel header strip ───────────────────────────── */}
        <div className="flex items-center justify-between bg-gold/8 border-b border-gold/25 px-6 py-2.5">
          <span className="section-label tracking-[0.2em]">Personnel File — Internal Classification</span>
          <span className="font-mono text-xs text-gold/30">REF-00 // OPEN ACCESS</span>
        </div>

        {/* ── Hero: welcome text + Faust image ─────────────── */}
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 px-6 sm:px-8 py-6 border-b border-gold/15 lg:border-b-0 lg:border-r lg:border-gold/15">
            <h1
              className="font-display text-4xl font-bold text-gold mb-5 leading-tight tracking-wide"
              style={{ textShadow: '0 0 24px rgba(0,255,153,0.55), 0 0 8px rgba(0,255,153,0.35)' }}
            >
              Faust's Compendium
            </h1>
            <div className="space-y-3.5 text-sm text-moonstone leading-relaxed border-l-2 border-gold/30 pl-5">
              <p>
                What you are accessing is a classified reference document compiled from
                direct observation, field incident reports, and suppression debriefs. It is
                not comprehensive. It was never intended to be. Completeness is a goal, not a promise.
              </p>
              <p>
                Each entry reflects what is known at the time of documentation. Gaps are
                marked clearly — not to acknowledge failure, but to prevent the far greater
                failure of acting on absent data.
              </p>
              <p>
                If you encounter information not yet recorded here, submit it through the
                appropriate channel. Faust will evaluate and integrate it accordingly.
              </p>
              <p className="text-moonstone-dark/50 italic text-xs pt-1">
                — Compiled and maintained by Faust. Unauthorized modification is inadvisable.
              </p>
            </div>

          </div>

          {/* Faust image — hidden on small screens, shown lg+ */}
          <div
            className="hidden lg:block lg:w-48 xl:w-56 shrink-0 relative border-2 border-gold/40"
            style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/Lobotomy_Corp._Remnant_Faust_Full.png`}
              alt="Faust"
              className="w-full h-full object-cover object-top"
              style={{ maxHeight: '300px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/30 via-transparent to-transparent pointer-events-none" />
            {/* Corner accents */}
            <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-gold/60" />
            <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-gold/60" />
          </div>
        </div>

        {/* ── Category divider ─────────────────────────────── */}
        <div className="flex items-center gap-0 bg-gold/5 border-t border-b border-gold/20 px-6 py-2">
          <span className="section-label tracking-[0.2em] text-gold/70">Navigation</span>
          <span className="flex-1 ml-4 h-px bg-gold/15" />
        </div>

        {/* ── Category cards ───────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gold/15"
        >
          {Object.entries(CATEGORY_META).map(([category, meta], idx) => (
            <motion.div key={category} variants={cardVariants}>
              <Link to={`/${category}`} className="block group h-full overflow-hidden relative">
                <div className="px-6 py-5 h-full flex flex-col gap-3 transition-colors duration-200 group-hover:bg-gold/5">
                  {/* Icon + count row */}
                  <div className="flex items-start justify-between">
                    <span className="text-gold/60 group-hover:text-gold transition-colors">
                      {CATEGORY_ICONS[category]}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="font-counter text-2xl font-bold text-gold/30 group-hover:text-gold/70 transition-all duration-300 leading-none tracking-widest"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {String(counts[category]).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[10px] text-gold/20 group-hover:text-gold/45 transition-colors tracking-wider">entries</span>
                    </div>
                  </div>

                  {/* Title + desc */}
                  <div className="flex-1">
                    <h2 className="font-display text-xl text-moonstone group-hover:text-gold transition-colors mb-1.5">
                      {meta.label}
                    </h2>
                    <p className="text-xs text-moonstone-dark/55 leading-relaxed">
                      {meta.description}
                    </p>
                  </div>

                  {/* Bottom arrow + shortcut */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-gold/40 group-hover:text-gold transition-colors">
                      <span>View all</span>
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                    <kbd className="text-[10px] font-mono text-gold/55 bg-navy-800 border border-gold/25 px-1.5 py-0.5 tracking-wide">
                      Ctrl+{idx + 2}
                    </kbd>
                  </div>
                </div>
                {/* Bottom fill line on hover — contained properly */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Sephirah Query Interface (WIP placeholder) ── */}
        <div className="flex-1 border-t border-gold/20 relative overflow-hidden flex flex-col min-h-[220px]">

          {/* Section header */}
          <div className="flex items-center justify-between bg-gold/5 border-b border-gold/15 px-6 py-2 shrink-0">
            <span className="section-label tracking-[0.2em]">Sephirah Query Interface</span>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-tier-aleph"
              />
              <span className="font-mono text-xs text-tier-aleph/70 tracking-widest">OFFLINE</span>
            </div>
          </div>

          {/* Ghost chat content — visible but locked */}
          <div className="flex-1 px-6 py-5 space-y-4 select-none pointer-events-none opacity-25">
            <div className="flex gap-3 items-start">
              <span className="font-mono text-xs text-gold shrink-0 pt-1">FAUST ›</span>
              <p className="text-sm text-moonstone italic">This terminal is not yet operational. Stand by.</p>
            </div>
            <div className="flex justify-end">
              <p className="text-sm text-moonstone-dark/60 bg-navy-800/40 border border-gold/10 px-4 py-2 max-w-sm font-mono text-xs">
                What work type is safe for Spider Bud?
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="font-mono text-xs text-gold shrink-0 pt-1">FAUST ›</span>
              <p className="text-sm text-moonstone italic">Query processing suspended pending system activation.</p>
            </div>
          </div>

          {/* Ghost input row */}
          <div className="shrink-0 border-t border-gold/15 px-4 py-3 flex gap-3 opacity-20 pointer-events-none select-none">
            <div
              className="flex-1 bg-navy-900/60 border border-gold/20 px-4 py-2 text-sm font-mono text-moonstone-dark/40"
              style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
            >
              Query the compendium…
            </div>
            <div className="border border-gold/20 text-gold/40 font-mono text-xs px-5 py-2 tracking-widest uppercase flex items-center">
              Send
            </div>
          </div>

          {/* WIP overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(0,255,153,0.015) 18px, rgba(0,255,153,0.015) 36px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="border border-gold/30 bg-navy-950/90 px-10 py-6 text-center space-y-2.5"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
            >
              <p
                className="font-display text-lg text-gold/80 tracking-[0.3em] uppercase font-semibold"
                style={{ textShadow: '0 0 20px rgba(0,255,153,0.3)' }}
              >
                Work In Progress
              </p>
              <p className="font-mono text-xs text-moonstone-dark/50 tracking-widest mt-1">
                Sephirah Query Interface — Pending Implementation
              </p>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
