import { motion } from 'framer-motion'

const EmojiReaction = ({ emoji, label }) => {
  return (
    <motion.span
      className="inline-block cursor-default select-none"
      whileHover={{ 
        scale: 1.3,
        rotate: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      }}
      whileTap={{ scale: 0.9 }}
      title={label}
    >
      {emoji}
    </motion.span>
  )
}

export default EmojiReaction
