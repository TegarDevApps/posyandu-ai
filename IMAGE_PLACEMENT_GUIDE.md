# Panduan Penempatan Gambar & Emoji Interaktif

## Cara Kerja

Sistem sekarang mendukung penempatan gambar **di dalam konten analisis AI**, bukan hanya di awal pesan.

### Mekanisme

1. **User Upload Gambar** → Gambar disimpan dalam array `message.images`
2. **AI Menganalisis** → AI menyisipkan marker `[IMAGE:0]`, `[IMAGE:1]`, dll di posisi yang tepat
3. **FormattedMessage Parse** → Komponen memecah konten berdasarkan marker
4. **Render** → Gambar ditampilkan di posisi marker, text di-render sebagai markdown

### Format Marker

```
[IMAGE:0]  → Gambar pertama
[IMAGE:1]  → Gambar kedua
[IMAGE:2]  → Gambar ketiga
dst...
```

## Emoji Interaktif & Reaktif 🎨

Sistem sekarang dilengkapi dengan emoji interaktif yang reaktif berdasarkan konten:

### Fitur Emoji

1. **Emoji Kontekstual pada Heading**
   - Imunisasi/Vaksin → 💉
   - Gizi/Nutrisi → 🥗
   - Tumbuh Kembang → 📈
   - Ibu Hamil → 🤰
   - Bayi/Anak → 👶
   - Obat/Vitamin → 💊

2. **Emoji pada List Items**
   - Fungsi/Manfaat → ✅
   - Efek Samping → ⚠️
   - Dosis → 💊
   - Cara/Langkah → 👉
   - Tips → 💡
   - Penting → ❗

3. **Animasi Interaktif**
   - Hover pada emoji → Scale & rotate animation
   - Avatar AI → Pulsing glow effect
   - Gambar → Zoom on hover dengan overlay
   - Smooth fade-in untuk semua elemen

4. **Avatar Reaktif**
   - AI avatar (🏥) dengan pulsing shadow
   - User avatar (👤) dengan hover effect
   - Wiggle animation saat hover

### Contoh Response AI yang Benar

```markdown
## Analisis Obat/Suplemen

Dari gambar yang Anda berikan, terdapat dua jenis produk:

### 1. Paracetamol 500 mg

[IMAGE:0]

**Analisis Gambar:** Gambar menunjukkan kotak dan strip blister obat...

**Informasi Medis:**

- Kategori: Analgesik dan antipiretik
- Fungsi: Meredakan nyeri dan menurunkan demam

### 2. Vitamin C 1000 mg

[IMAGE:1]

**Analisis Gambar:** Gambar kedua menunjukkan botol vitamin...

**Informasi Medis:**

- Kategori: Suplemen vitamin
- Fungsi: Meningkatkan daya tahan tubuh
```

### Hasil Tampilan

- Gambar muncul **tepat di posisi marker** dengan animasi fade-in
- Heading otomatis mendapat emoji kontekstual yang interaktif
- List items mendapat emoji sesuai konten
- Semua emoji bisa di-hover untuk animasi wiggle
- Avatar AI beranimasi dengan pulsing glow

## File yang Dimodifikasi

1. **EmojiReaction.jsx** (NEW) - Komponen emoji interaktif dengan animasi
2. **FormattedMessage.jsx** - Parse marker, render gambar, dan tambah emoji kontekstual
3. **MessageBubble.jsx** - Avatar reaktif dan gambar user dengan animasi
4. **ChatInterface.jsx** - Update system prompt untuk instruksi marker

## Testing

Upload 2+ gambar dan tanyakan untuk analisis. AI akan otomatis:

- Menempatkan gambar di posisi yang tepat
- Menambahkan emoji kontekstual pada heading
- Memberikan emoji pada list items
- Semua emoji interaktif saat di-hover! 🎉
