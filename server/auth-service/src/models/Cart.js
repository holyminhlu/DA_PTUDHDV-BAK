const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Phone'
  },
  productId: {
    type: Number,
    required: true
  },
  product_name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  image: {
    type: String
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true
  },
  items: [cartItemSchema],
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Tính tổng giá trị giỏ hàng
cartSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Tìm item trong giỏ
cartSchema.methods.findItem = function(productId) {
  return this.items.find(item => 
    item.productId === productId || 
    item.product_id.toString() === productId
  );
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;


