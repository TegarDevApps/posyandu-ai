# 🚀 Panduan Deploy ke Netlify

## Langkah 1: Persiapan

File yang sudah disiapkan:

- ✅ `netlify.toml` - Konfigurasi build Netlify
- ✅ `.gitignore` - File yang tidak di-push ke GitHub
- ✅ Code sudah di push ke GitHub

## Langkah 2: Deploy ke Netlify

### A. Via Netlify Dashboard (Recommended)

1. **Buka Netlify:**
   - Kunjungi: https://app.netlify.com/
   - Login dengan GitHub account

2. **Import Project:**
   - Klik "Add new site" → "Import an existing project"
   - Pilih "Deploy with GitHub"
   - Authorize Netlify untuk akses GitHub
   - Pilih repository: `TegarDevApps/posyandu-ai`

3. **Configure Build Settings:**

   ```
   Build command: npm run build
   Publish directory: dist
   ```

   (Sudah otomatis dari netlify.toml)

4. **Klik "Deploy site"**
   - Netlify akan mulai build
   - Tunggu 2-3 menit

### B. Via Netlify CLI (Alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## Langkah 3: Setup Environment Variables

Setelah deploy, tambahkan environment variables di Netlify:

1. **Buka Site Settings:**
   - Dashboard → Site settings → Environment variables

2. **Tambahkan Variables:**

   **Groq API (untuk text chat):**

   ```
   VITE_OPENAI_API_KEY = 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
   VITE_OPENAI_API_URL = https://api.groq.com/openai/v1/chat/completions
   VITE_OPENAI_MODEL = llama-3.3-70b-versatile
   ```

   **Google Gemini API (untuk vision/gambar):**

   ```
   VITE_GEMINI_API_KEY = AIzaSyATAnnM9EZh8sjzqsKupXtXVICmvt24tqE
   ```

3. **Klik "Save"**

4. **Redeploy:**
   - Klik "Deploys" → "Trigger deploy" → "Deploy site"

## Langkah 4: Custom Domain (Optional)

1. **Buka Domain settings:**
   - Site settings → Domain management

2. **Add custom domain:**
   - Klik "Add custom domain"
   - Masukkan domain Anda (misal: posyandu-menur.com)
   - Follow instruksi DNS setup

3. **Enable HTTPS:**
   - Otomatis aktif setelah domain verified

## Langkah 5: Verifikasi

Setelah deploy selesai:

1. **Buka URL Netlify:**
   - Format: `https://[site-name].netlify.app`
   - Atau custom domain Anda

2. **Test Fitur:**
   - ✅ Welcome screen muncul
   - ✅ Chat text berfungsi (Groq API)
   - ✅ Upload gambar berfungsi (Gemini API)
   - ✅ Sidebar berfungsi
   - ✅ Chat history tersimpan

## Troubleshooting

### Build Failed

```bash
# Cek error di Netlify deploy log
# Biasanya karena:
- Missing dependencies → npm install
- Node version → Set NODE_VERSION=18 di netlify.toml
```

### API Not Working

```bash
# Cek environment variables:
1. Pastikan semua VITE_* variables sudah diset
2. Redeploy setelah set variables
3. Cek browser console untuk error
```

### 404 Error on Refresh

```bash
# Sudah handled di netlify.toml dengan redirects
# Jika masih error, cek netlify.toml sudah ter-commit
```

## Update Website

Setiap kali ada perubahan code:

```bash
# Commit changes
git add .
git commit -m "Update: deskripsi perubahan"
git push origin main

# Netlify akan auto-deploy!
```

## Monitoring

- **Analytics:** Netlify Dashboard → Analytics
- **Logs:** Netlify Dashboard → Deploys → [deploy] → Deploy log
- **Bandwidth:** Netlify Dashboard → Site overview

## Free Tier Limits

Netlify Free:

- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ HTTPS included
- ✅ Auto-deploy from Git

Groq Free:

- ✅ 30 requests/minute
- ✅ 14,400 requests/day

Gemini Free:

- ✅ 15 requests/minute
- ✅ 1,500 requests/day

## Support

Jika ada masalah:

1. Cek Netlify deploy log
2. Cek browser console (F12)
3. Cek API key masih valid
4. Cek environment variables sudah benar

---

**Selamat! Website Anda sudah live! 🎉**
