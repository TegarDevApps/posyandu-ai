# Panduan Fitur Retry/Ulangi Prompt

## Fitur Baru: Tombol Retry pada Response AI

Sistem sekarang dilengkapi dengan tombol **"Ulangi Prompt"** pada setiap bubble AI (hijau) untuk handle kasus error atau response yang terputus.

## Cara Kerja

### 1. Deteksi Otomatis

Sistem otomatis mendeteksi kondisi berikut:

- **Error Message** - Response mengandung kata "error", "kesalahan", atau emoji ⚠️
- **Response Tidak Lengkap** - Response terlalu pendek (< 50 karakter)
- **Koneksi Terputus** - Request gagal atau timeout

### 2. Tampilan Tombol

Tombol "Ulangi Prompt" akan muncul:

- ✅ **Otomatis** jika terdeteksi error atau response tidak lengkap
- ✅ **Saat hover** pada bubble AI untuk response normal
- ✅ **Dengan animasi** smooth fade-in

### 3. Fungsi Retry

Ketika tombol diklik:

1. Sistem mencari user message sebelum response AI yang gagal
2. Menghapus response AI yang gagal dari history
3. Mengirim ulang request dengan context yang sama
4. Menampilkan response baru

## Fitur Detail

### Visual Indicator

```
┌─────────────────────────────────────┐
│ Response AI...                      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔄 Ulangi Prompt                │ │
│ │ ⚠️ Error terdeteksi             │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Kondisi Tampilan

**1. Error Terdeteksi**

- Tombol selalu visible
- Label: "⚠️ Error terdeteksi"
- Background: `bg-primary/10`

**2. Response Tidak Lengkap**

- Tombol selalu visible
- Label: "⚠️ Response mungkin tidak lengkap"
- Background: `bg-primary/10`

**3. Response Normal**

- Tombol muncul saat hover
- Tidak ada label warning
- Smooth animation

### Animasi

- **Fade-in** saat muncul
- **Scale 1.05** saat hover
- **Scale 0.95** saat click
- **Rotate icon** untuk visual feedback

## Implementasi Teknis

### File yang Dimodifikasi

1. **MessageBubble.jsx**
   - Tambah state `showRetry` untuk hover detection
   - Deteksi error/incomplete response
   - Render tombol retry dengan kondisi
   - Pass `onRetry` callback ke parent

2. **ChatInterface.jsx**
   - Fungsi `handleRetry(messageIndex)` untuk logic retry
   - Mencari user message sebelumnya
   - Remove failed AI response
   - Resend request dengan context yang sama
   - Support untuk text-only dan image requests

### Props MessageBubble

```jsx
<MessageBubble
  message={message}
  index={index}
  onRetry={handleRetry} // NEW: Callback untuk retry
/>
```

### Retry Logic Flow

```
User Message (index 0)
  ↓
AI Response Error (index 1) ← Click Retry
  ↓
1. Find user message at index 0
2. Remove messages from index 1 onwards
3. Resend request with same user message
4. Add new AI response
```

## Use Cases

### 1. Koneksi Internet Terputus

```
User: "Jelaskan tentang imunisasi"
AI: "⚠️ Maaf, terjadi kesalahan..."
     [🔄 Ulangi Prompt] ← Click untuk retry
```

### 2. API Quota Habis

```
User: "Analisis gambar ini" + 📸
AI: "⚠️ Quota API habis..."
     [🔄 Ulangi Prompt] ← Retry setelah quota reset
```

### 3. Response Terputus

```
User: "Berikan tips MPASI"
AI: "Berikut adalah..." (hanya 20 karakter)
     [🔄 Ulangi Prompt] ⚠️ Response mungkin tidak lengkap
```

### 4. Timeout

```
User: "Jadwal imunisasi lengkap"
AI: "Maaf, terjadi kesalahan: timeout"
     [🔄 Ulangi Prompt] ⚠️ Error terdeteksi
```

## Keuntungan

✅ **User Experience** - Tidak perlu ketik ulang pertanyaan
✅ **Context Preserved** - History chat tetap terjaga
✅ **Smart Detection** - Otomatis detect error
✅ **Visual Feedback** - Jelas kapan perlu retry
✅ **Support Images** - Retry juga untuk request dengan gambar

## Testing

1. **Test Error Handling**
   - Matikan koneksi internet
   - Kirim pesan
   - Klik tombol retry setelah koneksi kembali

2. **Test Hover State**
   - Hover pada bubble AI normal
   - Tombol retry muncul smooth

3. **Test dengan Gambar**
   - Upload gambar + pertanyaan
   - Simulasi error
   - Retry harus kirim ulang gambar yang sama

## Tips Penggunaan

💡 **Untuk User:**

- Hover pada bubble AI untuk akses tombol retry
- Gunakan retry jika response terputus atau error
- Tunggu beberapa saat sebelum retry jika quota habis

💡 **Untuk Developer:**

- Error message harus mengandung keyword yang terdeteksi
- Pastikan user message memiliki data gambar jika ada
- Test dengan berbagai kondisi error
