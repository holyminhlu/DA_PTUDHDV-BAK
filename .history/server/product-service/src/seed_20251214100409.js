/**
 * Seed Data Script for TechStore_Product Database
 * 
 * Script này tạo dữ liệu mẫu cho database TechStore_Product
 * Chạy: node src/seed.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/TechStore_Product';

// Phone Schema - Collection Phone (danh sách sản phẩm)
const phoneSchema = new mongoose.Schema({}, { strict: false, collection: 'Phone' });
const Phone = mongoose.model('Phone', phoneSchema);

// Sample data - Danh sách điện thoại
const phones = [
  // {
  //   phoneId: 1,
  //   id: 1,
  //   title: 'iPhone 15 Pro Max 256GB',
  //   image: '/img/articles/product-1.jpg',
  //   price: 29990000,
  //   oldPrice: 34990000,
  //   rating: 4.8,
  //   reviews: 234,
  //   discount: 14,
  //   category: 'iPhone',
  //   brand: 'Apple',
  //   isFeatured: true,
  //   description: 'iPhone 15 Pro Max 256GB sở hữu chip A17 Bionic mạnh mẽ, màn hình Super Retina XDR 6.7 inch, camera 48MP chuyên nghiệp',
  //   warranty: '12 tháng',
  //   colors: 'Silver, Gold, Space Black, Blue Titanium',
  //   specs: {
  //     screen: '6.7 inch Super Retina XDR OLED',
  //     cpu: 'Apple A17 Bionic',
  //     ram: '8GB',
  //     storage: '256GB',
  //     camera: '48MP + 12MP + 12MP (telephoto)',
  //     battery: '4323mAh',
  //     os: 'iOS 17',
  //     connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3',
  //     weight: '221g'
  //   }
  // },
  {
    phoneId: 2,
    id: 2,
    title: 'Samsung Galaxy S24 Ultra 512GB',
    image: '/img/articles/product-2.jpg',
    price: 27990000,
    oldPrice: 31990000,
    rating: 4.7,
    reviews: 189,
    discount: 13,
    category: 'Samsung',
    brand: 'Samsung',
    isFeatured: true,
    description: 'Samsung Galaxy S24 Ultra với S Pen tích hợp, camera 200MP, màn hình Dynamic AMOLED 2X 6.8 inch, chip Snapdragon 8 Gen 3',
    warranty: '12 tháng',
    colors: 'Titanium Gray, Titanium Black, Titanium Violet, Titanium Yellow',
    specs: {
      screen: '6.8 inch Dynamic AMOLED 2X, 120Hz',
      cpu: 'Snapdragon 8 Gen 3 for Galaxy',
      ram: '12GB',
      storage: '512GB',
      camera: '200MP + 50MP + 12MP + 10MP',
      battery: '5000mAh',
      os: 'Android 14, One UI 6.1',
      connectivity: '5G, Wi-Fi 7, Bluetooth 5.3',
      weight: '232g'
    }
  },
  {
    phoneId: 3,
    id: 3,
    title: 'iPhone 14 Pro 128GB',
    image: '/img/articles/product-3.jpg',
    price: 24990000,
    oldPrice: 27990000,
    rating: 4.6,
    reviews: 312,
    discount: 11,
    category: 'iPhone',
    brand: 'Apple',
    isFeatured: true,
    description: 'iPhone 14 Pro với Dynamic Island độc đáo, chip A16 Bionic, camera 48MP ProRAW, màn hình Always-On',
    warranty: '12 tháng',
    colors: 'Space Black, Silver, Gold, Deep Purple',
    specs: {
      screen: '6.1 inch Super Retina XDR OLED',
      cpu: 'Apple A16 Bionic',
      ram: '6GB',
      storage: '128GB',
      camera: '48MP + 12MP + 12MP',
      battery: '3200mAh',
      os: 'iOS 17',
      connectivity: '5G, Wi-Fi 6, Bluetooth 5.3',
      weight: '206g'
    }
  },
  {
    phoneId: 4,
    id: 4,
    title: 'Xiaomi 14 Pro 256GB',
    image: '/img/articles/product-4.jpg',
    price: 19990000,
    oldPrice: 22990000,
    rating: 4.5,
    reviews: 156,
    discount: 13,
    category: 'Xiaomi',
    brand: 'Xiaomi',
    isFeatured: true,
    description: 'Xiaomi 14 Pro với Leica Summilux, chip Snapdragon 8 Gen 3, màn hình AMOLED 120Hz, sạc nhanh 120W',
    warranty: '18 tháng',
    colors: 'Black, White, Green',
    specs: {
      screen: '6.73 inch AMOLED, 120Hz',
      cpu: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '256GB',
      camera: '50MP Leica + 50MP + 50MP',
      battery: '4880mAh',
      os: 'Android 14, HyperOS',
      connectivity: '5G, Wi-Fi 7, Bluetooth 5.4',
      weight: '219g'
    }
  },
  {
    phoneId: 5,
    id: 5,
    title: 'OPPO Find X7 Ultra 512GB',
    image: '/img/articles/product-5.jpg',
    price: 23990000,
    oldPrice: 26990000,
    rating: 4.6,
    reviews: 98,
    discount: 11,
    category: 'OPPO',
    brand: 'OPPO',
    isFeatured: true,
    description: 'OPPO Find X7 Ultra với 4 camera Hasselblad, chip Snapdragon 8 Gen 3, màn hình AMOLED cong 120Hz',
    warranty: '12 tháng',
    colors: 'Ocean Blue, Desert Silver',
    specs: {
      screen: '6.82 inch AMOLED, 120Hz',
      cpu: 'Snapdragon 8 Gen 3',
      ram: '16GB',
      storage: '512GB',
      camera: '50MP Hasselblad (4 cameras)',
      battery: '5000mAh',
      os: 'Android 14, ColorOS 14',
      connectivity: '5G, Wi-Fi 7, Bluetooth 5.4',
      weight: '221g'
    }
  },
  {
    phoneId: 6,
    id: 6,
    title: 'Samsung Galaxy Z Fold5 256GB',
    image: '/img/articles/product-6.jpg',
    price: 35990000,
    oldPrice: 40990000,
    rating: 4.7,
    reviews: 145,
    discount: 12,
    category: 'Samsung',
    brand: 'Samsung',
    isFeatured: true,
    description: 'Samsung Galaxy Z Fold5 màn hình gập độc đáo 7.6 inch, chip Snapdragon 8 Gen 2, S Pen support',
    warranty: '12 tháng',
    colors: 'Phantom Black, Cream, Icy Blue',
    specs: {
      screen: '7.6 inch Dynamic AMOLED 2X (Main), 6.2 inch (Cover)',
      cpu: 'Snapdragon 8 Gen 2 for Galaxy',
      ram: '12GB',
      storage: '256GB',
      camera: '50MP + 12MP + 10MP',
      battery: '4400mAh',
      os: 'Android 13, One UI 5.1.1',
      connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3',
      weight: '253g'
    }
  },
  {
    phoneId: 7,
    id: 7,
    title: 'Google Pixel 8 Pro 256GB',
    image: '/img/articles/product-1.jpg',
    price: 21990000,
    oldPrice: 24990000,
    rating: 4.6,
    reviews: 187,
    discount: 12,
    category: 'Google',
    brand: 'Google',
    isFeatured: false,
    description: 'Google Pixel 8 Pro với AI Photography, chip Google Tensor G3, màn hình LTPO OLED 120Hz',
    warranty: '12 tháng',
    colors: 'Obsidian, Porcelain, Bay',
    specs: {
      screen: '6.7 inch LTPO OLED, 120Hz',
      cpu: 'Google Tensor G3',
      ram: '12GB',
      storage: '256GB',
      camera: '50MP + 48MP + 48MP',
      battery: '5050mAh',
      os: 'Android 14',
      connectivity: '5G, Wi-Fi 7, Bluetooth 5.3',
      weight: '213g'
    }
  },
  {
    phoneId: 8,
    id: 8,
    title: 'iPhone 13 128GB',
    image: '/img/articles/product-2.jpg',
    price: 16990000,
    oldPrice: 18990000,
    rating: 4.5,
    reviews: 421,
    discount: 11,
    category: 'iPhone',
    brand: 'Apple',
    isFeatured: false,
    description: 'iPhone 13 với chip A15 Bionic, camera kép 12MP, màn hình Super Retina XDR',
    warranty: '12 tháng',
    colors: 'Pink, Blue, Midnight, Starlight, Red',
    specs: {
      screen: '6.1 inch Super Retina XDR OLED',
      cpu: 'Apple A15 Bionic',
      ram: '4GB',
      storage: '128GB',
      camera: '12MP + 12MP',
      battery: '3240mAh',
      os: 'iOS 17',
      connectivity: '5G, Wi-Fi 6, Bluetooth 5.0',
      weight: '174g'
    }
  },
  {
    phoneId: 9,
    id: 9,
    title: 'Vivo X100 Pro 512GB',
    image: '/img/articles/product-3.jpg',
    price: 22990000,
    oldPrice: 25990000,
    rating: 4.6,
    reviews: 76,
    discount: 12,
    category: 'Vivo',
    brand: 'Vivo',
    isFeatured: false,
    description: 'Vivo X100 Pro với camera Zeiss, chip MediaTek Dimensity 9300, màn hình AMOLED cong',
    warranty: '18 tháng',
    colors: 'Asteroid Black, Sunset Orange',
    specs: {
      screen: '6.78 inch AMOLED, 120Hz',
      cpu: 'MediaTek Dimensity 9300',
      ram: '16GB',
      storage: '512GB',
      camera: '50MP Zeiss + 50MP + 50MP',
      battery: '5400mAh',
      os: 'Android 14, OriginOS 4',
      connectivity: '5G, Wi-Fi 7, Bluetooth 5.4',
      weight: '221g'
    }
  },
  {
    phoneId: 10,
    id: 10,
    title: 'OnePlus 12 256GB',
    image: '/img/articles/product-4.jpg',
    price: 18990000,
    oldPrice: 20990000,
    rating: 4.5,
    reviews: 134,
    discount: 10,
    category: 'OnePlus',
    brand: 'OnePlus',
    isFeatured: false,
    description: 'OnePlus 12 với Hasselblad camera, chip Snapdragon 8 Gen 3, sạc nhanh 100W',
    warranty: '12 tháng',
    colors: 'Flowy Emerald, Silky Black',
    specs: {
      screen: '6.82 inch AMOLED, 120Hz',
      cpu: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '256GB',
      camera: '50MP Hasselblad + 48MP + 32MP',
      battery: '5400mAh',
      os: 'Android 14, OxygenOS 14',
      connectivity: '5G, Wi-Fi 7, Bluetooth 5.4',
      weight: '220g'
    }
  }
];

// Hàm seed data
async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB:', MONGO_URI);

    // Xóa dữ liệu cũ
    console.log('🗑️  Clearing old data...');
    await Phone.deleteMany({});
    console.log('✅ Old data cleared');

    // Insert dữ liệu mới
    console.log('📝 Inserting new phone data...');
    const result = await Phone.insertMany(phones);
    console.log(`✅ Inserted ${result.length} phones successfully!`);

    // Hiển thị thống kê
    console.log('\n📊 Database Statistics:');
    console.log(`   Total phones: ${result.length}`);
    console.log(`   Featured phones: ${phones.filter(p => p.isFeatured).length}`);
    console.log(`   Brands: ${[...new Set(phones.map(p => p.brand))].join(', ')}`);
    console.log(`   Categories: ${[...new Set(phones.map(p => p.category))].join(', ')}`);

    // Hiển thị một số sản phẩm mẫu
    console.log('\n📱 Sample Products:');
    result.slice(0, 3).forEach(phone => {
      console.log(`   - ${phone.title} (${phone.price.toLocaleString('vi-VN')}đ) - Rating: ${phone.rating}⭐`);
    });

    console.log('\n✨ Seed completed successfully!');
    console.log('\n🚀 You can now start the product-service:');
    console.log('   cd server/product-service');
    console.log('   npm start');
    console.log('\n📖 Test APIs:');
    console.log('   GET http://localhost:3001/phones');
    console.log('   GET http://localhost:3001/phones/featured');
    console.log('   GET http://localhost:3001/phones/search?q=iPhone');
    console.log(`   GET http://localhost:3001/phones/${result[0]._id}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
}

// Chạy seed
seedDatabase();

