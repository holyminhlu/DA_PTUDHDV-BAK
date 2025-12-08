# 📖 Hướng dẫn sử dụng Swagger để Test API

## 🎯 Tổng quan

Swagger (OpenAPI) là công cụ giúp bạn:
- ✅ Visualize API endpoints một cách trực quan
- ✅ Test API trực tiếp trên trình duyệt
- ✅ Tự động generate documentation
- ✅ Validate request/response

## 📋 Các bước cài đặt

### Bước 1: Cài đặt các package cần thiết

Mở terminal và chạy lệnh sau trong thư mục `server/api-gateway`:

```bash
cd DA_PTUDHDV/server/api-gateway
npm install swagger-jsdoc swagger-ui-express --save
```

### Bước 2: Tạo file cấu hình Swagger

File cấu hình đã được tạo tự động: `server/api-gateway/src/swagger.js`

### Bước 3: Khởi động các services

**Terminal 1 - Auth Service:**
```bash
cd DA_PTUDHDV/server/auth-service
npm start
```

**Terminal 2 - Product Service:**
```bash
cd DA_PTUDHDV/server/product-service
npm start
```

**Terminal 3 - API Gateway:**
```bash
cd DA_PTUDHDV/server/api-gateway
npm start
```

### Bước 4: Truy cập Swagger UI

Mở trình duyệt và truy cập: **http://localhost:3000/api-docs**

## 🧪 Hướng dẫn Test API

### 1️⃣ Test API không cần Authentication

#### ✅ Test GET /api/products

1. Tìm endpoint **GET /api/products**
2. Click nút **"Try it out"**
3. Click **"Execute"**
4. Xem kết quả ở phần **Response body**

#### ✅ Test GET /api/products/{id}

1. Tìm endpoint **GET /api/products/{id}**
2. Click **"Try it out"**
3. Nhập ID sản phẩm (ví dụ: `507f1f77bcf86cd799439011`)
4. Click **"Execute"**

### 2️⃣ Test API có Authentication (cần JWT Token)

#### Bước A: Đăng ký tài khoản mới

1. Tìm endpoint **POST /api/auth/register**
2. Click **"Try it out"**
3. Điền thông tin vào Request body:

```json
{
  "name": "Nguyễn Văn A",
  "email": "test@example.com",
  "password": "password123"
}
```

4. Click **"Execute"**
5. Kiểm tra Response (status 201 = thành công)

#### Bước B: Đăng nhập để lấy token

1. Tìm endpoint **POST /api/auth/login**
2. Click **"Try it out"**
3. Điền thông tin:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

4. Click **"Execute"**
5. **QUAN TRỌNG**: Copy giá trị `token` từ Response body

Ví dụ Response:
```json
{
  "message": "Login success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "fullName": "Nguyễn Văn A",
    "email": "test@example.com"
  }
}
```

#### Bước C: Authorize với Token

1. Click nút **🔓 Authorize** ở góc phải trên cùng của Swagger UI
2. Trong popup, nhập: `Bearer <token_của_bạn>`
   - Ví dụ: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Click **"Authorize"**
4. Click **"Close"**

**Lưu ý**: Phải có từ khóa `Bearer` + khoảng trắng + token

#### Bước D: Test API có authentication

**✅ Test GET /api/auth/profile**

1. Tìm endpoint **GET /api/auth/profile** (sẽ có icon 🔒)
2. Click **"Try it out"**
3. Click **"Execute"**
4. Xem thông tin user trong Response

**✅ Test PUT /api/auth/profile**

1. Tìm endpoint **PUT /api/auth/profile** (sẽ có icon 🔒)
2. Click **"Try it out"**
3. Điền thông tin cập nhật:

```json
{
  "fullName": "Nguyễn Văn B - Updated"
}
```

4. Click **"Execute"**
5. Kiểm tra Response (status 200 = thành công)

## 🔄 Các trường hợp test khác

### Test với Token hết hạn

1. Để token hết hạn (sau 24 giờ)
2. Test lại các API có authentication
3. Bạn sẽ nhận được lỗi:

```json
{
  "status": 401,
  "error": "TOKEN_EXPIRED",
  "message": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
}
```

### Test với Token không hợp lệ

1. Authorize với token giả mạo: `Bearer invalid_token_123`
2. Test API có authentication
3. Bạn sẽ nhận lỗi:

```json
{
  "status": 401,
  "error": "INVALID_TOKEN",
  "message": "Token không hợp lệ hoặc đã bị thay đổi."
}
```

### Test Validation Errors

**Test đăng ký với dữ liệu sai:**

```json
{
  "name": "Test@123",
  "email": "invalid-email",
  "password": "123"
}
```

**Test cập nhật profile với tên quá ngắn:**

```json
{
  "fullName": "A"
}
```

## 📊 Hiểu Response Status Codes

| Code | Ý nghĩa | Ví dụ |
|------|---------|-------|
| 200 | OK - Thành công | GET, PUT thành công |
| 201 | Created - Tạo mới thành công | Đăng ký tài khoản |
| 400 | Bad Request - Dữ liệu không hợp lệ | Thiếu field bắt buộc |
| 401 | Unauthorized - Chưa xác thực | Token sai/hết hạn |
| 404 | Not Found - Không tìm thấy | User/Product không tồn tại |
| 409 | Conflict - Xung đột | Email đã tồn tại |
| 422 | Validation Error | Dữ liệu không đúng format |
| 500 | Server Error - Lỗi server | Lỗi database, etc |
| 502 | Bad Gateway - Gateway lỗi | Service downstream không khả dụng |

## 🎓 Tips & Best Practices

### 1. Luôn kiểm tra Response Status

- Status 2xx (200-299) = Thành công
- Status 4xx (400-499) = Lỗi từ phía client
- Status 5xx (500-599) = Lỗi từ phía server

### 2. Đọc kỹ Error Messages

Tất cả các API đều trả về error messages rõ ràng bằng tiếng Việt:

```json
{
  "error": "EMAIL_ALREADY_REGISTERED",
  "message": "Email đã được đăng ký"
}
```

### 3. Test theo flow thực tế

1. Đăng ký → Đăng nhập → Lấy profile → Cập nhật profile
2. Lấy danh sách products → Lấy chi tiết 1 product

### 4. Lưu Token để tái sử dụng

Token có hiệu lực 24 giờ, không cần đăng nhập lại mỗi lần test

### 5. Kiểm tra Request/Response Schema

Swagger hiển thị rõ ràng:
- Request body cần gì
- Response trả về gì
- Field nào bắt buộc, field nào optional

## 🐛 Troubleshooting

### Swagger UI không load được

**Giải pháp:**
- Kiểm tra API Gateway đã chạy: `http://localhost:3000/health`
- Clear browser cache và refresh

### Lỗi "Failed to fetch"

**Nguyên nhân:** Một trong các service chưa chạy

**Giải pháp:**
- Kiểm tra cả 3 services đang chạy
- Auth service: `http://localhost:3002/health`
- Product service: `http://localhost:3001/health`
- Gateway: `http://localhost:3000/health`

### Token không hoạt động

**Giải pháp:**
- Đảm bảo format: `Bearer <space><token>`
- Không có ký tự thừa (dấu ngoặc, dấu phẩy)
- Token chưa hết hạn

### MongoDB connection error

**Giải pháp:**
- Đảm bảo MongoDB đang chạy: `mongod`
- Kiểm tra MONGO_URI trong file `.env`

## 📚 Tài liệu tham khảo

- [Swagger Official Docs](https://swagger.io/docs/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [JWT.io](https://jwt.io/) - Debug JWT tokens

## 🎯 Tổng kết

Swagger giúp bạn:
- ✅ Test API nhanh chóng không cần Postman
- ✅ Tự động có documentation luôn update
- ✅ Chia sẻ API docs với team dễ dàng
- ✅ Validate data trước khi gửi request

**Happy Testing! 🚀**


