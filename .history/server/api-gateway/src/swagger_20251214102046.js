const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechStore API Documentation',
      version: '1.0.0',
      description: 'API Documentation cho đồ án TechStore - Hệ thống bán hàng điện thoại',
      contact: {
        name: 'TechStore Team',
        email: 'support@techstore.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server (API Gateway)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập JWT token lấy từ endpoint /api/auth/login. Format: Bearer <token>'
        }
      },
      schemas: {
        // Auth schemas
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'Họ tên người dùng (chỉ chứa chữ cái và khoảng trắng)',
              example: 'Nguyễn Văn A'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email của người dùng',
              example: 'test@example.com'
            },
            password: {
              type: 'string',
              minLength: 8,
              description: 'Mật khẩu (tối thiểu 8 ký tự)',
              example: 'password123'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email đăng nhập',
              example: 'test@example.com'
            },
            password: {
              type: 'string',
              description: 'Mật khẩu',
              example: 'password123'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login success'
            },
            token: {
              type: 'string',
              description: 'JWT token (hiệu lực 24 giờ)',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '507f1f77bcf86cd799439011'
                },
                fullName: {
                  type: 'string',
                  example: 'Nguyễn Văn A'
                },
                email: {
                  type: 'string',
                  example: 'test@example.com'
                }
              }
            }
          }
        },
        UserProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            fullName: {
              type: 'string',
              example: 'Nguyễn Văn A'
            },
            email: {
              type: 'string',
              example: 'test@example.com'
            }
          }
        },
        UpdateProfileRequest: {
          type: 'object',
          required: ['fullName'],
          properties: {
            fullName: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Tên mới (2-100 ký tự, không chứa ký tự đặc biệt)',
              example: 'Nguyễn Văn B - Updated'
            }
          }
        },
        // Product schemas
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            id: {
              type: 'number',
              example: 1
            },
            title: {
              type: 'string',
              example: 'iPhone 15 Pro Max 256GB'
            },
            image: {
              type: 'string',
              example: '/img/articles/product-1.jpg'
            },
            price: {
              type: 'number',
              example: 29990000
            },
            oldPrice: {
              type: 'number',
              example: 34990000
            },
            rating: {
              type: 'number',
              example: 4.8
            },
            reviews: {
              type: 'number',
              example: 234
            },
            discount: {
              type: 'number',
              example: 14
            },
            category: {
              type: 'string',
              example: 'iPhone'
            },
            brand: {
              type: 'string',
              example: 'Apple'
            }
          }
        },
        ProductDetail: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '6923b627bd4162406bf43205'
            },
            phoneId: {
              type: 'string',
              example: '1'
            },
            description: {
              type: 'string',
              example: 'iPhone 15 Pro Max 256GB sở hữu chip A17 Bionic mạnh mẽ, màn hình Super Retina XDR...'
            },
            warranty: {
              type: 'string',
              example: '12 tháng'
            },
            colors: {
              type: 'string',
              example: 'Silver'
            },
            specs: {
              type: 'object',
              properties: {
                screen: {
                  type: 'string',
                  example: '6.7 inch Super Retina XDR'
                },
                cpu: {
                  type: 'string',
                  example: 'A17 Bionic'
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
                  example: '4323mAh'
                },
                os: {
                  type: 'string',
                  example: 'iOS 17'
                },
                connectivity: {
                  type: 'string',
                  example: '5G, Wi-Fi 6, Bluetooth 5.3'
                },
                weight: {
                  type: 'string',
                  example: '221g'
                }
              }
            }
          }
        },
        // Error schemas
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mã lỗi hoặc thông báo lỗi'
            },
            message: {
              type: 'string',
              description: 'Thông báo lỗi chi tiết'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            status: {
              type: 'number',
              example: 422
            },
            error: {
              type: 'string',
              example: 'VALIDATION_ERROR'
            },
            message: {
              type: 'string',
              example: 'Dữ liệu cập nhật không hợp lệ.'
            },
            details: {
              type: 'object',
              properties: {
                fullName: {
                  type: 'string',
                  example: 'Tên phải có ít nhất 2 ký tự'
                }
              }
            }
          }
        },
        UnauthorizedError: {
          type: 'object',
          properties: {
            status: {
              type: 'number',
              example: 401
            },
            error: {
              type: 'string',
              example: 'TOKEN_EXPIRED',
              enum: ['TOKEN_MISSING', 'INVALID_TOKEN', 'TOKEN_EXPIRED']
            },
            message: {
              type: 'string',
              example: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'API quản lý xác thực và người dùng'
      },
      {
        name: 'Products',
        description: 'API quản lý sản phẩm'
      },
      {
        name: 'Cart',
        description: 'API quản lý giỏ hàng'
      },
      {
        name: 'Health',
        description: 'Health check endpoints'
      }
    ]
  },
  apis: ['./index.js'] // Đường dẫn tới file chứa route definitions
};

const specs = swaggerJsdoc(options);

module.exports = specs;

