const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Service API Documentation',
      version: '1.0.0',
      description: 'API Documentation cho Product Service - Quản lý sản phẩm điện thoại',
      contact: {
        name: 'TechStore Team',
        email: 'support@techstore.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Product Service'
      }
    ],
    components: {
      schemas: {
        // Product schemas
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId',
              example: '507f1f77bcf86cd799439011'
            },
            id: {
              oneOf: [
                { type: 'string' },
                { type: 'number' }
              ],
              description: 'ID sản phẩm (có thể là string hoặc number)',
              example: 1
            },
            phoneId: {
              oneOf: [
                { type: 'string' },
                { type: 'number' }
              ],
              description: 'Phone ID (có thể là string hoặc number)',
              example: 1
            },
            title: {
              type: 'string',
              description: 'Tên sản phẩm',
              example: 'iPhone 15 Pro Max'
            },
            image: {
              type: 'string',
              description: 'URL hình ảnh sản phẩm',
              example: '/img/articles/product-default.jpg'
            },
            price: {
              type: 'number',
              description: 'Giá hiện tại',
              example: 29990000
            },
            oldPrice: {
              type: 'number',
              description: 'Giá cũ',
              example: 33990000
            },
            rating: {
              type: 'number',
              description: 'Đánh giá (0-5)',
              example: 4.5
            },
            reviews: {
              type: 'number',
              description: 'Số lượng đánh giá',
              example: 128
            },
            discount: {
              type: 'number',
              description: 'Phần trăm giảm giá',
              example: 15
            },
            category: {
              type: 'string',
              description: 'Danh mục sản phẩm',
              example: 'Smartphone'
            },
            brand: {
              type: 'string',
              description: 'Thương hiệu',
              example: 'Apple'
            }
          }
        },
        ProductDetail: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId',
              example: '507f1f77bcf86cd799439011'
            },
            phoneId: {
              oneOf: [
                { type: 'string' },
                { type: 'number' }
              ],
              description: 'Phone ID',
              example: 1
            },
            title: {
              type: 'string',
              description: 'Tên sản phẩm',
              example: 'iPhone 15 Pro Max'
            },
            price: {
              type: 'number',
              description: 'Giá sản phẩm',
              example: 29990000
            },
            image: {
              type: 'string',
              description: 'URL hình ảnh',
              example: '/img/articles/product-default.jpg'
            },
            description: {
              type: 'string',
              description: 'Mô tả chi tiết sản phẩm',
              example: 'iPhone 15 Pro Max là flagship mới nhất của Apple với...'
            },
            warranty: {
              type: 'string',
              description: 'Bảo hành',
              example: '12 tháng'
            },
            colors: {
              oneOf: [
                { type: 'string' },
                { 
                  type: 'array',
                  items: { type: 'string' }
                }
              ],
              description: 'Màu sắc có sẵn',
              example: ['Titan Tự Nhiên', 'Titan Trắng', 'Titan Đen']
            },
            specs: {
              type: 'object',
              description: 'Thông số kỹ thuật',
              properties: {
                screen: {
                  type: 'string',
                  example: '6.7" Super Retina XDR OLED'
                },
                cpu: {
                  type: 'string',
                  example: 'Apple A17 Pro'
                },
                ram: {
                  type: 'string',
                  example: '8GB'
                },
                storage: {
                  type: 'string',
                  example: '256GB'
                },
                camera: {
                  type: 'string',
                  example: '48MP + 12MP + 12MP'
                },
                battery: {
                  type: 'string',
                  example: '4422 mAh'
                },
                os: {
                  type: 'string',
                  example: 'iOS 17'
                },
                connectivity: {
                  type: 'string',
                  example: '5G, Wi-Fi 6E, Bluetooth 5.3'
                },
                weight: {
                  type: 'string',
                  example: '221g'
                }
              }
            }
          }
        },
        SearchResult: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Product'
              }
            },
            count: {
              type: 'number',
              description: 'Số lượng kết quả',
              example: 10
            },
            query: {
              type: 'object',
              description: 'Thông tin query đã sử dụng'
            }
          }
        },
        FeaturedResult: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                allOf: [
                  { $ref: '#/components/schemas/Product' },
                  {
                    type: 'object',
                    properties: {
                      isFeatured: {
                        type: 'boolean',
                        example: true
                      }
                    }
                  }
                ]
              }
            },
            count: {
              type: 'number',
              description: 'Số lượng sản phẩm nổi bật',
              example: 6
            },
            type: {
              type: 'string',
              example: 'featured'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mã lỗi',
              example: 'Not found'
            },
            message: {
              type: 'string',
              description: 'Mô tả lỗi',
              example: 'Không tìm thấy sản phẩm'
            },
            requestId: {
              type: 'string',
              description: 'ID request để tracking',
              example: 'a1b2c3d4'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'Products',
        description: 'Quản lý và truy vấn sản phẩm'
      },
      {
        name: 'Product Details',
        description: 'Chi tiết sản phẩm'
      }
    ]
  },
  apis: ['./index.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
