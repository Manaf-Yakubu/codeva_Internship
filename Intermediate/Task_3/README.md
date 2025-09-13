# CodeVa Internship Task 3: Database Integration

A comprehensive e-commerce API built with Node.js, Express.js, and PostgreSQL, featuring complete CRUD operations, data validation, and Ghana-specific customizations.

## 🇬🇭 Author
**Yakubu Abdul Manaf**  
CodeVa Internship Program  
Ghana, West Africa

## 🚀 Features

### Core Database Features
- **PostgreSQL with Sequelize ORM** - Professional database integration
- **Complete CRUD Operations** - Create, Read, Update, Delete for all models
- **Data Validation** - Comprehensive input validation with express-validator
- **Database Indexing** - Optimized queries with strategic indexes
- **Relationships** - Complex model associations and foreign keys
- **Transactions** - Data integrity with database transactions

### Ghana-Specific Features
- **Ghana Cities & Regions** - All 10 regions and major cities
- **Ghana Phone Validation** - Supports +233 and local formats
- **Mobile Money Integration** - MTN, Vodafone, AirtelTigo support
- **Local Language Names** - Twi, Ga, Ewe, Hausa translations
- **Ghana-made Products** - Special categorization for local products
- **Regional Shipping Costs** - Distance-based pricing for all regions

### API Features
- **RESTful Design** - Standard HTTP methods and status codes
- **Pagination** - Efficient data loading with page/limit support
- **Search & Filtering** - Advanced product and user search
- **Error Handling** - Comprehensive error responses
- **Rate Limiting** - Protection against abuse
- **Security Headers** - Helmet.js security middleware
- **CORS Support** - Cross-origin resource sharing

## 📋 Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Models & Relationships](#models--relationships)
- [Testing](#testing)
- [Ghana Features](#ghana-features)
- [Performance](#performance)
- [Contributing](#contributing)

## 🛠 Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd Task_3

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up database
npm run setup

# Seed with sample data
npm run seed

# Start the server
npm start
```

## ⚙️ Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codeva_Task_3_db
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_DIALECT=postgres

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Ghana Settings
DEFAULT_CURRENCY=GHS
DEFAULT_TIMEZONE=Africa/Accra
DEFAULT_LANGUAGE=en
```

### Database Setup
```bash
# Create PostgreSQL database
createdb codeva_Task_3_db

# Run setup script
npm run setup

# Populate with sample data
npm run seed
```

## 🗄️ Database Setup

### Automatic Setup
```bash
npm run setup    # Create tables and relationships
npm run seed     # Add sample data
```

### Manual Setup
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE codeva_Task_3_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE codeva_Task_3_db TO your_user;
```

## 🌐 API Endpoints

### Base URL
```
http://localhost:5000
```

### Health & Info
```http
GET /              # Welcome message and API info
GET /health        # Health check and database status
```

### Users API
```http
GET    /api/users                    # Get all users (paginated)
GET    /api/users/search?q=query     # Search users
GET    /api/users/stats              # User statistics
GET    /api/users/:id                # Get user by ID
POST   /api/users                    # Create new user
PUT    /api/users/:id                # Update user
DELETE /api/users/:id                # Deactivate user
GET    /api/users/region/:region     # Users by Ghana region
```

### Categories API
```http
GET    /api/categories               # Get all categories
GET    /api/categories/tree          # Category tree structure
GET    /api/categories/popular       # Popular categories
GET    /api/categories/ghana         # Ghana-specific categories
GET    /api/categories/search?q=query # Search categories
GET    /api/categories/:id           # Get category by ID
POST   /api/categories               # Create category
PUT    /api/categories/:id           # Update category
DELETE /api/categories/:id           # Delete category
```

### Products API
```http
GET    /api/products                 # Get all products (with filters)
GET    /api/products/search?q=query  # Search products
GET    /api/products/featured        # Featured products
GET    /api/products/ghana-made      # Ghana-made products
GET    /api/products/category/:id    # Products by category
GET    /api/products/:id             # Get product by ID
POST   /api/products                 # Create product
PUT    /api/products/:id             # Update product
DELETE /api/products/:id             # Delete product
PUT    /api/products/:id/rating      # Update product rating
```

### Orders API
```http
GET    /api/orders                   # Get all orders
GET    /api/orders/stats             # Order statistics
GET    /api/orders/regions           # Orders by Ghana regions
GET    /api/orders/payment-methods   # Payment method stats
GET    /api/orders/user/:userId      # Orders by user
GET    /api/orders/:id               # Get order by ID
POST   /api/orders                   # Create order
PUT    /api/orders/:id               # Update order
PUT    /api/orders/:id/status        # Update order status
DELETE /api/orders/:id               # Cancel order
```

### Query Parameters

#### Pagination
```http
?page=1&limit=20
```

#### Product Filters
```http
?categoryId=uuid&minPrice=10&maxPrice=100&madeInGhana=true&inStock=true
```

#### Search
```http
?q=search_term
```

## 🏗️ Models & Relationships

### User Model
```javascript
{
  id: UUID (Primary Key),
  firstName: String(50),
  lastName: String(50),
  email: String (Unique),
  password: String (Hashed),
  phone: String (Ghana format),
  role: ENUM('user', 'admin', 'vendor'),
  avatar: Text,
  addressStreet: String,
  addressCity: ENUM(Ghana Cities),
  addressRegion: ENUM(Ghana Regions),
  addressPostalCode: String(10),
  addressCountry: String(50),
  dateOfBirth: Date,
  isActive: Boolean,
  emailVerified: Boolean,
  lastLogin: Date,
  preferences: JSONB,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model
```javascript
{
  id: UUID (Primary Key),
  name: String(50) (Unique),
  slug: String(60) (Unique),
  description: Text,
  image: Text,
  parentId: UUID (Self-Reference),
  isActive: Boolean,
  sortOrder: Integer,
  metadata: JSONB,
  isGhanaSpecific: Boolean,
  ghanaRegions: Array[ENUM],
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  id: UUID (Primary Key),
  name: String(100),
  slug: String(120) (Unique),
  description: Text,
  shortDescription: String(200),
  price: Decimal(10,2),
  comparePrice: Decimal(10,2),
  currency: ENUM('GHS', 'USD', 'EUR'),
  categoryId: UUID (Foreign Key),
  vendorId: UUID (Foreign Key),
  images: JSONB,
  sku: String(50) (Unique),
  quantity: Integer,
  lowStockThreshold: Integer,
  trackQuantity: Boolean,
  specifications: JSONB,
  tags: Array[String],
  isActive: Boolean,
  isFeatured: Boolean,
  isDigital: Boolean,
  weight: JSONB,
  dimensions: JSONB,
  seo: JSONB,
  madeInGhana: Boolean,
  ghanaRegion: ENUM(Ghana Regions),
  localLanguageName: JSONB,
  views: Integer,
  salesCount: Integer,
  ratingAverage: Decimal(2,1),
  ratingCount: Integer,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  id: UUID (Primary Key),
  orderNumber: String(20) (Unique),
  userId: UUID (Foreign Key),
  items: JSONB,
  status: ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
  paymentStatus: ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
  paymentMethod: ENUM('cash', 'mobile_money', 'card', 'bank_transfer', 'paystack'),
  paymentDetails: JSONB,
  mobileMoneyDetails: JSONB,
  subtotal: Decimal(10,2),
  tax: Decimal(10,2),
  shippingCost: Decimal(10,2),
  discount: Decimal(10,2),
  total: Decimal(10,2),
  currency: ENUM('GHS', 'USD', 'EUR'),
  // Shipping Address Fields
  shippingFirstName: String(50),
  shippingLastName: String(50),
  shippingPhone: String(15),
  shippingEmail: String,
  shippingStreet: String,
  shippingCity: ENUM(Ghana Cities),
  shippingRegion: ENUM(Ghana Regions),
  shippingPostalCode: String(10),
  shippingCountry: String(50),
  shippingInstructions: Text,
  billingAddress: JSONB,
  shippingMethod: JSONB,
  tracking: JSONB,
  notes: JSONB,
  statusHistory: JSONB,
  createdAt: Date,
  updatedAt: Date
}
```

### Relationships
- **User → Products** (One-to-Many as vendor)
- **User → Orders** (One-to-Many as customer)
- **Category → Products** (One-to-Many)
- **Category → Category** (Self-referencing for subcategories)
- **Order → User** (Many-to-One)

## 🧪 Testing

### Automated API Testing
```bash
# Start the server (in one terminal)
npm start

# Run tests (in another terminal)
npm test
```

### Manual Testing
```bash
# Test individual endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/users
curl http://localhost:5000/api/products/featured
```

### Test Coverage
The test suite covers:
- ✅ Health check and welcome endpoints
- ✅ User CRUD operations and statistics
- ✅ Category CRUD operations and tree structure
- ✅ Product CRUD operations and search
- ✅ Order CRUD operations and analytics
- ✅ Error handling and validation
- ✅ Ghana-specific features

## 🇬🇭 Ghana Features

### Supported Cities
```
Accra, Kumasi, Tamale, Cape Coast, Sekondi-Takoradi, 
Sunyani, Koforidua, Ho, Wa, Bolgatanga
```

### Supported Regions
```
Greater Accra, Ashanti, Northern, Central, Western, 
Brong-Ahafo, Eastern, Volta, Upper West, Upper East
```

### Phone Number Formats
```
+233244123456  (International)
0244123456     (Local)
```

### Mobile Money Networks
```
MTN, Vodafone, AirtelTigo
```

### Local Languages
```
Twi, Ga, Ewe, Hausa
```

### Regional Shipping Costs (GHS)
```
Greater Accra: 15    Central: 20      Western: 30
Ashanti: 25          Eastern: 25      Volta: 35
Northern: 40         Brong-Ahafo: 35  Upper West: 45
Upper East: 45
```

## ⚡ Performance & Optimization

### Database Indexes
- **Users**: email, phone, addressCity, role, isActive, createdAt
- **Categories**: name, slug, parentId, isActive, sortOrder, isGhanaSpecific
- **Products**: name, slug, categoryId, vendorId, sku, price, isActive, isFeatured, madeInGhana, createdAt, ratingAverage, salesCount, views
- **Orders**: orderNumber, userId, status, paymentStatus, createdAt, shippingCity, shippingRegion, paymentMethod

### Query Optimization
- Pagination for large datasets
- Selective field loading
- Efficient joins with associations
- Search optimization with ILIKE queries

### Caching Strategy
- Database connection pooling
- Query result optimization
- Static asset caching headers

## 🔒 Security Features

### Data Protection
- Password hashing with bcrypt (12 salt rounds)
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection with Helmet.js

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable limits via environment variables

### Error Handling
- Comprehensive error responses
- No sensitive data exposure
- Proper HTTP status codes

## 📚 Sample Data

The seed script includes:
- **4 Users** (Admin, Vendors, Customer)
- **6 Categories** (Including Ghana-specific)
- **4 Products** (Including Ghana-made items)
- **3 Sample Orders** (Different statuses)

### Sample Ghana Products
- Authentic Kente Cloth from Ashanti Region
- Pure Ghanaian Palm Oil from Central Region
- Adinkra Symbol T-Shirt (Gye Nyame)

## 🚀 Deployment

### Production Setup
```bash
# Set environment to production
NODE_ENV=production

# Use production database
DATABASE_URL=postgresql://user:pass@host:port/db

# Configure security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_MAX_REQUESTS=50
```

### Docker Support
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📖 API Documentation

### Response Format
```javascript
// Success Response
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "errors": [ /* validation errors */ ]
}

// Paginated Response
{
  "success": true,
  "data": {
    "items": [ /* array of items */ ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🤝 Contributing

### Development Setup
```bash
# Install dependencies
npm install

# Set up development database
npm run setup

# Start development server with auto-reload
npm run dev

# Run tests
npm test
```

### Code Style
- Use ESLint configuration
- Follow REST API conventions
- Write comprehensive tests
- Document new features

## 📝 Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run setup      # Set up database tables
npm run seed       # Populate database with sample data
npm test           # Run API tests
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Verify database exists
psql -U postgres -l | grep codeva_Task_3_db

# Check credentials in .env file
```

**Port Already in Use**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process or change PORT in .env
```

**Validation Errors**
- Check request body format
- Verify required fields
- Ensure proper data types
- Check Ghana-specific validations

## 📄 License

This project is part of the CodeVa Internship Program.

## 👨‍💻 Author

**Yakubu Abdul Manaf**
- Email: yakubumanaf@gmail.com
- Country: Ghana 🇬🇭
- Program: CodeVa Internship - Intermediate Level
- Task: Database Integration with PostgreSQL

---

## 🎯 Task Requirements Completed

✅ **Database Integration**: PostgreSQL with Sequelize ORM  
✅ **CRUD Operations**: Complete Create, Read, Update, Delete functionality  
✅ **Data Validation**: Comprehensive input validation and error handling  
✅ **Database Relationships**: Complex model associations and foreign keys  
✅ **Indexing & Optimization**: Strategic database indexes for performance  
✅ **Ghana Customization**: Local features, regions, cities, and languages  
✅ **API Documentation**: Comprehensive README and inline documentation  
✅ **Testing**: Automated API testing suite  
✅ **Security**: Rate limiting, validation, and security headers  
✅ **Production Ready**: Environment configuration and deployment setup  

**🏆 All intermediate-level requirements successfully implemented!**
