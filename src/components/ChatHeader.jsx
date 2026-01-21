import { motion } from 'framer-motion'

const ChatHeader = ({ onMenuClick, sidebarOpen, onBackToWelcome }) => {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-primary to-secondary text-white p-3 sm:p-4 shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Back Button */}
        {onBackToWelcome && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBackToWelcome}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors flex-shrink-0"
            title="Kembali ke halaman utama"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </motion.button>
        )}
        
        {/* Menu Button - Toggle sidebar */}
        <button
          onClick={onMenuClick}
          className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors flex-shrink-0"
          title={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
        >
          {sidebarOpen ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <motion.img
          src="/new-icon-posyandu.png"
          alt="Posyandu"
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-lg flex-shrink-0 object-cover"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold flex items-center gap-1 sm:gap-2 flex-wrap">
            <span className="truncate">Posyandu Menur 027</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[10px] sm:text-xs bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap"
            >
              Online
            </motion.span>
          </h2>
          <motion.p
            className="text-xs sm:text-sm text-white/90 hidden sm:block"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Siap membantu Anda 24/7
          </motion.p>
        </div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl sm:text-3xl flex-shrink-0"
        >
          🏥
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ChatHeader
