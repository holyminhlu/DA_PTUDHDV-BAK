# 🧪 Hướng dẫn Test Cart APIs trên Swagger

## 📋 Chuẩn bị

### Bước 1: Đảm bảo các services đang chạy

Mở 3 terminals và chạy:

**Terminal 1 - Auth Service:**
```bash
cd DA_PTUDHDV/server/auth-service
npm install
npm start
```
✅ Thấy: `auth-service listening on port 3002`

**Terminal 2 - Product Service:**
```bash
cd DA_PTUDHDV/server/product-service
npm start
```
✅ Thấy: `product-service listening on port 3001`

**Terminal 3 - API Gateway:**
```bash
cd DA_PTUDHDV/server/api-gateway
npm start
```
✅ Thấy: `api-gateway listening on port 3000`

### Bước 2: Mở Swagger UI

Truy cập: **http://localhost:3000/api-docs**

---

## 🎯 Test Flow Hoàn Chỉnh

### 📍 Phase 1: Chuẩn bị dữ liệu

#### **Bước 1.1: Đăng ký tài khoản**

1. Tìm endpoint **POST /api/auth/register** (section Authentication)
2. Click **"Try it out"**
3. Paste vào Request body:

```json
{
  "name": "Nguyen Van Test",
  "email": "testcart@example.com",
  "password": "password123"
}
```

4. Click **"Execute"**
5. ✅ Kiểm tra Response: Status **201** = thành công

---

#### **Bước 1.2: Đăng nhập để lấy user_id**

1. Tìm endpoint **POST /api/auth/login**
2. Click **"Try it out"**
3. Paste:

```json
{
  "email": "testcart@example.com",
  "password": "password123"
}
```

4. Click **"Execute"**
5. **📋 QUAN TRỌNG**: Copy `id` từ response

Response sẽ như thế này:
```json
{
  "message": "Login success",
  "token": "eyJhbGc...",
  "user": {
    "id": "675473c9a1b2c3d4e5f6g7h8",  ← COPY CÁI NÀY
    "fullName": "Nguyen Van Test",
    "email": "testcart@example.com"
  }
}
```

**💾 Lưu lại:**
- `user_id`: `675473c9a1b2c3d4e5f6g7h8`

---

#### **Bước 1.3: Lấy danh sách sản phẩm để có product_id**

1. Tìm endpoint **GET /api/products** (section Products)
2. Click **"Try it out"**
3. Click **"Execute"**
4. **📋 Copy một vài `_id` của sản phẩm**

Response sẽ như:
```json
[
  {
    "_id": "6936297a701665210edbd101",  ← COPY CÁI NÀY
    "id": 1,
    "title": "iPhone 15 Pro Max 256GB",
    "price": 29990000,
    ...
  },
  {
    "_id": "6936297a701665210edbd102",  ← HOẶC CÁI NÀY
    "id": 2,
    "title": "Samsung Galaxy S24 Ultra 512GB",
    "price": 27990000,
    ...
  }
]
```

**💾 Lưu lại:**
- `product_id_1`: `6936297a701665210edbd101` (iPhone)
- `product_id_2`: `6936297a701665210edbd102` (Samsung)

---

### 📍 Phase 2: Test Cart APIs

Bây giờ bạn có:
- ✅ `user_id`: `675473c9a1b2c3d4e5f6g7h8`
- ✅ `product_id_1`: `6936297a701665210edbd101`
- ✅ `product_id_2`: `6936297a701665210edbd102`

---

## 🛒 Test 1: Thêm sản phẩm vào giỏ hàng

### **POST /api/cart/add**

1. Scroll xuống section **Cart** trong Swagger UI
2. Tìm endpoint **POST /api/cart/add**
3. Click **"Try it out"**
4. Paste vào Request body (thay `user_id` và `product_id` bằng giá trị của bạn):

```json
{
  "user_id": "675473c9a1b2c3d4e5f6g7h8",
  "product_id": "6936297a701665210edbd101",
  "quantity": 2
}
```

5. Click **"Execute"**

### ✅ Response Success (200):

```json
{
  "status": "success",
  "message": "Đã thêm vào giỏ hàng",
  "cart_item": {
    "product_id": "6936297a701665210edbd101",
    "productId": 1,
    "product_name": "iPhone 15 Pro Max 256GB",
    "quantity": 2
  }
}
```

### 🎉 Thành công! Sản phẩm đã được thêm vào giỏ.

---

### Test case 2: Thêm sản phẩm thứ 2

Thử thêm một sản phẩm khác:

```json
{
  "user_id": "675473c9a1b2c3d4e5f6g7h8",
  "product_id": "6936297a701665210edbd102",
  "quantity": 1
}
```

Click **"Execute"** → Sẽ thấy message "Đã thêm vào giỏ hàng"

---

### Test case 3: Thêm lại sản phẩm đã có (test cộng dồn)

Thử thêm lại iPhone (product đầu tiên):

```json
{
  "user_id": "675473c9a1b2c3d4e5f6g7h8",
  "product_id": "6936297a701665210edbd101",
  "quantity": 1
}
```

Response sẽ show quantity = 3 (2 + 1) → ✅ Logic cộng dồn hoạt động!

---

## 👁️ Test 2: Xem giỏ hàng

### **GET /api/cart/{user_id}**

1. Tìm endpoint **GET /api/cart/{user_id}**
2. Click **"Try it out"**
3. Nhập `user_id` vào ô **user_id parameter**:

```
675473c9a1b2c3d4e5f6g7h8
```

4. Click **"Execute"**

### ✅ Response Success (200):

```json
{
  "status": "success",
  "user_id": "675473c9a1b2c3d4e5f6g7h8",
  "items": [
    {
      "product_id": 1,
      "product_name": "iPhone 15 Pro Max 256GB",
      "price": 29990000,
      "quantity": 3,
      "total": 89970000,
      "image": "/img/articles/product-1.jpg"
    },
    {
      "product_id": 2,
      "product_name": "Samsung Galaxy S24 Ultra 512GB",
      "price": 27990000,
      "quantity": 1,
      "total": 27990000,
      "image": "/img/articles/product-2.jpg"
    }
  ],
  "cart_total": 117960000
}
```

### 🎉 Bạn có thể thấy:
- ✅ 2 sản phẩm trong giỏ
- ✅ Số lượng đã được cộng dồn (3 iPhone)
- ✅ Tổng tiền mỗi sản phẩm
- ✅ Tổng tiền giỏ hàng

---

## ✏️ Test 3: Cập nhật số lượng

### **PUT /api/cart/update**

1. Tìm endpoint **PUT /api/cart/update**
2. Click **"Try it out"**
3. Paste Request body:

```json
{
  "user_id": "675473c9a1b2c3d4e5f6g7h8",
  "product_id": "6936297a701665210edbd101",
  "quantity": 5
}
```

4. Click **"Execute"**

### ✅ Response Success (200):

```json
{
  "status": "success",
  "message": "Đã cập nhật số lượng",
  "product_id": "6936297a701665210edbd101",
  "quantity": 5
}
```

### 🔄 Kiểm tra lại giỏ hàng:

Chạy lại **GET /api/cart/{user_id}** → Sẽ thấy quantity của iPhone đã thay đổi thành 5!

---

### Test case: Cập nhật quantity = 0 (xóa sản phẩm)

```json
{
  "user_id": "675473c9a1b2c3d4e5f6g7h8",
  "product_id": "6936297a701665210edbd102",
  "quantity": 0
}
```

Response:
```json
{
  "status": "success",
  "message": "Đã xóa sản phẩm khỏi giỏ hàng"
}
```

→ ✅ Sản phẩm Samsung đã bị xóa!

---

## 🗑️ Test 4: Xóa sản phẩm

### **DELETE /api/cart/delete**

1. Tìm endpoint **DELETE /api/cart/delete**
2. Click **"Try it out"**
3. Paste Request body:

```json
{
  "user_id": "675473c9a1b2c3d4e5f6g7h8",
  "product_id": "6936297a701665210edbd101"
}
```

4. Click **"Execute"**

### ✅ Response Success (200):

```json
{
  "status": "success",
  "message": "Đã xóa sản phẩm khỏi giỏ"
}
```

### 🔄 Kiểm tra lại giỏ hàng:

Chạy lại **GET /api/cart/{user_id}** → Giỏ hàng giờ đã trống!

```json
{
  "status": "success",
  "message": "Giỏ hàng trống",
  "user_id": "675473c9a1b2c3d4e5f6g7h8",
  "items": [],
  "cart_total": 0
}
```

---

## 🧪 Test Error Cases

### ❌ Test 1: Người dùng không tồn tại

**POST /api/cart/add** với user_id giả:

```json
{
  "user_id": "000000000000000000000000",
  "product_id": "6936297a701665210edbd101",
  "quantity": 1
}
```

Response (404):
```json
{
  "status": "error",
  "message": "Người dùng không tồn tại"
}
```

---

### ❌ Test 2: Sản phẩm không tồn tại

```json
{
  "user_id": "675473c9a1b2c3d4e5f6g7h8",
  "product_id": "000000000000000000000000",
  "quantity": 1
}
```

Response (404):
```json
{
  "status": "error",
  "message": "Sản phẩm không tồn tại"
}
```

---

### ❌ Test 3: Thiếu thông tin bắt buộc

```json
{
  "user_id": "675473c9a1b2c3d4e5f6g7h8",
  "quantity": 1
}
```

Response (400):
```json
{
  "status": "error",
  "message": "Thiếu thông tin: user_id, product_id, quantity là bắt buộc"
}
```

---

### ❌ Test 4: Số lượng không hợp lệ

```json
{
  "user_id": "675473c9a1b2c3d4e5f6g7h8",
  "product_id": "6936297a701665210edbd101",
  "quantity": -1
}
```

Response (400):
```json
{
  "status": "error",
  "message": "Số lượng phải lớn hơn 0"
}
```

---

### ❌ Test 5: Cập nhật sản phẩm không có trong giỏ

**PUT /api/cart/update** với product_id chưa thêm:

```json
{
  "user_id": "675473c9a1b2c3d4e5f6g7h8",
  "product_id": "6936297a701665210edbd109",
  "quantity": 3
}
```

Response (404):
```json
{
  "status": "error",
  "message": "Sản phẩm không có trong giỏ hàng"
}
```

---

## 📊 Test Flow Tổng hợp (Recommended)

### Flow 1: User mua 3 sản phẩm khác nhau

```
1. POST /api/cart/add → iPhone (qty: 2)
2. POST /api/cart/add → Samsung (qty: 1)
3. POST /api/cart/add → Xiaomi (qty: 3)
4. GET /api/cart/{user_id} → Xem giỏ (3 items, total)
5. PUT /api/cart/update → Tăng Samsung lên 2
6. GET /api/cart/{user_id} → Verify update
7. DELETE /api/cart/delete → Xóa Xiaomi
8. GET /api/cart/{user_id} → Còn 2 items
```

---

### Flow 2: User thêm lại sản phẩm đã có

```
1. POST /api/cart/add → iPhone (qty: 1)
2. GET /api/cart/{user_id} → qty = 1
3. POST /api/cart/add → iPhone (qty: 2) ← Thêm lại
4. GET /api/cart/{user_id} → qty = 3 ✅ (cộng dồn)
```

---

### Flow 3: Xóa tất cả sản phẩm

```
1. Thêm 3 sản phẩm
2. DELETE /api/cart/delete → Xóa product 1
3. DELETE /api/cart/delete → Xóa product 2
4. DELETE /api/cart/delete → Xóa product 3
5. GET /api/cart/{user_id} → "Giỏ hàng trống"
```

---

## 💡 Tips & Tricks

### 1. Copy nhanh user_id và product_id

Trong Swagger Response, click vào icon **📋** để copy toàn bộ response, sau đó extract các ID cần thiết.

### 2. Sử dụng Browser DevTools

- Mở F12 → Tab Network
- Xem các request/response chi tiết
- Debug nếu có lỗi

### 3. Test với nhiều users

Tạo nhiều tài khoản khác nhau và test cart riêng biệt để đảm bảo isolation.

### 4. Kiểm tra Database

Nếu bạn có MongoDB Compass:
```
Database: TechStore_User
Collection: carts
```

Xem trực tiếp cart documents trong DB.

### 5. Test Performance

Thử thêm nhiều sản phẩm (10-20 items) vào giỏ và kiểm tra response time.

---

## 🐛 Troubleshooting

### Lỗi: "Bad gateway"

**Nguyên nhân:** Service chưa chạy

**Fix:**
```bash
# Kiểm tra các services
curl http://localhost:3000/health  # Gateway
curl http://localhost:3002/health  # Auth
curl http://localhost:3001/health  # Product
```

Restart service nào return lỗi.

---

### Lỗi: "Người dùng không tồn tại"

**Nguyên nhân:** user_id không đúng

**Fix:**
1. Đăng nhập lại để lấy user_id mới
2. Đảm bảo copy đúng `id` từ response login
3. Kiểm tra user_id có 24 ký tự hex không

---

### Lỗi: "Sản phẩm không tồn tại"

**Nguyên nhân:** 
- Product service chưa có data
- product_id không đúng

**Fix:**
```bash
# Seed dữ liệu sản phẩm
cd server/product-service
npm run seed
```

Restart product-service.

---

### Response trống hoặc lỗi 502

**Fix:**
1. Check tất cả services đang chạy
2. Restart auth-service (quan trọng nhất cho Cart APIs)
3. Check MongoDB có đang chạy không

---

## 📝 Checklist Test đầy đủ

### Preparation:
- [ ] Auth Service running (port 3002)
- [ ] Product Service running (port 3001)
- [ ] API Gateway running (port 3000)
- [ ] MongoDB running
- [ ] Có dữ liệu sản phẩm (npm run seed)
- [ ] Swagger UI mở được (http://localhost:3000/api-docs)

### Test Cart APIs:
- [ ] ✅ POST /api/cart/add - Thêm sản phẩm mới
- [ ] ✅ POST /api/cart/add - Thêm lại sản phẩm đã có (cộng dồn)
- [ ] ✅ GET /api/cart/:user_id - Xem giỏ hàng có items
- [ ] ✅ GET /api/cart/:user_id - Xem giỏ hàng trống
- [ ] ✅ PUT /api/cart/update - Cập nhật số lượng
- [ ] ✅ PUT /api/cart/update - Cập nhật quantity = 0 (xóa)
- [ ] ✅ DELETE /api/cart/delete - Xóa sản phẩm

### Test Error Cases:
- [ ] ❌ User không tồn tại
- [ ] ❌ Product không tồn tại
- [ ] ❌ Thiếu thông tin bắt buộc
- [ ] ❌ Số lượng không hợp lệ
- [ ] ❌ Cập nhật product không có trong giỏ
- [ ] ❌ Xóa product không có trong giỏ

---

## 🎓 Tổng kết

Bạn đã test thành công Cart APIs với:

- ✅ **4 endpoints** hoạt động đầy đủ
- ✅ **Validation** input
- ✅ **Error handling** 
- ✅ **Business logic** (cộng dồn quantity)
- ✅ **Integration** với Product Service

### 📚 Next Steps:

1. Test integration với Frontend
2. Thêm authentication cho Cart APIs (JWT token)
3. Implement checkout flow
4. Add order history

---

**🚀 Happy Testing!**

Nếu gặp vấn đề, xem lại [CART_API_GUIDE.md](./CART_API_GUIDE.md) hoặc check terminal logs!


