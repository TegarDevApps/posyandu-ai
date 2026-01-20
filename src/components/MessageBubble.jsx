import { motion } from 'framer-motion'
import FormattedMessage from './FormattedMessage'

const MessageBubble = ({ message, index }) => {
  const isUser = message.role === 'user'

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

      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg ${
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
          <FormattedMessage content={message.content} images={message.images || []} />
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
