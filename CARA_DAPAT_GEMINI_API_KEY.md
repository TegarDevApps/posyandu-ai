# Cara Mendapatkan Google Gemini API Key (GRATIS)

## Langkah-langkah:

1. **Buka Google AI Studio:**
   https://aistudio.google.com/app/apikey

2. **Login dengan Google Account**

3. **Klik "Get API Key" atau "Create API Key"**
   - Pilih project atau buat project baru
   - Klik "Create API key in new project" atau pilih existing project

4. **Copy API Key yang muncul**
   - API key akan dimulai dengan `AIza...`
   - Simpan dengan aman

5. **Paste ke file .env:**
   - Buka file `.env` di project ini
   - Ganti `YOUR_GEMINI_API_KEY_HERE` dengan API key Anda
   - Contoh:

   ```
   VITE_GEMINI_API_KEY=AIzaSyAbc123xyz456...
   ```

6. **Restart aplikasi:**
   ```bash
   npm run dev
   ```

## Keuntungan Google Gemini:

✅ **100% GRATIS** - Tidak perlu kartu kredit
✅ **Support Vision** - Bisa analisis gambar
✅ **Model Powerful** - Gemini 1.5 Flash
✅ **Rate Limit Tinggi** - 15 request/menit (gratis tier)
✅ **Bahasa Indonesia Bagus** - Native support

## Kombinasi API:

Aplikasi ini menggunakan 2 API:

- **Groq (Llama 3.3)** → Chat text biasa (cepat)
- **Google Gemini** → Chat dengan gambar (vision)

Keduanya GRATIS! 🎉

## Troubleshooting:

- Jika error "API key not found", pastikan sudah copy paste dengan benar
- Jangan ada spasi di awal/akhir API key
- Restart aplikasi setelah update .env
- Pastikan API key dimulai dengan `AIza`
