import ReactMarkdown from 'react-markdown'
import { motion } from 'framer-motion'
import EmojiReaction from './EmojiReaction'

const FormattedMessage = ({ content, images = [] }) => {
  // Function to add contextual emojis based on keywords
  const addContextualEmojis = (text) => {
    if (typeof text !== 'string') return text
    
    const emojiMap = {
      // Medical & Health
      'imunisasi|vaksin|suntik': '💉',
      'vitamin|suplemen|nutrisi': '💊',
      'obat|paracetamol|antibiotik': '💊',
      'demam|panas': '🌡️',
      'sakit|nyeri': '😷',
      'sehat|sembuh|baik': '✨',
      'dokter|medis|konsultasi': '👨‍⚕️',
      'rumah sakit|klinik|puskesmas': '🏥',
      
      // Baby & Child
      'bayi|balita|anak': '👶',
      'ibu|mama|bunda': '🤱',
      'hamil|kehamilan|pregnant': '🤰',
      'ASI|menyusui|laktasi': '🍼',
      'MPASI|makanan bayi': '🥣',
      'tumbuh kembang|pertumbuhan': '📈',
      
      // Food & Nutrition
      'makan|makanan|menu': '🍽️',
      'buah|sayur': '🥗',
      'susu|dairy': '🥛',
      'protein|daging|telur': '🍳',
      'gizi|nutrisi': '🥗',
      
      // Time & Schedule
      'jadwal|waktu|schedule': '📅',
      'bulan|usia': '📆',
      'hari|harian': '🗓️',
      
      // Warning & Important
      'penting|perhatian|warning': '⚠️',
      'bahaya|risiko|hati-hati': '⚠️',
      'darurat|emergency': '🚨',
      
      // Positive
      'bagus|baik|sempurna': '👍',
      'terima kasih|thanks': '🙏',
      'selamat|congratulations': '🎉',
      
      // Tips & Info
      'tips|saran|rekomendasi': '💡',
      'informasi|info|catatan': 'ℹ️',
      'cara|langkah|step': '📝',
    }
    
    return text
  }
  // Clean up escaped characters and formatting issues
  const cleanContent = content
    .replace(/\\n/g, '\n')  // Replace \n with actual newline
    .replace(/\\"/g, '"')   // Replace \" with "
    .replace(/\\\\/g, '\\') // Replace \\ with \
    .replace(/\\\{/g, '{')  // Replace \{ with {
    .replace(/\\\}/g, '}')  // Replace \} with }
  
  // Split content by image markers [IMAGE:0], [IMAGE:1], etc.
  const parts = cleanContent.split(/(\[IMAGE:\d+\])/g)
  
  return (
    <div className="formatted-message prose prose-sm sm:prose max-w-none">
      {parts.map((part, index) => {
        // Check if this part is an image marker
        const imageMatch = part.match(/\[IMAGE:(\d+)\]/)
        
        if (imageMatch) {
          const imageIndex = parseInt(imageMatch[1])
          const image = images[imageIndex]
          
          if (image) {
            return (
              <motion.div 
                key={index} 
                className="my-4 group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="max-w-full rounded-lg border-2 border-primary/20 shadow-md group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
                  >
                    <EmojiReaction emoji="📸" label="Uploaded Image" />
                  </motion.div>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic flex items-center gap-1">
                  <EmojiReaction emoji="📎" label="Attachment" />
                  {image.name}
                </p>
              </motion.div>
            )
          }
          return null
        }
        
        // Regular markdown content
        return (
          <ReactMarkdown
            key={index}
            components={{
              // Headings with contextual emojis
              h1: ({ children }) => {
                const text = String(children)
                let emoji = '🏥'
                
                if (/imunisasi|vaksin/i.test(text)) emoji = '💉'
                else if (/gizi|nutrisi|makanan/i.test(text)) emoji = '🥗'
                else if (/tumbuh|kembang/i.test(text)) emoji = '📈'
                else if (/ibu|hamil/i.test(text)) emoji = '🤰'
                else if (/bayi|anak/i.test(text)) emoji = '👶'
                else if (/obat|vitamin/i.test(text)) emoji = '💊'
                
                return (
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-lg sm:text-xl font-bold text-primary mb-3 mt-4 first:mt-0 flex items-center gap-2"
                  >
                    <EmojiReaction emoji={emoji} label="Topic" />
                    <span>{children}</span>
                  </motion.h1>
                )
              },
              h2: ({ children }) => {
                const text = String(children)
                let emoji = '📋'
                
                if (/analisis|hasil/i.test(text)) emoji = '🔍'
                else if (/informasi|info/i.test(text)) emoji = 'ℹ️'
                else if (/tips|saran/i.test(text)) emoji = '💡'
                else if (/cara|langkah/i.test(text)) emoji = '📝'
                else if (/penting|perhatian/i.test(text)) emoji = '⚠️'
                else if (/manfaat|kegunaan/i.test(text)) emoji = '✨'
                
                return (
                  <motion.h2 
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-base sm:text-lg font-bold text-primary mb-2 mt-3 first:mt-0 flex items-center gap-2"
                  >
                    <EmojiReaction emoji={emoji} label="Section" />
                    <span>{children}</span>
                  </motion.h2>
                )
              },
              h3: ({ children }) => {
                const text = String(children)
                let emoji = '▪️'
                
                if (/dosis|takaran/i.test(text)) emoji = '⚖️'
                else if (/efek|samping/i.test(text)) emoji = '⚠️'
                else if (/komposisi|kandungan/i.test(text)) emoji = '🧪'
                else if (/aturan|pakai/i.test(text)) emoji = '📋'
                
                return (
                  <motion.h3 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm sm:text-base font-semibold text-gray-800 mb-2 mt-2 first:mt-0 flex items-center gap-2"
                  >
                    <EmojiReaction emoji={emoji} label="Subsection" />
                    <span>{children}</span>
                  </motion.h3>
                )
              },
              
              // Paragraphs
              p: ({ children }) => (
                <p className="mb-3 last:mb-0 leading-relaxed text-sm sm:text-base">
                  {children}
                </p>
              ),
              
              // Lists with animated bullets
              ul: ({ children }) => (
                <ul className="space-y-2 mb-3 ml-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-2 mb-3 ml-4 list-decimal">
                  {children}
                </ol>
              ),
              li: ({ children }) => {
                const text = String(children)
                let emoji = '•'
                
                // Contextual emoji for list items
                if (/fungsi|manfaat|kegunaan/i.test(text)) emoji = '✅'
                else if (/efek samping|risiko|bahaya/i.test(text)) emoji = '⚠️'
                else if (/dosis|takaran/i.test(text)) emoji = '💊'
                else if (/cara|langkah/i.test(text)) emoji = '👉'
                else if (/tips|saran/i.test(text)) emoji = '💡'
                else if (/penting|perhatian/i.test(text)) emoji = '❗'
                else if (/vitamin|nutrisi/i.test(text)) emoji = '🌟'
                
                return (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2 text-sm sm:text-base leading-relaxed"
                  >
                    <span className="text-primary mt-0.5 flex-shrink-0">
                      <EmojiReaction emoji={emoji} label="Point" />
                    </span>
                    <span className="flex-1">{children}</span>
                  </motion.li>
                )
              },
              
              // Strong/Bold with emphasis
              strong: ({ children }) => {
                const text = String(children)
                let prefix = ''
                
                if (/penting|perhatian/i.test(text)) prefix = '⚠️ '
                else if (/catatan|note/i.test(text)) prefix = '📌 '
                else if (/tips|saran/i.test(text)) prefix = '💡 '
                else if (/informasi|info/i.test(text)) prefix = 'ℹ️ '
                
                return (
                  <strong className="font-bold text-primary">
                    {prefix && <EmojiReaction emoji={prefix.trim()} label="Emphasis" />}
                    {prefix && ' '}
                    {children}
                  </strong>
                )
              },
              
              // Emphasis/Italic
              em: ({ children }) => (
                <em className="italic text-gray-700">
                  {children}
                </em>
              ),
              
              // Code
              code: ({ inline, children }) => 
                inline ? (
                  <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono">
                    {children}
                  </code>
                ) : (
                  <code className="block bg-gray-100 text-gray-800 p-3 rounded-lg text-xs sm:text-sm font-mono overflow-x-auto mb-3">
                    {children}
                  </code>
                ),
              
              // Blockquote with icon
              blockquote: ({ children }) => (
                <motion.blockquote 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-l-4 border-primary bg-primary/5 pl-4 py-2 mb-3 italic flex gap-2"
                >
                  <span className="flex-shrink-0">
                    <EmojiReaction emoji="💬" label="Quote" />
                  </span>
                  <span className="flex-1">{children}</span>
                </motion.blockquote>
              ),
              
              // Links
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-secondary transition-colors"
                >
                  {children}
                </a>
              ),
              
              // Images - Handle external images
              img: ({ src, alt }) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="my-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary/30 transition-colors"
                >
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <EmojiReaction emoji="📎" label="Reference" />
                    <strong>Referensi Gambar:</strong>
                  </p>
                  <a 
                    href={src} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary text-sm underline hover:text-secondary transition-colors break-all flex items-center gap-1"
                  >
                    <EmojiReaction emoji="🔗" label="Link" />
                    {alt || 'Lihat gambar'}
                  </a>
                  <p className="text-xs text-gray-500 mt-1">
                    (Klik untuk membuka di tab baru)
                  </p>
                </motion.div>
              ),
            }}
          >
            {part}
          </ReactMarkdown>
        )
      })}
    </div>
  )
}

export default FormattedMessage
