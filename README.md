<p align="center">
  <img src="/public/Batiku Logo Full.png" alt="Batiku Logo" width="500"/>
</p>

# Batiku

**Batiku** adalah platform web untuk menghasilkan **raport motif batik** (_seamless tile_) dari **teks** atau **gambar referensi milik pengguna**, dilengkapi editor ringan (repeat, simetri, palet, dan kepadatan _isèn_), serta **ekspor PNG 300 DPI & SVG** siap produksi. Batiku dibangun di atas **Amazon Bedrock** (GenAI) dengan arsitektur **serverless** di AWS.

- **Untuk siapa**: perajin/desainer batik & UMKM yang butuh eksplorasi motif cepat, konsisten, dan sesuai “rasa” batik (tulis/cap).
- **Kenapa penting**: mempercepat iterasi desain, menjaga karakter batik melalui **validator gaya** berbasis dataset **Kaggle CC0**, dan menyiapkan berkas produksi yang rapi (seamless + vektor).

---

## Fitur Utama (MVP)

- **Text → Raport** & **Image → Variasi** (Amazon Bedrock)
- **Kontrol pola**: repeat (square/half-drop), simetri (2/4/8)
- **Isèn composer** (UI): _cecek_, _sawut_, _ukel_, _sisik_ — dengan **kepadatan** & **ketebalan garis**
- **Palet preset**: sogan klasik, indigo-putih, pesisir cerah
- **Validator gaya** (wajib di MVP): klasifikasi keluarga motif (Kawung/Parang/Ceplok/Semen) pakai model ringan dilatih dari dataset Kaggle lisensi **CC0/Public Domain**
- **Ekspor**: PNG 300 DPI (20/25 cm) & **SVG** bersih (potrace + svgo)
- **Guardrails budaya & legal**: pernyataan hak atas referensi, daftar pantangan/simbol sakral

> Catatan: Pada tahap MVP, **fine-tuning** model generatif belum diaktifkan; generator mengandalkan **prompting + conditioning**. Fine-tuning direncanakan setelah kurasi dataset legal internal.

---

## Cara Kerja Singkat

1. Pengguna menulis deskripsi (mis. “Kawung sogan, half-drop, simetri 4”) atau mengunggah sketsa milik sendiri.
2. **Amazon Bedrock** menghasilkan 3 kandidat **ubin seamless**.
3. **Validator gaya** menyaring kandidat yang melenceng dari keluarga motif target.
4. Pengguna menyunting **repeat, simetri, palet, kepadatan/ketebalan isèn**.
5. **Ekspor**: PNG 300 DPI & SVG siap produksi.

---

## Arsitektur

- **Frontend**: Next.js (App Router) — halaman:
  - `/` **Homepage** (apa itu Batiku, fitur, roadmap, CTA)
  - `/studio` **Studio** (generator & editor ringan)
- **Backend**: API Gateway + AWS Lambda (Node.js & Lambda Container)
  - `POST /generate-batik` → panggil Amazon Bedrock (image)
  - `POST /validate-style` → jalankan validator gaya (model TFJS dari S3)
  - `POST /postprocess/vectorize` → perapihan _seam_ + vektorisasi (potrace + svgo)
- **Data & Storage**:
  - S3 (assets input & outputs), DynamoDB (metadata desain), CloudFront (opsional untuk CDN)
- **AI**:
  - Amazon Bedrock — Image Gen (text→image, image→image), Text (prompt hygiene), Guardrails
- **Observability & Security**:
  - CloudWatch/X-Ray, KMS (enkripsi S3/DynamoDB), AWS WAF, throttling API

---

## Endpoints (MVP)

- **POST `/generate-batik`**  
  Request:

  ```json
  {
    "mode": "text",
    "prompt": "Batik Kawung sogan klasik, half-drop, simetri 4",
    "family": "kawung",
    "style": "cap",
    "palette": "sogan",
    "repeat": "half-drop",
    "symmetry": 4,
    "rapport_cm": 25
  }
  ```

  Response:

  ```json
  {
    "jobId": "uuid",
    "candidates": [
      { "s3KeyPng": "jobs/<id>/candidate_1.png", "idx": 1 },
      { "s3KeyPng": "jobs/<id>/candidate_2.png", "idx": 2 },
      { "s3KeyPng": "jobs/<id>/candidate_3.png", "idx": 3 }
    ]
  }
  ```

- **POST `/validate-style`**  
  Request:

  ```json
  { "imageS3": "jobs/<id>/candidate_1.png" }
  ```

  Response:

  ```json
  { "family": "kawung", "score": 0.82, "passed": true }
  ```

- **POST `/postprocess/vectorize`**  
  Request:
  ```json
  {
    "imageS3Key": "jobs/<id>/candidate_1.png",
    "settings": { "strokeWidth": 0.35, "density": "medium" }
  }
  ```
  Response:
  ```json
  {
    "pngS3": "jobs/<id>/candidate_1.seamless.png",
    "svgS3": "jobs/<id>/candidate_1.svg"
  }
  ```

---

## Persyaratan

- Node.js 18+
- AWS CLI v2 + AWS CDK v2
- Akun AWS dengan akses **Amazon Bedrock** pada region yang dipakai
- Docker (untuk build Lambda container `postprocess-vectorize`)

---

## Konfigurasi Lingkungan

Salin `env.sample` menjadi `.env` (root) dan `frontend/.env.local`, lalu isi:

```bash
API_BASE_URL=https://REPLACE.execute-api.REGION.amazonaws.com/prod
AWS_REGION=ap-southeast-1
BEDROCK_MODEL_ID=image.titan-v1                     # sesuaikan model image di region
BEDROCK_TEXT_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
# Optional untuk preview file S3 melalui CDN publik:
# NEXT_PUBLIC_S3_PUBLIC_URL=https://dXXXX.cloudfront.net
# NEXT_PUBLIC_API_BASE_URL sama dengan API_BASE_URL jika perlu di-ekspos ke frontend
```

> Nama model **Bedrock** berbeda antar region. Gunakan ID model image yang tersedia (Titan Image / SDXL via Bedrock) di region Anda.

---

## Instalasi & Deploy

1. **Install dependensi**  
   Jalankan `npm install` di root, lalu di `infra/`, masing-masing folder `services/*/`, dan `frontend/`.

2. **Bootstrap & Deploy Infrastruktur (CDK)**

   ```bash
   cd infra
   npm run build
   npx cdk bootstrap
   npx cdk deploy BatikStack
   ```

   Simpan keluaran: **ApiUrl**, **AssetsBucketName**, **OutputsBucketName**, **ModelBucketName**, **TableName**.

3. **Jalankan Frontend (dev)**
   ```bash
   cd ../frontend
   npm run dev
   ```
   Buka `http://localhost:3000` → **Homepage Batiku** (`/`), **Studio** (`/studio`).

---

## Validator Gaya (Dataset Kaggle → S3)

- Dataset: **Batik Nusantara – Batik Indonesia** (lisensi **CC0/Public Domain**) di Kaggle.
- Latih model klasifikasi (mis. MobileNet/ViT tiny) pada kelas keluarga motif (Kawung/Parang/Ceplok/Semen, dst.).
- Konversi ke **TFJS GraphModel** (`model.json` + shard bin) dan unggah ke:
  ```
  s3://<ModelBucket>/validator/v1/{model.json, group1-shard1of1.bin, labelmap.json}
  ```
- File `services/validate-style/model-config.json` sudah diset ke prefix `validator/v1/`.

> Peran di MVP: **menyaring** hasil generatif agar tetap “rasa batik”. Bukan melatih ulang model dasar Bedrock.

---

## Etika & Guardrails Budaya

- Pengguna menyatakan **hak atas gambar referensi**.
- Daftar **pantangan/simbol sakral** disaring via **Bedrock Guardrails** & normalisasi prompt.
- Metadata output mencantumkan **asal inspirasi** (opsional) tanpa mengklaim kepemilikan budaya.

---

## Roadmap

- **v1.1**: _Palette extractor_ dari foto, _stitch checker_ (heatmap), template pecah raport → blok cap
- **v1.2**: Katalog motif & pencarian mirip (embeddings), C2PA dasar
- **v2.0**: RAG pengetahuan budaya, **fine-tuning** gaya batik (dataset legal + kurasi internal)

---

## Troubleshooting

- **Tidak ada output dari Bedrock**: pastikan `BEDROCK_MODEL_ID` valid di region; cek CloudWatch Logs fungsi `GenerateBatikFn`.
- **Validator gagal memuat model**: pastikan file `model.json` dan shard bin ada di **ModelBucket** path `validator/v1/` serta IAM Lambda punya izin `s3:GetObject`.
- **Lambda container error (potrace/svgo)**: cek log `PostprocessFn`, pastikan Docker build sukses saat `cdk deploy`.
- **Preview gambar kosong**: gunakan **presigned URL** atau publikasi via **CloudFront**; set `NEXT_PUBLIC_S3_PUBLIC_URL` jika perlu.

---

## Lisensi Data & Legal

- Dataset Kaggle yang dipakai untuk validator menggunakan lisensi **CC0/Public Domain**. Simpan README lisensi & catatan kurasi di S3 untuk audit.
- Input/output Batiku **tidak** digunakan untuk melatih model dasar Bedrock.

---

## Kontribusi

Pull request untuk peningkatan editor (isèn composer, preset palet) dan peningkatan kualitas vektorisasi sangat disambut. Sertakan deskripsi perubahan dan langkah uji.

---

**© Batiku** — didukung Amazon Bedrock.
