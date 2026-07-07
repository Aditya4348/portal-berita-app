# Nusa Warta API Contract

## Base URL dan autentikasi

Versi API saat ini menggunakan prefix:

```text
/api/v1
```

Seluruh endpoint pada dokumen ini memerlukan pengguna terautentikasi:

```http
Authorization: Bearer <access-token>
```

Jika token tidak tersedia atau tidak valid, API mengembalikan `401 UNAUTHENTICATED`.

## Media type

Semua endpoint API menerima dan menghasilkan JSON:API:

```http
Accept: application/vnd.api+json
Content-Type: application/vnd.api+json
```

## Response sukses

Satu resource dikembalikan di dalam `data`:

```json
{
  "data": {
    "type": "user_topics",
    "id": "12",
    "attributes": {
      "topic_prompt": "Perkembangan AI di Indonesia",
      "status": "active",
      "created_at": "2026-07-08T03:15:30.000Z",
      "updated_at": "2026-07-08T03:15:30.000Z"
    }
  }
}
```

Koleksi menggunakan array pada `data`. Pembuatan resource mengembalikan HTTP `201`, pembacaan dan pembaruan `200`, sedangkan operasi sukses tanpa body `204`.

## Pagination

Koleksi berhalaman mengembalikan `data`, `links`, dan `meta`:

```json
{
  "data": [],
  "links": {
    "first": "https://api.example.test/api/feed?page=1",
    "last": "https://api.example.test/api/feed?page=8",
    "prev": null,
    "next": "https://api.example.test/api/feed?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 8,
    "links": [],
    "path": "https://api.example.test/api/feed",
    "per_page": 20,
    "to": 20,
    "total": 153
  }
}
```

Parameter `page` dimulai dari 1. Nilai default `per_page` adalah 20.

## Status resource

### Status topik

| Status | Makna | Transisi berikutnya |
| --- | --- | --- |
| `pending` | Topik baru diterima dan menunggu penentuan sumber | `active`, `failed` |
| `active` | Topik memiliki sumber aktif dan dapat menghasilkan feed | `failed` |
| `failed` | Topik gagal diproses atau tidak memiliki sumber yang valid | `pending` saat dicoba ulang |

Topik baru selalu dibuat dengan status `pending`. Klien tidak diperbolehkan menentukan status ketika membuat topik.

### Status pemrosesan artikel

| Status | Makna | Transisi berikutnya |
| --- | --- | --- |
| `received` | Artikel telah diterima dan disimpan dari scraper | `processing`, `failed` |
| `processing` | Konten sedang dibersihkan atau diproses AI | `ready`, `failed` |
| `ready` | Artikel selesai diproses dan boleh muncul di feed | `processing` jika diproses ulang |
| `failed` | Pemrosesan gagal dan artikel tidak boleh muncul di feed | `processing` saat dicoba ulang |

Artikel baru selalu memiliki status `received`. Endpoint feed hanya menampilkan artikel berstatus `ready`.

## Endpoint

### Membuat topik

```http
POST /api/v1/topics
```

Request:

```json
{
  "data": {
    "type": "user_topics",
    "attributes": {
      "topic_prompt": "Perkembangan AI di Indonesia"
    }
  }
}
```

Aturan `topic_prompt`: wajib berupa string dengan panjang 3–2000 karakter.

Response `201 Created`:

```json
{
  "data": {
    "type": "user_topics",
    "id": "12",
    "attributes": {
      "topic_prompt": "Perkembangan AI di Indonesia",
      "status": "pending",
      "created_at": "2026-07-08T03:15:30.000Z",
      "updated_at": "2026-07-08T03:15:30.000Z"
    }
  }
}
```

Error: `401 UNAUTHENTICATED`, `422 VALIDATION_FAILED`, `429 TOO_MANY_REQUESTS`, `500 INTERNAL_SERVER_ERROR`.

### Mendapatkan feed personal

```http
GET /api/v1/feed?page=1
```

Request tidak memiliki body. `page` bersifat opsional, dimulai dari 1, dan setiap halaman berisi 20 artikel.

Response `200 OK` menggunakan struktur koleksi berhalaman pada bagian [Pagination](#pagination). Setiap item artikel berbentuk:

```json
{
  "type": "articles",
  "id": "84",
  "attributes": {
    "source_website_id": 7,
    "title": "Perkembangan AI terbaru",
    "original_url": "https://example.com/news/ai",
    "ai_summary": "Ringkasan artikel...",
    "audio_url": null,
    "image_url": "https://example.com/news/ai.jpg",
    "published_at": "2026-07-08T02:00:00.000Z",
    "processing_status": "ready",
    "created_at": "2026-07-08T02:05:00.000Z",
    "updated_at": "2026-07-08T02:10:00.000Z"
  }
}
```

Error: `401 UNAUTHENTICATED`, `422 VALIDATION_FAILED`, `429 TOO_MANY_REQUESTS`, `500 INTERNAL_SERVER_ERROR`.

### Mendapatkan detail artikel

```http
GET /api/v1/articles/{article}
```

`article` adalah ID numerik artikel. Request tidak memiliki body.

Response `200 OK` berisi satu resource `articles` dengan atribut yang sama seperti item feed.

Error: `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 RESOURCE_NOT_FOUND`, `429 TOO_MANY_REQUESTS`, `500 INTERNAL_SERVER_ERROR`.

### Mengirim pesan pada artikel

```http
POST /api/v1/articles/{article}/chat
```

Request:

```json
{
  "data": {
    "type": "article_chats",
    "attributes": {
      "message": "Apa kesimpulan utama artikel ini?"
    }
  }
}
```

Aturan `message`: wajib berupa string dengan panjang 1–4000 karakter.

Response `201 Created`:

```json
{
  "data": {
    "type": "article_chats",
    "id": "31",
    "attributes": {
      "article_id": 84,
      "sender_type": "user",
      "message": "Apa kesimpulan utama artikel ini?",
      "created_at": "2026-07-08T03:20:00.000Z"
    }
  }
}
```

Response ini hanya mengonfirmasi bahwa pesan pengguna telah disimpan. Pembuatan jawaban AI belum menjadi bagian endpoint saat ini.

Error: `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 RESOURCE_NOT_FOUND`, `422 VALIDATION_FAILED`, `429 TOO_MANY_REQUESTS`, `500 INTERNAL_SERVER_ERROR`.

## Validation error

Validation error menggunakan HTTP `422`. Setiap pesan menjadi satu error object dan `source.pointer` menunjuk field request yang salah.

```json
{
  "errors": [{
    "status": "422",
    "code": "VALIDATION_FAILED",
    "title": "Validation failed",
    "detail": "The topic prompt field is required.",
    "source": { "pointer": "/data/attributes/topic_prompt" }
  }]
}
```

## Application error

Semua kegagalan aplikasi menggunakan array `errors`. `status` selalu string HTTP status. `code` adalah identifier stabil untuk aplikasi klien; `detail` hanya pesan yang dapat berubah.

```json
{
  "errors": [{
    "status": "404",
    "code": "RESOURCE_NOT_FOUND",
    "title": "Resource not found",
    "detail": "The requested resource was not found."
  }]
}
```

| HTTP | Code |
| --- | --- |
| 400 | `BAD_REQUEST` |
| 401 | `UNAUTHENTICATED` |
| 403 | `FORBIDDEN` |
| 404 | `RESOURCE_NOT_FOUND` |
| 405 | `METHOD_NOT_ALLOWED` |
| 422 | `VALIDATION_FAILED` |
| 429 | `TOO_MANY_REQUESTS` |
| 500 | `INTERNAL_SERVER_ERROR` |

## Tanggal dan timezone

- Database dan aplikasi menyimpan serta memproses waktu dalam UTC.
- `APP_TIMEZONE` wajib bernilai `UTC` pada seluruh environment.
- API menggunakan ISO 8601/RFC 3339 dengan milidetik dan penanda UTC `Z`.
- Contoh: `2026-07-08T03:15:30.123Z`.
- Field tanggal yang belum memiliki nilai dikembalikan sebagai `null`.
- Konversi ke zona pengguna, termasuk `Asia/Jakarta`, dilakukan aplikasi klien.
