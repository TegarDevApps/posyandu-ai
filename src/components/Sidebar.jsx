import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const Sidebar = ({ sessions, currentSessionId, onNewChat, onSelectSession, onDeleteSession, isOpen, onClose, onToggle }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleDelete = (e, sessionId) => {
    e.stopPropagation()
    if (deleteConfirm === sessionId) {
      onDeleteSession(sessionId)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(sessionId)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Hari ini'
    if (days === 1) return 'Kemarin'
    if (days < 7) return `${days} hari lalu`
    if (days < 30) return `${Math.floor(days / 7)} minggu lalu`
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  const groupedSessions = sessions.reduce((acc, session) => {
    const date = new Date(session.updatedAt)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    let group = 'Lebih Lama'
    if (days === 0) group = 'Hari Ini'
    else if (days === 1) group = 'Kemarin'
    else if (days < 7) group = '7 Hari Terakhir'
    else if (days < 30) group = '30 Hari Terakhir'
    
    if (!acc[group]) acc[group] = []
    acc[group].push(session)
    return acc
  }, {})

  const groupOrder = ['Hari Ini', 'Kemarin', '7 Hari Terakhir', '30 Hari Terakhir', 'Lebih Lama']

  return (
    <>
      {/* Overlay for mobile only */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed on mobile, relative on desktop */}
      <motion.div
        initial={false}
        animate={{ 
          width: isOpen ? 320 : 0
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:relative left-0 top-0 h-screen bg-white shadow-2xl flex flex-col overflow-hidden z-50 lg:z-auto flex-shrink-0"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary to-secondary flex-shrink-0">
          <div className="flex items-center gap-2">
            <img src="/icon-posyandu.jpeg" alt="Logo" className="w-8 h-8 rounded-full" />
            <h2 className="font-bold text-white text-lg">Riwayat Chat</h2>
          </div>
          <button
            onClick={onToggle}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            title="Tutup sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onNewChat()
            }}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Obrolan Baru
          </motion.button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-hide">
          {groupOrder.map(group => {
            const groupSessions = groupedSessions[group]
            if (!groupSessions || groupSessions.length === 0) return null

            return (
              <div key={group} className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">{group}</h3>
                <div className="space-y-1">
                  {groupSessions.map(session => (
                    <motion.div
                      key={session.id}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        onSelectSession(session.id)
                      }}
                      className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                        session.id === currentSessionId
                          ? 'bg-primary/10 border-l-4 border-primary'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            session.id === currentSessionId ? 'text-primary' : 'text-gray-800'
                          }`}>
                            {session.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {session.messages.length} pesan • {formatDate(session.updatedAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDelete(e, session.id)}
                          className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-100 ${
                            deleteConfirm === session.id ? 'opacity-100 bg-red-100' : ''
                          }`}
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      {deleteConfirm === session.id && (
                        <p className="text-xs text-red-500 mt-1">Klik lagi untuk hapus</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}

          {sessions.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">Belum ada riwayat chat</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-500 text-center">
            💾 Riwayat tersimpan otomatis
          </p>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar
