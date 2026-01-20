# Cara Mendapatkan Groq API Key (GRATIS)

## Langkah-langkah:

1. **Buka website Groq:**
   https://console.groq.com/

2. **Sign Up / Login:**
   - Klik "Sign Up" atau "Login"
   - Bisa pakai Google Account atau Email

3. **Buat API Key:**
   - Setelah login, klik menu "API Keys" di sidebar
   - Klik tombol "Create API Key"
   - Beri nama (misal: "Posyandu AI")
   - Copy API key yang muncul (dimulai dengan `gsk_...`)

4. **Paste ke file .env:**
   - Buka file `.env` di project ini
   - Ganti `gsk_YOUR_GROQ_API_KEY_HERE` dengan API key Anda
   - Contoh:

   ```
   VITE_OPENAI_API_KEY=gsk_abc123xyz456...
   ```

5. **Restart aplikasi:**
   ```bash
   npm run dev
   ```

## Keuntungan Groq:

✅ **100% GRATIS** - Tidak perlu kartu kredit
✅ **Sangat Cepat** - Response dalam hitungan detik
✅ **Model Powerful** - Llama 3.1 70B
✅ **Rate Limit Tinggi** - 30 request/menit (gratis tier)

## Troubleshooting:

- Jika error "API key not found", pastikan sudah copy paste dengan benar
- Jangan ada spasi di awal/akhir API key
- Restart aplikasi setelah update .env

## Alternatif Lain (Jika Groq Penuh):

### Google Gemini (Gratis):

- https://makersuite.google.com/app/apikey
- Model: gemini-pro
- Sangat bagus untuk bahasa Indonesia

### Hugging Face (Gratis):

- https://huggingface.co/settings/tokens
- Banyak model open source
