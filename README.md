# YouTube Full Cinema

Ekstensi Chrome sederhana untuk membuat mode bioskop YouTube memenuhi seluruh window browser. Saat halaman terdeteksi sebagai live stream, chat live otomatis disembunyikan.

## Cara pasang

1. Buka `chrome://extensions`.
2. Aktifkan **Developer mode**.
3. Klik **Load unpacked**.
4. Pilih folder repo ini.
5. Buka video atau live stream YouTube.

## Perilaku

- Berlaku di halaman video YouTube dan URL `/live/...`.
- Otomatis masuk ke theater mode sekali saat membuka video.
- Tombol theater/default bawaan YouTube tetap bisa dipakai untuk mengembalikan tampilan normal.
- Menyembunyikan header dan sidebar agar video memenuhi viewport browser pertama.
- Halaman tetap bisa discroll ke metadata, komentar, dan konten bawah video.
- Menyembunyikan chat hanya ketika halaman terdeteksi live.
