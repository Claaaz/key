# My Key System

Sistem key sederhana untuk integrasi dengan PlatoBoost, dibangun dengan Next.js dan Supabase.

## Fitur
- **Generate Key**: Endpoint callback untuk PlatoBoost yang menghasilkan key 10 karakter (A-Z, 0-9)
- **Validasi Key**: Endpoint untuk memvalidasi apakah key masih aktif, expired, atau invalid
- **Expired 24 jam**: Setiap key memiliki masa berlaku 24 jam
- **Storage Supabase**: Data key disimpan di database Supabase

## Setup Local

1. Clone repository ini
2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Supabase:
   - Buat project baru di [Supabase](https://supabase.com)
   - Buat tabel `keys` dengan SQL berikut:
   ```sql
   create table keys (
     id uuid default gen_random_uuid() primary key,
     key text unique not null,
     created_at timestamp default now(),
     expires_at timestamp not null,
     used boolean default false
   );
   ```

4. Setup environment variables:
   - Copy `.env.local` dan isi dengan credentials Supabase Anda:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE=your_service_role_key
   ```

5. Jalankan development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### POST /api/callback
Endpoint untuk PlatoBoost callback, generate key baru.

**Query Parameters:**
- `token`: Token verifikasi (required)

**Response:**
```json
{
  "status": "SUCCESS",
  "key": "ABCDEFG123", 
  "expires": "2025-08-27T12:00:00Z"
}
```

**Contoh:**
```
GET /api/callback?token=some_token
```

### GET /api/validate
Endpoint untuk validasi key.

**Query Parameters:**
- `key`: Key yang akan divalidasi (required)

**Response:**
- Valid: `{ "status": "VALID", "expires": "2025-08-27T12:00:00Z" }`
- Expired: `{ "status": "EXPIRED" }`
- Invalid: `{ "status": "INVALID" }`

**Contoh:**
```
GET /api/validate?key=ABCDEFG123
```

## Deploy ke Vercel

1. Push code ke GitHub
2. Import project ke Vercel
3. Set environment variables di Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE`
4. Deploy!

## Struktur Database

```sql
create table keys (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  created_at timestamp default now(),
  expires_at timestamp not null,
  used boolean default false
);
```

## Testing

Test callback endpoint:
```bash
curl "https://your-domain.vercel.app/api/callback?token=test123"
```

Test validate endpoint:
```bash
curl "https://your-domain.vercel.app/api/validate?key=ABCDEFG123"
```
