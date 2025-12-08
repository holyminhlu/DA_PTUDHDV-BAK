const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/TechStore_Product';

async function checkDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const Phone = mongoose.model('Phone', new mongoose.Schema({}, { strict: false, collection: 'Phone' }));
    
    const count = await Phone.countDocuments();
    console.log(`📊 Total phones in database: ${count}`);
    
    if (count > 0) {
      const phones = await Phone.find().limit(3).lean();
      console.log('\n📱 Sample products:');
      phones.forEach(p => {
        console.log(`  - ${p.title || p.name} (${p._id})`);
      });
    } else {
      console.log('⚠️ No phones found! Run: npm run seed');
    }
    
    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkDatabase();


