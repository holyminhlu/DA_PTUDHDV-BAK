# 🚀 Swagger Quick Start Guide

## ⚡ Cài đặt nhanh (5 phút)

### Bước 1: Cài đặt dependencies

**Cách 1: Chạy script tự động (Windows)**
```bash
# Trong thư mục DA_PTUDHDV, double-click hoặc chạy:
install-swagger.bat
```

**Cách 2: Cài đặt thủ công**
```bash
# Cài đặt cho API Gateway
cd DA_PTUDHDV/server/api-gateway
npm install

# Cài đặt cho Auth Service
cd ../auth-service
npm install

# Cài đặt cho Product Service
cd ../product-service
npm install
```

### Bước 2: Khởi động MongoDB

Mở terminal và chạy:
```bash
mongod
```

Hoặc nếu đã cài MongoDB dưới dạng service thì nó sẽ tự chạy.

### Bước 3: Khởi động các services

**Mở 3 terminal riêng biệt:**

**Terminal 1 - Auth Service (port 3002):**
```bash
cd DA_PTUDHDV/server/auth-service
npm start
```

**Terminal 2 - Product Service (port 3001):**
```bash
cd DA_PTUDHDV/server/product-service
npm start
```

**Terminal 3 - API Gateway (port 3000):**
```bash
cd DA_PTUDHDV/server/api-gateway
npm start
```

### Bước 4: Truy cập Swagger UI

Mở trình duyệt và truy cập:

**🔗 http://localhost:3000/api-docs**

## 📱 Test Flow cơ bản

### 1. Test Product API (không cần token)

```
GET /api/products → Lấy danh sách sản phẩm
```

### 2. Test Authentication Flow

**Bước 1: Đăng ký**
```
POST /api/auth/register
Body:
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Bước 2: Đăng nhập**
```
POST /api/auth/login
Body:
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Copy token từ response!**

**Bước 3: Authorize**
- Click nút **🔓 Authorize** (góc phải trên)
- Nhập: `Bearer <your_token>`
- Click Authorize

**Bước 4: Test protected endpoints**
```
GET /api/auth/profile → Lấy thông tin user
PUT /api/auth/profile → Cập nhật tên user
```

## 🎯 Các endpoint có sẵn

| Method | Endpoint | Auth Required | Mô tả |
|--------|----------|---------------|-------|
| GET | `/health` | ❌ | Health check |
| GET | `/api/products` | ❌ | Danh sách sản phẩm |
| GET | `/api/products/{id}` | ❌ | Chi tiết sản phẩm |
| POST | `/api/auth/register` | ❌ | Đăng ký |
| POST | `/api/auth/login` | ❌ | Đăng nhập |
| GET | `/api/auth/profile` | ✅ | Xem profile |
| PUT | `/api/auth/profile` | ✅ | Cập nhật profile |

## 🐛 Troubleshooting

### Lỗi: "Failed to fetch"

**Nguyên nhân:** Service chưa chạy

**Giải pháp:**
```bash
# Kiểm tra từng service:
curl http://localhost:3002/health  # Auth Service
curl http://localhost:3001/health  # Product Service
curl http://localhost:3000/health  # API Gateway
```

### Lỗi: MongoDB connection

**Giải pháp:**
```bash
# Kiểm tra MongoDB có chạy không
mongosh

# Hoặc
mongo
```

### Swagger UI không hiển thị

**Giải pháp:**
- Clear browser cache
- Hard refresh: `Ctrl + Shift + R`
- Kiểm tra API Gateway đang chạy

### Token không hoạt động

**Kiểm tra:**
- ✅ Có từ khóa `Bearer` + space trước token
- ✅ Không có ký tự thừa (dấu ngoặc, dấu phẩy)
- ✅ Token chưa hết hạn (24 giờ)

## 📚 Đọc thêm

- **Chi tiết hướng dẫn:** [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)
- **Swagger Docs:** http://localhost:3000/api-docs

## 💡 Tips

1. **Lưu token:** Token có hiệu lực 24h, không cần đăng nhập lại mỗi lần
2. **Test validation:** Thử nhập dữ liệu sai để xem error messages
3. **Xem schema:** Click vào "Schema" để xem cấu trúc request/response
4. **Copy curl:** Swagger cho phép copy curl command để test trên terminal

---

**Happy Testing! 🎉**


