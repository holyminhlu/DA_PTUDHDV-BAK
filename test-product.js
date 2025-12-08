const axios = require('axios');

async function testProduct() {
  try {
    // Test 1: Lấy danh sách sản phẩm
    console.log('📦 Lấy danh sách sản phẩm...');
    const productsResponse = await axios.get('http://localhost:3001/phones');
    const products = productsResponse.data;
    
    if (products.length === 0) {
      console.log('❌ KHÔNG CÓ SẢN PHẨM NÀO!');
      console.log('👉 Chạy: cd server/product-service && npm run seed');
      return;
    }
    
    console.log(`✅ Có ${products.length} sản phẩm\n`);
    
    // Hiển thị 3 sản phẩm đầu
    console.log('📱 3 sản phẩm đầu tiên:');
    products.slice(0, 3).forEach((p, i) => {
      console.log(`${i+1}. ID: ${p._id}`);
      console.log(`   Title: ${p.title}`);
      console.log(`   Price: ${p.price?.toLocaleString('vi-VN')}đ\n`);
    });
    
    // Test 2: Thử lấy chi tiết sản phẩm đầu tiên
    const firstProductId = products[0]._id;
    console.log(`🔍 Test lấy chi tiết sản phẩm: ${firstProductId}`);
    
    try {
      const detailResponse = await axios.get(`http://localhost:3001/phones/${firstProductId}`);
      const detail = detailResponse.data;
      
      console.log('\n✅ Response từ product service:');
      console.log('   _id:', detail._id);
      console.log('   phoneId:', detail.phoneId);
      console.log('   title:', detail.title);
      console.log('   price:', detail.price);
      console.log('   description:', detail.description?.substring(0, 50) + '...');
      
      // Kiểm tra các field bắt buộc
      console.log('\n🔍 Kiểm tra fields bắt buộc cho Cart:');
      console.log('   ✓ title (product_name):', detail.title ? '✅' : '❌');
      console.log('   ✓ price:', detail.price ? '✅' : '❌');
      
      if (!detail.title || !detail.price) {
        console.log('\n⚠️  CẢNH BÁO: Sản phẩm thiếu field bắt buộc!');
      } else {
        console.log('\n✅ Sản phẩm OK, có thể dùng để test Cart!');
        console.log(`\n👉 Dùng product_id này để test: ${firstProductId}`);
      }
      
    } catch (err) {
      console.log('❌ Lỗi khi lấy chi tiết:', err.message);
    }
    
  } catch (err) {
    console.log('❌ Lỗi:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.log('👉 Product service chưa chạy! Start: cd server/product-service && npm start');
    }
  }
}

testProduct();


