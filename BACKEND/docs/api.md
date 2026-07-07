# Nusa Warta API Contract

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
