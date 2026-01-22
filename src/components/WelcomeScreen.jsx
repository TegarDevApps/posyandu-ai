import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import DoctorAnimation from './DoctorAnimation'
import konsultasiAnimation from '../assets/card-konsultasi-24.json'
import kesehatanAnimation from '../assets/card-kesehatan-bu-anak.json'
import saranMedisAnimation from '../assets/card-saran-medis.json'

const WelcomeScreen = ({ onStart }) => {
  const categories = [
    {
      id: 'posyandu',
      animation: konsultasiAnimation,
      icon: '',
      title: 'Posyandu',
      items: ['Pelayanan Ibu Hamil', 'Pelayanan Kesehatan Ibu dan Anak', 'Pelayanan Imunisasi']
    },
    {
      id: 'posbindu',
      animation: kesehatanAnimation,
      icon: '',
      title: 'Posbindu',
      items: ['Pencegahan PTM (Penyakit Tidak Menular)', 'Pengukuran IMT (Indeks Masa Tubuh)']
    },
    {
      id: 'bkb',
      animation: saranMedisAnimation,
      icon: '',
      title: 'BKB',
      items: ['Kelas BKB', 'Kartika School', 'Stimulasi Tumbuh Kembang Anak']
    },
    {
      id: 'lainnya',
      animation: konsultasiAnimation,
      icon: '',
      title: 'Lainnya',
      items: ['Konsultasi Umum', 'Informasi Kesehatan', 'Tanya Jawab']
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 sm:mb-8"
          >
            <motion.img
              src="/posyandu-icon-fix.jpeg"
              alt="Posyandu Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 rounded-full shadow-lg object-cover"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 sm:mb-4 px-2">
              Posyandu Menur 027
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-1 sm:mb-2 px-2">
              Asisten Kesehatan Cerdas & Terpercaya
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Pilih layanan yang Anda butuhkan
            </p>
          </motion.div>

          <div className="hidden sm:block mb-6">
            <DoctorAnimation />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            {categories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => onStart(category)}
                className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3">
                  <Lottie 
                    animationData={category.animation} 
                    loop={true}
                    autoplay={true}
                  />
                </div>
                <div className="text-2xl sm:text-3xl mb-2">{category.icon}</div>
                <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2">{category.title}</h3>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 text-left">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStart(null)}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Atau Mulai Konsultasi Langsung →
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default WelcomeScreen
