import { motion } from 'framer-motion'

const DoctorAnimation = () => {
  return (
    <div className="relative h-64 mb-8 overflow-hidden">
      {/* Background elements */}
      <motion.div
        className="absolute top-10 left-10 w-16 h-16 bg-primary/20 rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-20 h-20 bg-accent/20 rounded-full"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />

      {/* Doctor character */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          {/* Head */}
          <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full relative mx-auto">
            {/* Eyes */}
            <div className="absolute top-8 left-5 w-2 h-2 bg-gray-800 rounded-full" />
            <div className="absolute top-8 right-5 w-2 h-2 bg-gray-800 rounded-full" />
            {/* Smile */}
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-3 border-b-2 border-gray-800 rounded-full"
              animate={{ scaleX: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          {/* Body */}
          <div className="w-24 h-32 bg-gradient-to-br from-primary to-secondary rounded-t-3xl rounded-b-lg mx-auto -mt-2">
            {/* Stethoscope */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-1 h-12 bg-gray-700" />
            <div className="absolute top-32 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-700 rounded-full border-2 border-gray-800" />
          </div>

          {/* Arms */}
          <motion.div
            className="absolute top-24 -left-6 w-6 h-20 bg-primary rounded-full"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-24 -right-6 w-6 h-20 bg-primary rounded-full"
            animate={{ rotate: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Patient character */}
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="relative"
        >
          {/* Head */}
          <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full relative mx-auto">
            {/* Eyes */}
            <div className="absolute top-6 left-4 w-2 h-2 bg-gray-800 rounded-full" />
            <div className="absolute top-6 right-4 w-2 h-2 bg-gray-800 rounded-full" />
            {/* Smile */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-6 h-2 border-b-2 border-gray-800 rounded-full" />
          </div>
          
          {/* Body */}
          <div className="w-20 h-28 bg-gradient-to-br from-purple-400 to-purple-500 rounded-t-3xl rounded-b-lg mx-auto -mt-2" />
        </motion.div>
      </div>

      {/* Chat bubbles */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        className="absolute top-8 left-1/4 -translate-x-12 bg-white px-4 py-2 rounded-2xl shadow-lg"
      >
        <p className="text-xs font-medium text-gray-700">Ada yang bisa dibantu?</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        className="absolute top-8 right-1/4 translate-x-12 bg-primary/20 px-4 py-2 rounded-2xl shadow-lg"
      >
        <p className="text-xs font-medium text-gray-700">Terima kasih! 😊</p>
      </motion.div>
    </div>
  )
}

export default DoctorAnimation
