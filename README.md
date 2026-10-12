# EX5 - Docker Compose đa dịch vụ (backend + database)

Đóng gói bài EX4 thành Infrastructure as Code bằng Docker Compose CLI v2, quản lý biến môi trường bằng tệp `.env`.

> Do không có EX4, backend là ứng dụng Node.js (Express) tối giản dùng để minh họa việc kết nối tới PostgreSQL.

## Cấu trúc thư mục

| Tệp | Mô tả |
|---|---|
| `docker-compose.yml` | Khai báo 2 services `backend`, `database`; network `backend-net`; volume `pgdata` |
| `.env.example` | Mẫu biến môi trường (không chứa thông tin thật) |
| `.gitignore` | Loại `.env` khỏi Git |
| `Dockerfile`, `package.json`, `server.js`, `.dockerignore` | Mã nguồn và cấu hình build cho backend |

## Yêu cầu

- Docker Engine hoặc Docker Desktop, kèm Docker Compose v2

```bash
docker compose version
```

## Cách chạy

```bash
# 1. Tạo tệp .env từ mẫu, rồi sửa giá trị thật
cp .env.example .env

# 2. Kiểm tra cú pháp và biến môi trường
docker compose config

# 3. Build và khởi chạy (tự tạo network + volume)
docker compose up -d --build

# 4. Kiểm tra trạng thái
docker compose ps

# 5. Gọi thử API
curl http://localhost:8080/health

# 6. Xem log
docker compose logs -f

# 7. Dừng và xóa container + network
docker compose down

# (Tùy chọn) xóa luôn dữ liệu database
docker compose down -v
```

Trên Windows PowerShell, dùng `curl.exe` thay cho `curl`.

## Biến môi trường

| Biến | Ý nghĩa |
|---|---|
| `DB_NAME` | Tên database |
| `DB_USER` | Tên người dùng database |
| `DB_PASSWORD` | Mật khẩu database |
| `PORT` | Cổng trên máy host ánh xạ tới cổng 8080 của backend |

## Kết quả mong đợi

- `docker compose up -d` tự tạo network `backend-net`, volume `pgdata` và đưa 2 dịch vụ lên trạng thái Running.
- `docker compose ps`: `ex5-database` ở trạng thái `healthy`, `ex5-backend` ở trạng thái `running`.
- `curl http://localhost:8080/health` trả về:

```json
{"status":"ok","db_time":"..."}
```

## Bảo mật

- Thông tin nhạy cảm (tên DB, user, password, port) nằm trong `.env`, đã được loại khỏi Git bằng `.gitignore`.
- Chỉ commit `.env.example` với giá trị giả.
- Dữ liệu database lưu trong named volume `pgdata`, vẫn còn sau `docker compose down` (chỉ mất khi dùng `down -v`).
- `depends_on` kết hợp `healthcheck` đảm bảo backend chỉ khởi động khi database đã sẵn sàng.