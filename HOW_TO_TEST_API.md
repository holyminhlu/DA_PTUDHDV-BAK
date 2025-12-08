# 🧪 Hướng dẫn Test API với Swagger - TechStore

## ⚡ Quick Start (3 bước)

### 1️⃣ Cài đặt (1 lần duy nhất)

**Windows - Double click file:**
```
install-swagger.bat
```

**Hoặc chạy manual:**
```bash
cd DA_PTUDHDV\server\api-gateway
npm install
```

### 2️⃣ Khởi động (mỗi lần test)

Mở **3 terminals** và chạy:

```bash
# Terminal 1
cd DA_PTUDHDV\server\auth-service
npm start

# Terminal 2  
cd DA_PTUDHDV\server\product-service
npm start

# Terminal 3
cd DA_PTUDHDV\server\api-gateway
npm start
```

**✅ Đợi đến khi thấy:**
- `auth-service listening on port 3002`
- `product-service listening on port 3001`
- `api-gateway listening on port 3000`

### 3️⃣ Truy cập Swagger UI

Mở trình duyệt:
```
http://localhost:3000/api-docs
```

---

## 🎯 Test API ngay

### Test 1: Lấy danh sách sản phẩm (dễ nhất)

1. Tìm **GET /api/products**
2. Click **Try it out**
3. Click **Execute**
4. ✅ Xem danh sách sản phẩm ở Response

---

### Test 2: Đăng ký + Đăng nhập (có authentication)

#### Bước A: Đăng ký tài khoản

1. Tìm **POST /api/auth/register**
2. Click **Try it out**
3. Copy và paste vào Request body:

```json
{
  "name": "Nguyen Van A",
  "email": "test@example.com",
  "password": "password123"
}
```

4. Click **Execute**
5. ✅ Thấy status **201** = thành công

#### Bước B: Đăng nhập

1. Tìm **POST /api/auth/login**
2. Click **Try it out**
3. Paste vào:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

4. Click **Execute**
5. **📋 QUAN TRỌNG: Copy token từ response!**

Response sẽ như thế này:
```json
{
  "message": "Login success",
  "token": "eyJhbGc...(token dài)",  ← COPY CÁI NÀY
  "user": { ... }
}
```

#### Bước C: Authorize với Token

1. Click nút **🔓 Authorize** (góc phải trên cùng)
2. Nhập vào ô: `Bearer ` rồi paste token
   
   Ví dụ:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   
   **CHÚ Ý:** Phải có chữ `Bearer` + 1 khoảng trắng + token

3. Click **Authorize**
4. Click **Close**
5. ✅ Bây giờ các endpoint có icon 🔒 sẽ hoạt động!

#### Bước D: Test API có authentication

**D1. Xem thông tin profile:**
- Tìm **GET /api/auth/profile** (có icon 🔒)
- Click **Try it out**
- Click **Execute**
- ✅ Xem thông tin user

**D2. Cập nhật tên:**
- Tìm **PUT /api/auth/profile** (có icon 🔒)
- Click **Try it out**
- Paste:

```json
{
  "fullName": "Nguyen Van B Updated"
}
```

- Click **Execute**
- ✅ Thấy message "Cập nhật thành công"

---

## 📊 Hiểu Response Codes

| Code | Ý nghĩa | Khi nào gặp |
|------|---------|-------------|
| 200 | ✅ OK | Request thành công |
| 201 | ✅ Created | Tạo mới thành công (đăng ký) |
| 400 | ❌ Bad Request | Thiếu dữ liệu, sai format |
| 401 | ❌ Unauthorized | Token sai/hết hạn |
| 404 | ❌ Not Found | Không tìm thấy |
| 409 | ❌ Conflict | Email đã tồn tại |
| 422 | ❌ Validation Error | Dữ liệu không hợp lệ |
| 500 | ❌ Server Error | Lỗi server |

---

## 🐛 Gặp lỗi?

### ❌ "Failed to fetch"

**Nguyên nhân:** Service chưa chạy

**Fix:** Kiểm tra 3 terminals có đang chạy không:
```bash
curl http://localhost:3000/health
curl http://localhost:3002/health
curl http://localhost:3001/health
```

Cả 3 phải trả về `{"status":"ok"}` hoặc tương tự.

---

### ❌ "Unauthorized" khi test profile

**Nguyên nhân:** Chưa authorize hoặc token sai

**Fix:**
1. Đảm bảo đã click 🔓 Authorize
2. Format đúng: `Bearer <space><token>`
3. Token chưa hết hạn (token có hiệu lực 24 giờ)

---

### ❌ MongoDB connection error

**Fix:** Đảm bảo MongoDB đang chạy:
```bash
mongod
```

Hoặc start MongoDB service trên Windows:
```bash
net start MongoDB
```

---

### ❌ Swagger UI không load

**Fix:**
1. Hard refresh: `Ctrl + Shift + R`
2. Clear cache
3. Kiểm tra API Gateway chạy chưa: http://localhost:3000/health

---

## 💡 Tips hữu ích

### ✅ Lưu token

Token có hiệu lực **24 giờ**, không cần đăng nhập lại mỗi lần test!

### ✅ Test validation errors

Thử nhập dữ liệu sai để xem error messages:

**Password quá ngắn:**
```json
{
  "name": "Test",
  "email": "test@test.com",
  "password": "123"
}
```

**Tên có ký tự đặc biệt:**
```json
{
  "name": "Test@123",
  "email": "test@test.com",
  "password": "password123"
}
```

### ✅ Xem Schema

Click vào **Schema** bên dưới mỗi endpoint để xem:
- Field nào bắt buộc
- Kiểu dữ liệu
- Ví dụ

### ✅ Copy cURL

Swagger cho phép copy cURL command → test trên terminal nếu muốn!

---

## 📚 Tài liệu chi tiết

- **Quick Start:** [SWAGGER_QUICKSTART.md](./SWAGGER_QUICKSTART.md)
- **Hướng dẫn đầy đủ:** [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)
- **Backend Architecture:** [server/README.md](./server/README.md)

---

## 🎓 Tóm tắt Flow

```
1. Start 3 services ✓
2. Mở http://localhost:3000/api-docs ✓
3. Test GET /api/products (không cần token) ✓
4. POST /api/auth/register ✓
5. POST /api/auth/login → Copy token ✓
6. Click 🔓 Authorize → Nhập "Bearer <token>" ✓
7. Test GET/PUT /api/auth/profile ✓
```

---

## ✨ Xong!

Bây giờ bạn đã có thể test API như một pro! 🚀

**Câu hỏi?** Đọc [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) để biết thêm chi tiết.

**Happy Testing! 🎉**


