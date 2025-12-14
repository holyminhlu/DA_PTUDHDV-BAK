# Hướng Dẫn Test Product APIs qua API Gateway

## Bước 1: Khởi động Services

### Terminal 1: Product Service
```bash
cd "server/product-service/src"
node index.js
```
Kết quả: `product-service listening on port 3001`

### Terminal 2: API Gateway
```bash
cd "server/api-gateway/src"
node index.js
```
Kết quả: `api-gateway listening on port 3000`

## Bước 2: Truy cập Swagger UI

Mở trình duyệt: **http://localhost:3000/api-docs**

## Bước 3: Test các API

### 1. Test Health Check
- Mở rộng section **Health**
- Click vào `GET /health`
- Click nút **"Try it out"**
- Click nút **"Execute"**
- Kết quả mong đợi: `{ "status": "gateway ok" }`

### 2. Test Lấy Danh Sách Sản Phẩm
- Mở rộng section **Products**
- Click vào `GET /api/products`
- Click **"Try it out"**
- Click **"Execute"**
- Kết quả: Mảng các sản phẩm với đầy đủ thông tin

### 3. Test Lấy Sản Phẩm Nổi Bật
- Click vào `GET /api/products/featured`
- Click **"Try it out"**
- Thay đổi `limit` nếu muốn (mặc định 6)
- Click **"Execute"**
- Kết quả: Object chứa `results`, `count`, `type: "featured"`

### 4. Test Tìm Kiếm Sản Phẩm
- Click vào `GET /api/products/search`
- Click **"Try it out"**
- Nhập các tham số tìm kiếm:
  - `q`: "iPhone" (tìm theo tên)
  - `category`: "Smartphone"
  - `minPrice`: 10000000
  - `maxPrice`: 30000000
  - `sort`: "price-asc" (sắp xếp giá tăng dần)
  - `limit`: 20
- Click **"Execute"**
- Kết quả: Danh sách sản phẩm phù hợp với tiêu chí tìm kiếm

### 5. Test Chi Tiết Sản Phẩm
- Click vào `GET /api/products/{id}`
- Click **"Try it out"**
- Nhập `id` của sản phẩm (ví dụ: ID từ danh sách ở bước 2)
- Click **"Execute"**
- Kết quả: Thông tin chi tiết đầy đủ của sản phẩm (description, warranty, colors, specs)

## Các Tình Huống Test Khác

### Test với ID không tồn tại
```
GET /api/products/999999999999999999999999
```
Kết quả mong đợi: Status 404, message "Không tìm thấy sản phẩm"

### Test tìm kiếm không có kết quả
```
GET /api/products/search?q=xyz123notfound
```
Kết quả mong đợi: `{ "results": [], "count": 0 }`

### Test sắp xếp khác nhau
- `sort=price-asc`: Giá tăng dần
- `sort=price-desc`: Giá giảm dần
- `sort=name`: Theo tên A-Z
- `sort=rating`: Theo đánh giá cao nhất

## API Endpoints Summary

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Health check Gateway |
| GET | `/api/products` | Lấy tất cả sản phẩm (max 100) |
| GET | `/api/products/featured` | Sản phẩm nổi bật |
| GET | `/api/products/search` | Tìm kiếm sản phẩm |
| GET | `/api/products/{id}` | Chi tiết sản phẩm |

## Lưu Ý

1. **API Gateway** chạy ở port **3000**
2. **Product Service** chạy ở port **3001** (không test trực tiếp)
3. Tất cả request từ client đều đi qua Gateway
4. Gateway tự động thêm `x-request-id` để tracking
5. Response có thể cache để tăng hiệu năng

## Troubleshooting

### Lỗi 502 Bad Gateway
- Kiểm tra Product Service có chạy không (`port 3001`)
- Kiểm tra connection string MongoDB

### Lỗi 404 Not Found
- Kiểm tra endpoint có đúng không
- Xem Console log của Gateway để debug

### Không có dữ liệu
- Chạy seed data: `cd server/product-service/src && node seed.js`
- Kiểm tra MongoDB connection
