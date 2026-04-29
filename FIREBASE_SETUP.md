# Setup Firebase untuk Joki Tugas Kilat

## Langkah-langkah Setup Firebase:

### 1. Buat Firebase Project
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Create a project" atau "Tambah project"
3. Masukkan nama project: `joki-tugas-kilat`
4. Ikuti langkah-langkah setup sampai selesai

### 2. Setup Firestore Database
1. Di Firebase Console, pilih project yang baru dibuat
2. Klik "Firestore Database" di menu sebelah kiri
3. Klik "Create database"
4. Pilih "Start in test mode" (untuk development)
5. Pilih lokasi database (misalnya: `asia-southeast2` untuk Asia Tenggara)

### 3. Dapatkan Firebase Config
1. Klik ikon gear (settings) > "Project settings"
2. Scroll ke bawah ke bagian "Your apps"
3. Klik ikon web (</>) untuk menambah web app
4. Masukkan nama app: `joki-tugas-kilat-web`
5. **PENTING**: Jangan centang "Also set up Firebase Hosting"
6. Copy konfigurasi yang muncul

### 4. Update Environment Variables
Edit file `.env` di root project dan isi dengan data dari Firebase config:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyD... (dari apiKey)
VITE_FIREBASE_AUTH_DOMAIN=joki-tugas-kilat.firebaseapp.com (dari authDomain)
VITE_FIREBASE_PROJECT_ID=joki-tugas-kilat (dari projectId)
VITE_FIREBASE_STORAGE_BUCKET=joki-tugas-kilat.appspot.com (dari storageBucket)
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789 (dari messagingSenderId)
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456 (dari appId)
```

### 5. Setup Firestore Security Rules (Opsional untuk Production)
Di Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }

    // Allow read for anyone (for booking tracking)
    match /bookings/{bookingId} {
      allow read: if true;
      allow write: if false; // Only allow writes through backend
    }

    // Allow read/write for catalog
    match /catalog/{itemId} {
      allow read, write: if true;
    }

    // Allow read/write for counters
    match /counters/{counterId} {
      allow read, write: if true;
    }
  }
}
```

### 6. Test Setup
1. Jalankan `npm run dev` untuk development
2. Coba buat booking baru
3. Cek di Firebase Console > Firestore Database apakah data tersimpan

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Pastikan VITE_FIREBASE_API_KEY sudah benar di file .env

### Error: "Missing or insufficient permissions"
- Cek Firestore Security Rules
- Pastikan database sudah dibuat di test mode

### Data tidak muncul di Firebase Console
- Tunggu beberapa detik, kadang ada delay
- Refresh halaman Firebase Console

## Migrasi dari localStorage

Aplikasi sudah dimigrasi dari localStorage ke Firebase Firestore. Data lama di localStorage akan tetap ada tapi tidak akan digunakan lagi. Untuk migrasi data lama:

1. Buka browser developer tools (F12)
2. Console > `localStorage.getItem('jtk_bookings')`
3. Copy data JSON tersebut
4. Import manual ke Firestore atau buat script migrasi

## Deploy ke Production

Setelah setup selesai dan testing berhasil:

1. Update Firestore Security Rules untuk production
2. Build aplikasi: `npm run build`
3. Deploy ke GitHub Pages: `npm run deploy`

**Catatan**: Pastikan environment variables sudah diisi dengan benar sebelum deploy!</content>
<parameter name="filePath">/Users/jakathalin/Downloads/app 6/FIREBASE_SETUP.md