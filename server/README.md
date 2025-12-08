# 🖥️ TechStore Backend Services

## 📋 Tổng quan Architecture

Dự án sử dụng **Microservices Architecture** với 3 services chính:

```
┌─────────────────┐
│   Frontend      │
│   (Vue.js)      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  API Gateway    │  ← Swagger UI tại đây
│   Port: 3000    │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌─────────┐ ┌──────────────┐
│  Auth   │ │   Product    │
│ Service │ │   Service    │
│  :3002  │ │    :3001     │
└─────────┘ └──────────────┘
    │              │
    ↓              ↓
┌─────────┐ ┌──────────────┐
│MongoDB  │ │   MongoDB    │
│User DB  │ │  Product DB  │
└─────────┘ └──────────────┘
```

## 🗂️ Cấu trúc thư mục

```
server/
├── api-gateway/           # API Gateway (port 3000)
│   ├── src/
│   │   ├── index.js      # Main gateway file với Swagger
│   │   └── swagger.js    # Swagger configuration
│   └── package.json
│
├── auth-service/          # Authentication Service (port 3002)
│   ├── src/
│   │   ├── index.js      # Auth endpoints & JWT
│   │   ├── models/
│   │   │   └── User.js   # User model
│   │   └── seed.js       # Seed data
│   └── package.json
│
└── product-service/       # Product Service (port 3001)
    ├── src/
    │   └── index.js      # Product endpoints
    └── package.json
```

## 🔌 API Endpoints

### API Gateway (Port 3000)

| Endpoint | Method | Auth | Mô tả |
|----------|--------|------|-------|
| `/health` | GET | ❌ | Health check |
| `/api/products` | GET | ❌ | Lấy tất cả sản phẩm |
| `/api/products/:id` | GET | ❌ | Lấy 1 sản phẩm |
| `/api/auth/register` | POST | ❌ | Đăng ký |
| `/api/auth/login` | POST | ❌ | Đăng nhập |
| `/api/auth/profile` | GET | ✅ | Xem profile |
| `/api/auth/profile` | PUT | ✅ | Cập nhật profile |
| `/api-docs` | GET | ❌ | **Swagger UI** |

### Auth Service (Port 3002)

Xử lý authentication và user management:
- User registration với validation
- Login với JWT token (24h expiry)
- Profile management
- Password hashing với bcrypt

### Product Service (Port 3001)

Quản lý sản phẩm:
- Lấy danh sách phones
- Lấy chi tiết phone theo ID
- Kết nối MongoDB collection `Phone`

## 🚀 Cài đặt & Chạy

### Prerequisites

- Node.js 16+
- MongoDB
- npm hoặc yarn

### Cài đặt nhanh

**Windows:**
```bash
# Chạy script tự động
install-swagger.bat
```

**Manual:**
```bash
# Cài đặt từng service
cd api-gateway && npm install
cd ../auth-service && npm install
cd ../product-service && npm install
```

### Chạy services

**Cách 1: Mở 3 terminals riêng biệt**

Terminal 1:
```bash
cd auth-service
npm start
```

Terminal 2:
```bash
cd product-service
npm start
```

Terminal 3:
```bash
cd api-gateway
npm start
```

**Cách 2: Sử dụng PM2 (recommended for production)**

```bash
# Cài đặt PM2 globally
npm install -g pm2

# Start tất cả services
pm2 start auth-service/src/index.js --name auth-service
pm2 start product-service/src/index.js --name product-service
pm2 start api-gateway/src/index.js --name api-gateway

# Xem status
pm2 status

# Xem logs
pm2 logs

# Stop tất cả
pm2 stop all
```

## 📊 Environment Variables

### API Gateway (.env)

```env
PORT=3000
PRODUCT_SERVICE_URL=http://localhost:3001
AUTH_SERVICE_URL=http://localhost:3002
```

### Auth Service (.env)

```env
PORT=3002
MONGO_URI=mongodb://localhost:27017/TechStore_User
JWT_SECRET=your-secret-key-change-in-production
```

### Product Service (.env)

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/TechStore
```

## 🔐 Authentication Flow

```
1. User Register
   POST /api/auth/register
   ↓
   Hash password → Save to MongoDB

2. User Login
   POST /api/auth/login
   ↓
   Verify password → Generate JWT token
   ↓
   Return token (expires in 24h)

3. Access Protected Routes
   Authorization: Bearer <token>
   ↓
   Verify JWT → Extract userId
   ↓
   Access granted
```

## 🧪 Testing với Swagger

### 1. Truy cập Swagger UI

```
http://localhost:3000/api-docs
```

### 2. Test Flow

1. **Đăng ký tài khoản** → `POST /api/auth/register`
2. **Đăng nhập** → `POST /api/auth/login`
3. **Copy token** từ response
4. **Authorize** → Click 🔓 button → Nhập `Bearer <token>`
5. **Test protected APIs** → `GET/PUT /api/auth/profile`

Xem hướng dẫn chi tiết: [SWAGGER_QUICKSTART.md](../SWAGGER_QUICKSTART.md)

## 📦 Dependencies

### API Gateway
- `express` - Web framework
- `axios` - HTTP client
- `cors` - CORS middleware
- `swagger-jsdoc` - Swagger generator
- `swagger-ui-express` - Swagger UI

### Auth Service
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT implementation
- `cors` - CORS middleware

### Product Service
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - CORS middleware

## 🔍 Monitoring & Debugging

### Health Checks

```bash
# Check all services
curl http://localhost:3000/health  # Gateway
curl http://localhost:3002/health  # Auth
curl http://localhost:3001/health  # Product
```

### Logs

Mỗi request được log với format:
```
[requestId] METHOD path - statusCode - durationMs
```

Ví dụ:
```
[a1b2c3d4] GET /api/products - 200 - 45ms
[e5f6g7h8] POST /api/auth/login - 401 - 123ms
```

### MongoDB Check

```bash
# Connect to MongoDB
mongosh

# List databases
show dbs

# Use database
use TechStore
use TechStore_User

# Check collections
show collections

# Count documents
db.Phone.count()
db.users.count()
```

## 🐛 Common Issues

### Port already in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### MongoDB connection error

```bash
# Check MongoDB is running
mongod --version

# Start MongoDB
mongod

# Or start as service
net start MongoDB  # Windows
brew services start mongodb-community  # Mac
```

### CORS errors

API Gateway đã cấu hình CORS cho phép tất cả origins. Nếu vẫn gặp lỗi:
- Kiểm tra browser console
- Verify headers trong request
- Check CORS middleware trong code

## 📚 API Documentation

- **Swagger UI:** http://localhost:3000/api-docs (live documentation)
- **Postman Collection:** Có thể export từ Swagger UI

## 🔧 Development

### Add new endpoint

1. **Thêm vào service tương ứng**

```javascript
// Trong auth-service/src/index.js
app.get('/api/auth/new-endpoint', async (req, res) => {
  // Logic
});
```

2. **Forward qua API Gateway**

```javascript
// Trong api-gateway/src/index.js
app.get('/api/auth/new-endpoint', async (req, res) => {
  const resp = await axios.get(`${AUTH_SERVICE_URL}/api/auth/new-endpoint`);
  res.json(resp.data);
});
```

3. **Thêm Swagger documentation**

```javascript
/**
 * @swagger
 * /api/auth/new-endpoint:
 *   get:
 *     tags: [Authentication]
 *     summary: Endpoint mới
 *     responses:
 *       200:
 *         description: Success
 */
```

### Database Schema

**User Model:**
```javascript
{
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  createdAt: Date
}
```

**Phone Model:**
```javascript
{
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
  stock: Number
}
```

## 🚢 Deployment

### Docker (recommended)

```bash
# Build images
docker build -t techstore-gateway ./api-gateway
docker build -t techstore-auth ./auth-service
docker build -t techstore-product ./product-service

# Run with docker-compose
docker-compose up -d
```

### Traditional Server

1. Install Node.js và MongoDB trên server
2. Clone repo
3. Install dependencies cho từng service
4. Setup PM2 cho process management
5. Configure reverse proxy (nginx)
6. Setup SSL certificates

## 📖 Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Swagger Docs](https://swagger.io/docs/)

## 👥 Team

TechStore Development Team

---

**📞 Support:** support@techstore.com  
**📄 License:** ISC


