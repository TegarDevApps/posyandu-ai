import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import ChatHeader from './ChatHeader'
import Sidebar from './Sidebar'
import ImageUpload from './ImageUpload'
import { useChatHistory } from '../hooks/useChatHistory'

const ChatInterface = () => {
  const {
    sessions,
    currentSession,
    currentSessionId,
    createNewSession,
    updateSessionMessages,
    deleteSession,
    switchSession
  } = useChatHistory()

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true) // Default true for desktop
  const [selectedImages, setSelectedImages] = useState([])
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const messages = currentSession?.messages || []

  // Auto-close sidebar on mobile, keep open on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Detect scroll position
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200
      setShowScrollButton(!isNearBottom)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const sendMessage = async (e) => {
    e.preventDefault()
    if ((!input.trim() && selectedImages.length === 0) || isLoading || !currentSession) return

    // Build user message with text and images
    let userMessageContent = input
    const imageData = selectedImages.map(img => ({
      preview: img.preview,
      name: img.name
    }))

    const userMessage = { 
      role: 'user', 
      content: userMessageContent,
      images: imageData.length > 0 ? imageData : undefined
    }
    
    const updatedMessages = [...messages, userMessage]
    updateSessionMessages(currentSessionId, updatedMessages)
    setInput('')
    setSelectedImages([])
    setIsLoading(true)

    try {
      let aiResponse = ''

      // If there are images, use Google Gemini
      if (imageData.length > 0) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const systemPrompt = `Anda adalah asisten AI untuk Posyandu Menur yang ramah, profesional, dan berpengetahuan luas tentang kesehatan. Fokus utama Anda adalah:

1. Kesehatan Ibu dan Anak (KIA)
2. Imunisasi dan jadwal vaksinasi
3. Gizi dan nutrisi balita
4. Tumbuh kembang anak
5. Kesehatan ibu hamil dan menyusui
6. Keluarga berencana (KB)
7. Pemeriksaan kesehatan rutin
8. Pencegahan penyakit

Analisis gambar dengan detail dan berikan informasi medis yang relevan.

PENTING - FORMAT JAWABAN:
- Gunakan format Markdown untuk struktur yang jelas
- Gunakan **bold** untuk poin penting
- Gunakan bullet points (•) atau numbering untuk list
- Pisahkan paragraf dengan jelas
- Gunakan heading (##) untuk topik utama

Berikan jawaban yang mudah dipahami, akurat, dan terstruktur dengan baik menggunakan markdown.
Selalu ingatkan bahwa informasi yang diberikan bersifat edukatif dan tidak menggantikan konsultasi medis langsung.`

        // Convert base64 images to Gemini format
        const imageParts = imageData.map(img => {
          const base64Data = img.preview.split(',')[1]
          const mimeType = img.preview.split(',')[0].split(':')[1].split(';')[0]
          return {
            inlineData: {
              data: base64Data,
              mimeType: mimeType || 'image/jpeg'
            }
          }
        })

        const prompt = `${systemPrompt}\n\nPertanyaan user: ${userMessageContent || 'Tolong analisis gambar ini'}`
        
        try {
          const result = await model.generateContent([prompt, ...imageParts])
          const response = await result.response
          aiResponse = response.text()
        } catch (geminiError) {
          console.error('Gemini error:', geminiError)
          throw new Error(`Gemini API error: ${geminiError.message}`)
        }
      } else {
        // Text-only: use Groq
        const apiMessages = []
        
        // Add system message
        apiMessages.push({
          role: 'system',
          content: `Anda adalah asisten AI untuk Posyandu Menur yang ramah, profesional, dan berpengetahuan luas tentang kesehatan. Fokus utama Anda adalah:

1. Kesehatan Ibu dan Anak (KIA)
2. Imunisasi dan jadwal vaksinasi
3. Gizi dan nutrisi balita
4. Tumbuh kembang anak
5. Kesehatan ibu hamil dan menyusui
6. Keluarga berencana (KB)
7. Pemeriksaan kesehatan rutin
8. Pencegahan penyakit

PENTING - FORMAT JAWABAN:
- Gunakan format Markdown untuk struktur yang jelas
- Gunakan **bold** untuk poin penting
- Gunakan bullet points (•) atau numbering untuk list
- Pisahkan paragraf dengan jelas
- Gunakan heading (##) untuk topik utama
- Buat jawaban yang mudah di-scan dan dibaca
- Hindari paragraf panjang, pecah menjadi poin-poin

Berikan jawaban yang:
- Mudah dipahami dan ramah
- Berbasis informasi medis yang akurat
- Empati dan mendukung
- Terstruktur dengan baik menggunakan markdown
- Menyarankan konsultasi langsung dengan tenaga medis untuk kasus serius
- Menggunakan bahasa Indonesia yang baik

Selalu ingatkan bahwa informasi yang diberikan bersifat edukatif dan tidak menggantikan konsultasi medis langsung.`
        })

        // Add conversation history
        for (const msg of updatedMessages) {
          if (msg.role === 'assistant' || msg.role === 'user') {
            if (!msg.images) {
              apiMessages.push({
                role: msg.role,
                content: typeof msg.content === 'string' ? msg.content : String(msg.content || '')
              })
            }
          }
        }

        const response = await axios.post(
          import.meta.env.VITE_OPENAI_API_URL,
          {
            model: import.meta.env.VITE_OPENAI_MODEL,
            messages: apiMessages
          },
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': window.location.origin,
              'X-Title': 'Posyandu AI Chat'
            }
          }
        )

        aiResponse = response.data.choices[0].message.content
      }

      const aiMessage = {
        role: 'assistant',
        content: aiResponse
      }
      const finalMessages = [...updatedMessages, aiMessage]
      updateSessionMessages(currentSessionId, finalMessages)
    } catch (error) {
      console.error('Error details:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error message:', error.message)
      
      let errorMessage = 'Maaf, terjadi kesalahan. Silakan coba lagi dalam beberapa saat. 🙏'
      
      // Gemini API errors
      if (error.message?.includes('API key')) {
        errorMessage = '⚠️ Gemini API key tidak valid atau belum diset. Silakan periksa file .env dan pastikan VITE_GEMINI_API_KEY sudah diisi dengan benar.'
      } else if (error.message?.includes('quota')) {
        errorMessage = '⚠️ Quota Gemini API habis. Silakan tunggu beberapa saat atau gunakan API key lain.'
      } else if (error.response?.status === 402) {
        errorMessage = '⚠️ API key kehabisan kredit. Silakan top up saldo atau gunakan API key yang berbeda.'
      } else if (error.response?.status === 401) {
        errorMessage = '⚠️ API key tidak valid. Silakan periksa kembali API key Anda di file .env'
      } else if (error.response?.data?.error?.message) {
        errorMessage = `Maaf, terjadi kesalahan: ${error.response.data.error.message}`
      } else if (error.message) {
        errorMessage = `Maaf, terjadi kesalahan: ${error.message}`
      }
      
      const errorMsg = {
        role: 'assistant',
        content: errorMessage
      }
      const finalMessages = [...updatedMessages, errorMsg]
      updateSessionMessages(currentSessionId, finalMessages)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const quickQuestions = [
    '📅 Jadwal imunisasi bayi',
    '🍼 Tips ASI eksklusif',
    '👶 Tumbuh kembang anak',
    '🤰 Kesehatan ibu hamil',
    '🥗 Menu MPASI',
    '💊 Vitamin untuk balita'
  ]

  return (
    <div className="h-screen overflow-hidden flex">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={createNewSession}
        onSelectSession={switchSession}
        onDeleteSession={deleteSession}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <ChatHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen}
        />

        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 scrollbar-hide"
        >
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 pb-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} index={index} />
              ))}
            </AnimatePresence>
            
            {isLoading && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Scroll to Bottom Button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToBottom}
              className="fixed bottom-24 right-4 sm:right-8 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-secondary transition-colors z-40"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4"
          >
            <div className="max-w-4xl mx-auto">
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 text-center">Pertanyaan populer:</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                {quickQuestions.map((question, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInput(question)}
                    className="bg-white/80 backdrop-blur-sm px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Input Area - Sticky at bottom */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-2 sm:p-3 md:p-4 safe-area-bottom shadow-lg z-30">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto space-y-2">
          {/* Image Upload */}
          <ImageUpload
            onImageSelect={(img) => setSelectedImages(prev => [...prev, img])}
            selectedImages={selectedImages}
            onRemoveImage={(idx) => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
          />
          
          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage(e)
                  }
                }}
                placeholder="Ketik pertanyaan atau upload gambar..."
                className="w-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 pr-10 sm:pr-12 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none resize-none bg-white/90 backdrop-blur-sm transition-all text-sm sm:text-base"
                rows="1"
                style={{ maxHeight: '120px' }}
              />
              <motion.div
                className="absolute right-2 sm:right-3 md:right-4 bottom-2 sm:bottom-3 md:bottom-4 text-gray-400 text-sm sm:text-base"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💬
              </motion.div>
            </div>
            <motion.button
              type="submit"
              disabled={(!input.trim() && selectedImages.length === 0) || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary to-secondary text-white p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </motion.button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
