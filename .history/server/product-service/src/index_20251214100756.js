const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { randomUUID } = require('crypto');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/TechStore_Product';
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Product Service API Docs'
}));

// Middleware: request logging with request ID
app.use((req, res, next) => {
  req.id = randomUUID().slice(0, 8);
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.id}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Phone model using the collection 'Phone' and flexible schema
// Ensure we read from the existing 'Phone' collection in MongoDB
const phoneSchema = new mongoose.Schema({}, { strict: false, collection: 'Phone' });
const Phone = mongoose.model('Phone', phoneSchema);

// PhoneInfo model (separate collection) - used for detailed product info
const phoneInfoSchema = new mongoose.Schema({}, { strict: false, collection: 'PhoneInfo' });
const PhoneInfo = mongoose.model('PhoneInfo', phoneInfoSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('product-service: connected to MongoDB', MONGO_URI);
}).catch(err => {
    console.error('product-service: MongoDB connection error', err);
    process.exit(1);
});

// Routes

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Kiểm tra trạng thái hoạt động của service
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service đang hoạt động bình thường
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   example: product-service
 */
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'product-service' }));

/**
 * @swagger
 * /phones:
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm
 *     description: Trả về danh sách tất cả sản phẩm điện thoại (tối đa 100 sản phẩm)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /phones -> Danh sách tất cả sản phẩm (tối đa 100)
// Trả về: Array of products với format chuẩn
app.get('/phones', async (req, res) => {
    try {
        console.log(`[${req.id}] GET /phones - Fetching all phones`);
        const phones = await Phone.find().limit(100).lean();
        
        // Map to standard format
        const mapped = phones.map(p => ({
            _id: p._id,
            id: (p.id !== undefined && p.id !== null) ? p.id : (p.phoneId !== undefined && p.phoneId !== null) ? p.phoneId : String(p._id),
            title: p.title || p.name || 'Unknown Product',
            image: p.image || '/img/articles/product-default.jpg',
            price: p.price || 0,
            oldPrice: p.oldPrice || p.price || 0,
            rating: p.rating || 0,
            reviews: p.reviews || 0,
            discount: p.discount || 0,
            category: p.category || 'Uncategorized',
            brand: p.brand || 'Unknown'
        }));
        
        console.log(`[${req.id}] Found ${mapped.length} phones`);
        res.json(mapped);
    } catch (err) {
        console.error(`[${req.id}] Error fetching phones:`, err.message || err);
        res.status(500).json({ 
            error: 'Internal server error', 
            requestId: req.id 
        });
    }
});

/**
 * @swagger
 * /phones/featured:
 *   get:
 *     summary: Lấy danh sách sản phẩm nổi bật
 *     description: Trả về các sản phẩm nổi bật (rating cao, discount lớn, hoặc được đánh dấu featured)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Số lượng sản phẩm tối đa
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm nổi bật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeaturedResult'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /phones/featured -> Hiển thị các sản phẩm nổi bật
// Trả về: Array of featured products (rating cao, discount lớn, hoặc được đánh dấu featured)
app.get('/phones/featured', async (req, res) => {
    try {
        console.log(`[${req.id}] GET /phones/featured - Fetching featured phones`);
        const limit = Number(req.query.limit) || 6;
        
        // Query sản phẩm nổi bật:
        // 1. Có field isFeatured = true
        // 2. Hoặc có rating >= 4.5
        // 3. Hoặc có discount >= 10%
        const phones = await Phone.find({
            $or: [
                { isFeatured: true },
                { rating: { $gte: 4.5 } },
                { discount: { $gte: 10 } }
            ]
        })
        .sort({ rating: -1, discount: -1 }) // Ưu tiên rating cao và discount lớn
        .limit(limit)
        .lean();
        
        // Map to standard format
        const mapped = phones.map(p => ({
            _id: p._id,
            id: (p.id !== undefined && p.id !== null) ? p.id : (p.phoneId !== undefined && p.phoneId !== null) ? p.phoneId : String(p._id),
            title: p.title || p.name || 'Unknown Product',
            image: p.image || '/img/articles/product-default.jpg',
            price: p.price || 0,
            oldPrice: p.oldPrice || p.price || 0,
            rating: p.rating || 0,
            reviews: p.reviews || 0,
            discount: p.discount || 0,
            category: p.category || 'Uncategorized',
            brand: p.brand || 'Unknown',
            isFeatured: true
        }));
        
        console.log(`[${req.id}] Found ${mapped.length} featured phones`);
        res.json({
            results: mapped,
            count: mapped.length,
            type: 'featured'
        });
        
    } catch (err) {
        console.error(`[${req.id}] Error fetching featured phones:`, err.message || err);
        res.status(500).json({ 
            error: 'Internal server error', 
            requestId: req.id 
        });
    }
});

/**
 * @swagger
 * /phones/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm
 *     description: Tìm kiếm sản phẩm theo từ khóa, danh mục, khoảng giá
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm (tìm trong title, description, brand, category)
 *         example: iPhone
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Danh mục sản phẩm
 *         example: Smartphone
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *         example: 10000000
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *         example: 30000000
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [relevance, price-asc, price-desc, name, rating]
 *           default: relevance
 *         description: Sắp xếp kết quả
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Số lượng kết quả tối đa
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResult'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /phones/search -> search phones by query, category, price range, etc.
app.get('/phones/search', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, sort = 'relevance', limit = 50 } = req.query;
        
        // Nếu không có tham số tìm kiếm nào, trả về mảng rỗng
        if (!q && !category && !minPrice && !maxPrice) {
            return res.json({
                results: [],
                count: 0,
                query: req.query
            });
        }
        
        let query = {};
        
        // Text search on title, description, brand fields
        if (q && q.trim()) {
            const searchRegex = new RegExp(q.trim(), 'i');
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { brand: searchRegex },
                { category: searchRegex }
            ];
        }
        
        // Filter by category
        if (category && category.trim()) {
            query.category = new RegExp(category.trim(), 'i');
        }
        
        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        
        // Build sort object
        let sortObj = {};
        if (sort === 'price-asc') sortObj.price = 1;
        else if (sort === 'price-desc') sortObj.price = -1;
        else if (sort === 'name') sortObj.title = 1;
        else if (sort === 'rating') sortObj.rating = -1;
        
        const phones = await Phone.find(query).sort(sortObj).limit(Number(limit)).lean();
        
        // Normalize id for frontend
        const mapped = phones.map(p => ({
            ...p,
            id: (p.id !== undefined && p.id !== null) ? p.id : (p.phoneId !== undefined && p.phoneId !== null) ? p.phoneId : (p._id ? String(p._id) : null)
        }));
        
        res.json({
            results: mapped,
            count: mapped.length,
            query: { q, category, minPrice, maxPrice, sort }
        });
    } catch (err) {
        console.error(`[${req.id}] Error searching phones:`, err.message || err);
        res.status(500).json({ error: 'Internal server error', requestId: req.id });
    }
});

/**
 * @swagger
 * /phones/by-id/{id}:
 *   get:
 *     summary: Lấy sản phẩm theo ID field
 *     description: Lấy thông tin sản phẩm theo field 'id' (string hoặc numeric)
 *     tags: [Product Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           oneOf:
 *             - type: string
 *             - type: integer
 *         description: ID của sản phẩm (có thể là string hoặc number)
 *         example: 1
 *     responses:
 *       200:
 *         description: Thông tin sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /phones/by-id/:id and alias /phonesby-id/:id -> explicitly fetch by `id` field (string or numeric)
const fetchPhoneByIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        // Try exact string match first
        let phone = await Phone.findOne({ id: id }).lean();

        // If not found and id looks numeric, try numeric match
        if (!phone) {
            const numeric = Number(id);
            if (!Number.isNaN(numeric)) {
                phone = await Phone.findOne({ id: numeric }).lean();
            }
        }

        if (!phone) return res.status(404).json({ error: 'Not found', requestId: req.id });

        // Normalize id field for frontend convenience (mirror /phones mapping)
        const mapped = {
            ...phone,
            id: (phone.id !== undefined && phone.id !== null) ? phone.id : (phone.phoneId !== undefined && phone.phoneId !== null) ? phone.phoneId : (phone._id ? String(phone._id) : null)
        };

        res.json(mapped);
    } catch (err) {
        console.error(`[${req.id}] Error fetching phone by id ${id}:`, err.message || err);
        res.status(500).json({ error: 'Internal server error', requestId: req.id });
    }
};

app.get('/phones/by-id/:id', fetchPhoneByIdHandler);
app.get('/phonesby-id/:id', fetchPhoneByIdHandler);

// GET /phones/:id -> Chi tiết sản phẩm
// Trả về: Thông tin chi tiết với phoneId, description, warranty, colors, specs
app.get('/phones/:id', async (req, res) => {
    const { id } = req.params;
    const mongooseId = mongoose.Types.ObjectId;
    
    try {
        console.log(`[${req.id}] GET /phones/${id} - Fetching phone details`);
        
        // Bước 5: Kiểm tra tính hợp lệ của ObjectId
        if (!mongooseId.isValid(id)) {
            console.log(`[${req.id}] Invalid ObjectId: ${id}`);
            return res.status(400).json({ 
                error: 'Invalid id format', 
                message: 'ID phải là MongoDB ObjectId hợp lệ',
                requestId: req.id 
            });
        }
        
        // Bước 6: Truy vấn MongoDB
        let phone = await Phone.findById(id).lean();
        
        // Nếu không tìm thấy bằng _id, thử tìm bằng phoneId
        if (!phone) {
            const numeric = Number(id);
            if (!Number.isNaN(numeric)) {
                phone = await Phone.findOne({ phoneId: numeric }).lean();
            }
        }
        
        // Nếu vẫn không tìm thấy, thử các trường khác
        if (!phone) {
            phone = await Phone.findOne({ 
                $or: [
                    { phoneId: id },
                    { id: id }
                ]
            }).lean();
        }
        
        // Bước 7: Xử lý kết quả
        if (!phone) {
            console.log(`[${req.id}] Phone not found: ${id}`);
            return res.status(404).json({ 
                error: 'Not found', 
                message: 'Không tìm thấy sản phẩm',
                requestId: req.id 
            });
        }
        
        // Format response theo yêu cầu (bao gồm ALL fields cần thiết cho Cart)
        const response = {
            _id: phone._id,
            phoneId: phone.phoneId || phone.id || String(phone._id),
            title: phone.title || phone.name || 'Unknown Product',  // ← THÊM FIELD NÀY
            price: phone.price || 0,  // ← THÊM FIELD NÀY
            image: phone.image || '/img/articles/product-default.jpg',  // ← THÊM FIELD NÀY
            description: phone.description || phone.desc || '',
            warranty: phone.warranty || '12 tháng',
            colors: phone.colors || phone.color || 'Standard',
            specs: phone.specs || {
                screen: phone.screen || 'N/A',
                cpu: phone.cpu || phone.processor || 'N/A',
                ram: phone.ram || 'N/A',
                storage: phone.storage || phone.memory || 'N/A',
                camera: phone.camera || 'N/A',
                battery: phone.battery || 'N/A',
                os: phone.os || phone.operatingSystem || 'N/A',
                connectivity: phone.connectivity || '5G, Wi-Fi, Bluetooth',
                weight: phone.weight || 'N/A'
            }
        };
        
        console.log(`[${req.id}] Phone found: ${response.phoneId}`);
        res.json(response);
        
    } catch (err) {
        // Bước 8: Xử lý lỗi
        console.error(`[${req.id}] Error fetching phone ${id}:`, err.message || err);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Lỗi server khi lấy thông tin sản phẩm',
            requestId: req.id 
        });
    }
});

// GET /phoneinfo/:id -> for development/testing return the PhoneInfo document where phoneId === 1
app.get('/phoneinfo/:id', async (req, res) => {
    const { id } = req.params;
    const mongooseId = mongoose.Types.ObjectId;
    try {
        let phone = null;

        const numeric = Number(id);
        // 1. If the id looks numeric (e.g. '/product/1'), prefer matching phoneId first
        if (!Number.isNaN(numeric)) {
            phone = await PhoneInfo.findOne({ phoneId: numeric }).lean();
            if (!phone) {
                // then try id as numeric
                phone = await PhoneInfo.findOne({ id: numeric }).lean();
            }
        }

        // 2. Try matching the 'id' field as string
        if (!phone) {
            phone = await PhoneInfo.findOne({ id: id }).lean();
        }

        // 3. If still not found, try matching by ObjectId (_id)
        if (!phone && mongooseId.isValid(id)) {
            phone = await PhoneInfo.findById(id).lean();
        }

        // 4. As a last fallback, try phoneId as string
        if (!phone) {
            phone = await PhoneInfo.findOne({ phoneId: id }).lean();
        }

        if (!phone) return res.status(404).json({ error: 'Not found', requestId: req.id });
        res.json(phone);
    } catch (err) {
        console.error(`[${req.id}] Error fetching phoneInfo ${id}:`, err.message || err);
        res.status(500).json({ error: 'Internal server error', requestId: req.id });
    }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

app.listen(PORT, () => {
    console.log(`product-service listening on port ${PORT}`);
});