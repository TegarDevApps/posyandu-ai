import { motion } from 'framer-motion'

const TypingIndicator = () => {
  return (
    <div className="flex justify-start gap-2 sm:gap-3">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-base sm:text-xl shadow-lg flex-shrink-0">
        🏥
      </div>
      <div className="bg-white px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl rounded-bl-sm shadow-lg">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
