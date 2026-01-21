import { motion } from 'framer-motion'
import { useState } from 'react'
import FormattedMessage from './FormattedMessage'

const MessageBubble = ({ message, index, onRetry, onQuestionClick }) => {
  const isUser = message.role === 'user'
  const [showRetry, setShowRetry] = useState(false)
  
  // Check if message is error or incomplete
  const isError = message.content?.includes('Maaf, terjadi kesalahan') || 
                  message.content?.includes('⚠️') ||
                  message.content?.includes('error')
  
  const isIncomplete = !isUser && message.content && message.content.length < 50

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2 sm:gap-3`}
    >
      {!isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 }
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex-shrink-0 cursor-pointer"
        >
          <motion.div 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-base sm:text-xl shadow-lg"
            animate={{ 
              boxShadow: [
                "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                "0 10px 15px -3px rgba(59, 130, 246, 0.5)",
                "0 10px 15px -3px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏥
          </motion.div>
        </motion.div>
      )}

      <div className="flex flex-col gap-2 max-w-[85%] sm:max-w-[75%]">
        <motion.div
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => !isUser && setShowRetry(true)}
          onHoverEnd={() => setShowRetry(false)}
          className={`px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg relative ${
            isUser
              ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-br-sm'
              : 'bg-white text-gray-800 rounded-bl-sm'
          }`}
        >
          {isUser ? (
            <>
              {/* Display images for user messages */}
              {message.images && message.images.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {message.images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="relative group"
                    >
                      <img
                        src={img.preview}
                        alt={img.name}
                        className="max-w-full sm:max-w-xs rounded-lg border-2 border-white/20 group-hover:border-white/40 transition-all"
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center"
                      >
                        <span className="text-3xl">📸</span>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{message.content}</p>
            </>
          ) : (
            <>
              <FormattedMessage content={message.content} images={message.images || []} />
              
              {/* Retry Button - Show on hover or if error/incomplete */}
              {onRetry && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: (showRetry || isError || isIncomplete) ? 1 : 0,
                    y: (showRetry || isError || isIncomplete) ? 0 : 10
                  }}
                  className="mt-3 pt-3 border-t border-gray-200 flex gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onRetry(index)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs sm:text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Ulangi Prompt</span>
                  </motion.button>
                  
                  {(isError || isIncomplete) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1 text-xs text-gray-500 italic"
                    >
                      <span>⚠️</span>
                      <span>{isError ? 'Error terdeteksi' : 'Response mungkin tidak lengkap'}</span>
                    </motion.span>
                  )}
                </motion.div>
              )}
            </>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className={`text-[10px] sm:text-xs mt-1 sm:mt-2 ${isUser ? 'text-white/80' : 'text-gray-500'}`}
          >
            {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </motion.div>
        </motion.div>

        {/* Category Questions */}
        {!isUser && message.categoryQuestions && message.categoryQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {message.categoryQuestions.map((question, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onQuestionClick && onQuestionClick(question)}
                className="bg-white hover:bg-primary/10 text-gray-700 hover:text-primary px-3 py-2 rounded-lg text-xs sm:text-sm shadow-md transition-all border border-gray-200 hover:border-primary"
              >
                {question}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ 
            scale: 1.1,
            rotate: [0, 5, -5, 5, 0],
            transition: { duration: 0.5 }
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex-shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-base sm:text-xl shadow-lg">
            👤
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default MessageBubble
