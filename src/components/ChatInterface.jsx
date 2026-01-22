import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import ChatHeader from './ChatHeader'
import Sidebar from './Sidebar'
import ImageUpload from './ImageUpload'
import { useChatHistory } from '../hooks/useChatHistory'

const ChatInterface = ({ initialCategory = null, onBackToWelcome }) => {
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
  const [categoryInitialized, setCategoryInitialized] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const messages = currentSession?.messages || []

  // Category prompts
  const getCategoryPrompt = (category) => {
    if (!category) return null

    const prompts = {
      posyandu: {
        greeting: `Selamat datang di layanan **Posyandu Menur 027**! 🏥\n\nSaya siap membantu Anda dengan:\n\n• **Pelayanan Ibu Hamil** - Pemeriksaan kehamilan, nutrisi ibu hamil, persiapan persalinan\n• **Pelayanan Kesehatan Ibu dan Anak** - Pemeriksaan kesehatan rutin, tumbuh kembang anak\n• **Pelayanan Imunisasi** - Jadwal imunisasi, jenis vaksin, efek samping\n\nAda yang ingin Anda tanyakan tentang layanan Posyandu? Silakan pilih topik atau tanyakan langsung! 😊`,
        questions: [
          '🤰 Jadwal pemeriksaan ibu hamil',
          '👶 Imunisasi bayi lengkap',
          '📊 Pemantauan tumbuh kembang',
          '🍎 Nutrisi ibu hamil',
          '🥗 Gizi seimbang pada balita',
          '🤱 Postnatal care'
        ]
      },
      posbindu: {
        greeting: `Selamat datang di layanan **Posbindu (Pos Pembinaan Terpadu)**! 💊\n\nSaya siap membantu Anda dengan:\n\n• **Pencegahan PTM** - Informasi tentang Penyakit Tidak Menular (diabetes, hipertensi, kolesterol)\n• **Pengukuran IMT** - Cara menghitung dan memahami Indeks Masa Tubuh\n• **Pola Hidup Sehat** - Tips diet, olahraga, dan gaya hidup sehat\n\nApa yang ingin Anda ketahui tentang kesehatan dan pencegahan penyakit? 💪`,
        questions: [
          '📏 Cara hitung IMT',
          '💉 Cek gula darah rutin',
          '❤️ Pencegahan hipertensi',
          '🥗 Menu diet sehat',
          '🩸 Pencegahan anemia',
          '🚭 Bahaya asap rokok',
          '🧈 Pencegahan kolesterol'
        ]
      },
      bkb: {
        greeting: `Selamat datang di layanan **BKB (Bina Keluarga Balita)**! 👶\n\nSaya siap membantu Anda dengan:\n\n• **Kelas BKB** - Program pembelajaran untuk orang tua balita\n• **Kartika School** - Pendidikan anak usia dini\n• **Stimulasi Tumbuh Kembang** - Aktivitas untuk mengoptimalkan perkembangan anak\n\nAda yang ingin Anda tanyakan tentang tumbuh kembang dan pendidikan anak? 🌟`,
        questions: [
          '🎨 Stimulasi anak 0-5 tahun',
          '📚 Program Kartika School',
          '🧩 Mainan edukatif',
          '👨‍👩‍👧 Tips parenting'
        ]
      },
      lainnya: {
        greeting: `Selamat datang di **Posyandu Menur 027**! 💬\n\nSaya siap membantu Anda dengan berbagai informasi kesehatan:\n\n• Konsultasi kesehatan umum\n• Informasi obat dan vitamin\n• Tips kesehatan keluarga\n• Pertanyaan seputar layanan Posyandu\n\nAda yang bisa saya bantu hari ini? Silakan tanyakan apa saja! 😊`,
        questions: [
          '💊 Informasi obat',
          '🏥 Layanan Posyandu',
          '📅 Jadwal kegiatan',
          '📞 Kontak'
        ]
      }
    }

    return prompts[category.id] || prompts.lainnya
  }

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

  // Initialize with category greeting - CREATE NEW CHAT
  useEffect(() => {
    if (initialCategory && !categoryInitialized) {
      setCategoryInitialized(true)
      
      // Create new session (will have default greeting)
      const newSession = createNewSession()
      
      // Wait a bit for session to be created, then replace default greeting with category greeting
      setTimeout(() => {
        const categoryPrompt = getCategoryPrompt(initialCategory)
        if (categoryPrompt) {
          // Replace default greeting with category greeting
          const greetingMessage = {
            role: 'assistant',
            content: categoryPrompt.greeting,
            categoryQuestions: categoryPrompt.questions
          }
          
          // Replace the default message with category greeting
          updateSessionMessages(newSession.id, [greetingMessage])
        }
      }, 50)
    }
  }, [initialCategory, categoryInitialized])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Disable auto scroll - let user scroll manually
  // useEffect(() => {
  //   if (!isTyping) {
  //     scrollToBottom()
  //   }
  // }, [messages, isTyping])

  // Smooth scroll during typing
  // useEffect(() => {
  //   if (isTyping) {
  //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  //   }
  // }, [typingText, isTyping])

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

  // Get enhanced system prompt based on category
  const getSystemPrompt = (hasImages = false) => {
    let basePrompt = `Anda adalah asisten AI untuk Posyandu Menur 027 yang ramah, profesional, dan berpengetahuan luas tentang kesehatan.`

    // Add category-specific context
    if (initialCategory) {
      const categoryContext = {
        posyandu: `\n\nAnda sedang membantu dalam kategori POSYANDU dengan fokus pada:
- Pelayanan Ibu Hamil: pemeriksaan kehamilan, nutrisi, persiapan persalinan, tanda bahaya kehamilan
- Pelayanan Kesehatan Ibu dan Anak: pemeriksaan rutin, tumbuh kembang, deteksi dini gangguan kesehatan
- Pelayanan Imunisasi: jadwal lengkap imunisasi, jenis vaksin, efek samping, kontraindikasi

Berikan informasi yang detail, praktis, dan mudah dipahami tentang layanan posyandu.`,
        
        posbindu: `\n\nAnda sedang membantu dalam kategori POSBINDU dengan fokus pada:
- Pencegahan PTM (Penyakit Tidak Menular): diabetes, hipertensi, kolesterol, stroke, jantung
- Pengukuran IMT (Indeks Masa Tubuh): cara menghitung, interpretasi hasil, kategori berat badan
- Pola Hidup Sehat: diet seimbang, olahraga teratur, manajemen stress, berhenti merokok

Berikan panduan praktis untuk pencegahan penyakit dan hidup sehat.`,
        
        bkb: `\n\nAnda sedang membantu dalam kategori BKB (Bina Keluarga Balita) dengan fokus pada:
- Kelas BKB: program pembelajaran parenting, kegiatan kelompok, materi pengasuhan
- Kartika School: pendidikan anak usia dini, kurikulum, metode pembelajaran
- Stimulasi Tumbuh Kembang: aktivitas sesuai usia, mainan edukatif, deteksi dini keterlambatan

Berikan panduan praktis untuk mengoptimalkan tumbuh kembang anak.`,
        
        lainnya: `\n\nAnda membantu dengan berbagai topik kesehatan umum termasuk:
- Konsultasi kesehatan keluarga
- Informasi obat dan suplemen
- Tips kesehatan sehari-hari
- Layanan dan jadwal Posyandu

Berikan informasi yang komprehensif dan mudah dipahami.`
      }
      
      basePrompt += categoryContext[initialCategory.id] || categoryContext.lainnya
    }

    basePrompt += `\n\nFokus utama Anda adalah:
1. Kesehatan Ibu dan Anak (KIA)
2. Imunisasi dan jadwal vaksinasi
3. Gizi dan nutrisi balita
4. Tumbuh kembang anak
5. Kesehatan ibu hamil dan menyusui
6. Keluarga berencana (KB)
7. Pemeriksaan kesehatan rutin
8. Pencegahan penyakit

INFORMASI PENTING POSYANDU MENUR 027:

**Jadwal Kegiatan Posyandu:**
- Setiap bulan pada minggu pertama
- Jam: 08.30 - 10.00 WITA

**Jadwal Kegiatan Kartika School:**
- Hari Senin
- Jam: 08.30 - 10.00 WITA

**Jadwal Kunjungan Rumah:**
- Setiap bulan pada minggu ketiga
- Jam: 16.00 - 17.00 WITA

**Kontak Penting:**
- KSA (Faskes Pertama): 0855102157033
- Persit: 081244148988
- Puskesmas Juwata Kerikil: +62 811-5926-888

SANGAT PENTING - FORMAT INFORMASI:
Ketika memberikan informasi jadwal atau kontak, WAJIB gunakan format seperti contoh di atas:
- Setiap item list HARUS di baris terpisah
- Gunakan heading (##) untuk setiap kategori
- Gunakan bullet point (-) untuk setiap item
- JANGAN PERNAH gabungkan multiple items dalam satu baris
- JANGAN gunakan bullet point horizontal (• item1 • item2)

Contoh FORMAT YANG BENAR untuk jadwal:

## Jadwal Kegiatan Posyandu Menur 027

**Jadwal Kegiatan Posyandu:**
- Setiap bulan pada minggu pertama
- Jam: 08.30 - 10.00 WITA

**Jadwal Kegiatan Kartika School:**
- Hari Senin
- Jam: 08.30 - 10.00 WITA

**Jadwal Kunjungan Rumah:**
- Setiap bulan pada minggu ketiga
- Jam: 16.00 - 17.00 WITA

Contoh FORMAT YANG BENAR untuk kontak:

## Kontak Penting

- **KSA (Faskes Pertama):** 0855102157033
- **Persit:** 081244148988
- **Puskesmas Juwata Kerikil:** +62 811-5926-888

SELALU ikuti format di atas!`

    if (hasImages) {
      basePrompt += `\n\nAnalisis gambar dengan detail dan berikan informasi medis yang relevan.

PENTING - FORMAT JAWABAN:
- Gunakan format Markdown untuk struktur yang jelas
- Gunakan **bold** untuk poin penting
- Gunakan bullet points (•) atau numbering untuk list
- Pisahkan paragraf dengan jelas
- Gunakan heading (##) untuk topik utama
- JANGAN sertakan link gambar eksternal atau URL gambar dalam response
- JANGAN gunakan markdown image syntax ![](url)

SANGAT PENTING - PENEMPATAN GAMBAR:
- Untuk menampilkan gambar yang diupload user, gunakan marker: [IMAGE:0] untuk gambar pertama, [IMAGE:1] untuk gambar kedua, dst.
- Tempatkan marker [IMAGE:X] di posisi yang TEPAT dalam analisis Anda
- Letakkan marker [IMAGE:X] SETELAH judul/subjudul produk dan SEBELUM analisis detail
- Jika ada multiple gambar, gunakan [IMAGE:0], [IMAGE:1], [IMAGE:2], dst sesuai urutan
- Pastikan setiap gambar dibahas dengan marker yang sesuai`
    } else {
      basePrompt += `\n\nPENTING - FORMAT JAWABAN:
- Gunakan format Markdown untuk struktur yang jelas
- Gunakan **bold** untuk poin penting
- Gunakan bullet points (•) atau numbering untuk list - SETIAP ITEM HARUS DI BARIS BARU
- Pisahkan paragraf dengan jelas
- Gunakan heading (##) untuk topik utama
- Buat jawaban yang mudah di-scan dan dibaca
- Hindari paragraf panjang, pecah menjadi poin-poin
- JANGAN gabungkan list items dalam satu baris`
    }

    basePrompt += `\n\nBerikan jawaban yang:
- Mudah dipahami dan ramah
- Berbasis informasi medis yang akurat
- Empati dan mendukung
- Terstruktur dengan baik menggunakan markdown
- Menyarankan konsultasi langsung dengan tenaga medis untuk kasus serius
- Menggunakan bahasa Indonesia yang baik

Selalu ingatkan bahwa informasi yang diberikan bersifat edukatif dan tidak menggantikan konsultasi medis langsung.`

    return basePrompt
  }

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

        const systemPrompt = getSystemPrompt(true)

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
          content: getSystemPrompt(false)
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

      // Directly show result without typing animation
      setIsLoading(false)
      
      // Add category questions if this is a category chat
      const categoryPrompt = initialCategory ? getCategoryPrompt(initialCategory) : null
      
      const aiMessage = {
        role: 'assistant',
        content: aiResponse,
        images: imageData.length > 0 ? imageData : undefined,
        categoryQuestions: categoryPrompt ? categoryPrompt.questions : undefined
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
      setIsLoading(false)
    } finally {
      inputRef.current?.focus()
    }
  }

  // Retry function - resend the previous user message
  const handleRetry = async (messageIndex) => {
    if (isLoading || !currentSession) return
    
    // Find the user message before this AI response
    let userMessageIndex = messageIndex - 1
    while (userMessageIndex >= 0 && messages[userMessageIndex].role !== 'user') {
      userMessageIndex--
    }
    
    if (userMessageIndex < 0) return
    
    const userMessage = messages[userMessageIndex]
    
    // Remove the failed AI response
    const messagesBeforeRetry = messages.slice(0, messageIndex)
    updateSessionMessages(currentSessionId, messagesBeforeRetry)
    
    setIsLoading(true)
    
    try {
      let aiResponse = ''
      const imageData = userMessage.images || []

      // If there are images, use Google Gemini
      if (imageData.length > 0) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const systemPrompt = getSystemPrompt(true)

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

        const prompt = `${systemPrompt}\n\nPertanyaan user: ${userMessage.content || 'Tolong analisis gambar ini'}`
        
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
          content: getSystemPrompt(false)
        })

        // Add conversation history up to retry point
        for (const msg of messagesBeforeRetry) {
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

      // Add category questions if this is a category chat
      const categoryPrompt = initialCategory ? getCategoryPrompt(initialCategory) : null

      const aiMessage = {
        role: 'assistant',
        content: aiResponse,
        images: imageData.length > 0 ? imageData : undefined,
        categoryQuestions: categoryPrompt ? categoryPrompt.questions : undefined
      }
      const finalMessages = [...messagesBeforeRetry, aiMessage]
      updateSessionMessages(currentSessionId, finalMessages)
    } catch (error) {
      console.error('Retry error:', error)
      
      let errorMessage = 'Maaf, terjadi kesalahan saat mencoba ulang. Silakan coba lagi. 🙏'
      
      if (error.message?.includes('API key')) {
        errorMessage = '⚠️ Gemini API key tidak valid atau belum diset.'
      } else if (error.message?.includes('quota')) {
        errorMessage = '⚠️ Quota API habis. Silakan tunggu beberapa saat.'
      } else if (error.response?.status === 402) {
        errorMessage = '⚠️ API key kehabisan kredit.'
      } else if (error.response?.status === 401) {
        errorMessage = '⚠️ API key tidak valid.'
      }
      
      const errorMsg = {
        role: 'assistant',
        content: errorMessage
      }
      const finalMessages = [...messagesBeforeRetry, errorMsg]
      updateSessionMessages(currentSessionId, finalMessages)
    } finally {
      setIsLoading(false)
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

  const handleQuestionClick = async (question) => {
    if (isLoading || !currentSession) return
    
    // Build user message
    const userMessage = { 
      role: 'user', 
      content: question,
    }
    
    const updatedMessages = [...messages, userMessage]
    updateSessionMessages(currentSessionId, updatedMessages)
    setIsLoading(true)

    try {
      let aiResponse = ''

      // Text-only: use Groq
      const apiMessages = []
      
      // Add system message
      apiMessages.push({
        role: 'system',
        content: getSystemPrompt(false)
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

      // Directly show result without typing animation
      setIsLoading(false)
      
      // Add category questions if this is a category chat
      const categoryPrompt = initialCategory ? getCategoryPrompt(initialCategory) : null
      
      const aiMessage = {
        role: 'assistant',
        content: aiResponse,
        categoryQuestions: categoryPrompt ? categoryPrompt.questions : undefined
      }
      const finalMessages = [...updatedMessages, aiMessage]
      updateSessionMessages(currentSessionId, finalMessages)
      
    } catch (error) {
      console.error('Error details:', error)
      
      let errorMessage = 'Maaf, terjadi kesalahan. Silakan coba lagi dalam beberapa saat. 🙏'
      
      if (error.response?.status === 402) {
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
      setIsLoading(false)
    } finally {
      inputRef.current?.focus()
    }
  }

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
          onBackToWelcome={onBackToWelcome}
        />

        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 scrollbar-hide"
        >
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 pb-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <MessageBubble 
                  key={index} 
                  message={message} 
                  index={index}
                  onRetry={handleRetry}
                  onQuestionClick={handleQuestionClick}
                />
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
                className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 pr-10 sm:pr-12 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none resize-none bg-white/90 backdrop-blur-sm transition-all text-sm sm:text-base"
                rows="1"
                style={{ maxHeight: '120px' }}
              />
              <motion.div
                className="absolute right-2 sm:right-3 md:right-4 bottom-3 sm:bottom-3.5 md:bottom-4 text-gray-400 text-sm sm:text-base pointer-events-none"
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
              className="bg-gradient-to-r from-primary to-secondary text-white p-3 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 self-end"
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
