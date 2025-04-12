const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kuberium API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Kuberium application',
      contact: {
        name: 'Kuberium Support',
        email: 'support@kuberium.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid'
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // User schemas
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] }
          }
        },
        UserSignup: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            password: { type: 'string', format: 'password', example: 'Password123!' }
          }
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            password: { type: 'string', format: 'password', example: 'Password123!' }
          }
        },
        UserProfile: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            bio: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] }
          }
        },
        
        // Expert schemas
        Expert: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            specialties: { 
              type: 'array', 
              items: { type: 'string' } 
            },
            experience: { type: 'string' },
            qualifications: { 
              type: 'array', 
              items: { type: 'string' } 
            },
            bio: { type: 'string' },
            role: { type: 'string', enum: ['expert'] },
            isVerified: { type: 'boolean' }
          }
        },
        ExpertSignup: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Dr. Jane Smith' },
            email: { type: 'string', format: 'email', example: 'jane.smith@example.com' },
            password: { type: 'string', format: 'password', example: 'Expert123!' },
            specialties: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['Financial Planning', 'Retirement']
            },
            experience: { type: 'string', example: '10+ years in financial advisory' },
            qualifications: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['CFP', 'CFA Level III']
            },
            bio: { type: 'string', example: 'Experienced financial advisor specializing in retirement planning and investment strategies.' }
          }
        },
        ExpertLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'jane.smith@example.com' },
            password: { type: 'string', format: 'password', example: 'Expert123!' }
          }
        },
        
        // Post schemas
        Post: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            postId: { type: 'string' },
            expertId: { type: 'string' },
            expertName: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            tags: { 
              type: 'array', 
              items: { type: 'string' } 
            },
            likes: { type: 'integer' },
            trust: { 
              type: 'object',
              properties: {
                sum: { type: 'integer' },
                count: { type: 'integer' },
                average: { type: 'number' }
              }
            },
            trustedBy: { 
              type: 'array', 
              items: { 
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  value: { type: 'integer' }
                }
              } 
            },
            likedBy: { 
              type: 'array', 
              items: { type: 'string' } 
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreatePost: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: { type: 'string', example: 'Retirement Planning Basics' },
            description: { type: 'string', example: 'In this post, I will cover the essential steps for planning your retirement effectively.' },
            tags: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['Retirement', 'Financial Planning', 'Investments']
            }
          }
        },
        UpdatePost: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Updated: Retirement Planning Basics' },
            description: { type: 'string', example: 'Updated content with more detailed information about retirement planning strategies.' },
            tags: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['Retirement', 'Financial Planning', 'Investments', '401k']
            }
          }
        },
        TrustPost: {
          type: 'object',
          required: ['trustValue'],
          properties: {
            trustValue: { 
              type: 'integer', 
              minimum: 1,
              maximum: 5,
              example: 5
            }
          }
        },
        
        // Response schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/swagger/*.js'
  ]
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI options
const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Kuberium API Documentation'
};

module.exports = {
  swaggerSpec,
  swaggerUi,
  swaggerUiOptions
};
