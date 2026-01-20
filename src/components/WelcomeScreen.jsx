import { motion } from 'framer-motion'
import DoctorAnimation from './DoctorAnimation'

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 sm:mb-8"
          >
            <motion.img
              src="/icon-posyandu.jpeg"
              alt="Posyandu Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 rounded-full shadow-lg"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 sm:mb-4 px-2">
              Posyandu Menur AI
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-1 sm:mb-2 px-2">
              Asisten Kesehatan Cerdas & Terpercaya
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Melayani dengan Sepenuh Hati
            </p>
          </motion.div>

          <div className="hidden sm:block">
            <DoctorAnimation />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            {[
              { icon: '🏥', title: 'Konsultasi 24/7', desc: 'Layanan kapan saja' },
              { icon: '👶', title: 'Kesehatan Ibu & Anak', desc: 'Spesialis posyandu' },
              { icon: '💊', title: 'Saran Medis', desc: 'Informasi terpercaya' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center"
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{item.icon}</div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Mulai Konsultasi Sekarang →
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default WelcomeScreen
