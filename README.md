# KeyCase™ Demo Web - CRM Application

A comprehensive Customer Relationship Management (CRM) application built with Next.js, TypeScript, and Prisma. This is a demo/QA environment with comprehensive test data seeding capabilities.

## 🚀 Features

- **User Management**: Role-based access control (Admin, Manager, User, Viewer)
- **Customer Management**: Complete customer lifecycle management
- **Order Management**: Order processing with items and status tracking  
- **Product Catalog**: Product management with pricing
- **Profile Management**: User profile updates and password changes
- **QA Settings**: Database reset and seeding for testing
- **API Documentation**: Complete OpenAPI/Swagger documentation
- **Authentication**: NextAuth.js with JWT tokens

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Material-UI v5, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Authentication**: NextAuth.js with JWT
- **Validation**: React Hook Form with validation
- **State Management**: React Context + Custom Hooks

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DemoWeb
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL="file:./dev.db"
# NEXTAUTH_SECRET="your-secret-here"
# NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with test data
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Test Accounts

Default password for all accounts: **Welcome1**

| Username | Role | Access Level |
|----------|------|-------------|
| `admin` | Admin | Full system access |
| `john.manager` | Manager | User and data management |
| `jane.user` | User | Standard user access |
| `bob.viewer` | Viewer | Read-only access |
| `test.user` | User | Additional test account |

## 📊 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Database
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run seed         # Seed with basic user data
npm run seed:deploy  # Comprehensive deployment seeding
npm run seed:demo    # Force demo mode seeding
```

## 🗄️ Database Seeding

This project includes comprehensive database seeding for QA and demo environments.

### Quick Seeding
```bash
# Basic user seeding
npm run seed

# Full demo data (users + customers + products + orders)
npm run seed:demo
```

### Deployment Seeding
```bash
# Safe deployment seeding with environment checks
npm run seed:deploy

# Force seeding in demo environment  
DEMO_MODE=true npm run seed:deploy
```

### QA Data Reset
Use the Settings page in the application to reset all data to fresh test state, or use the API:
```bash
curl -X POST http://localhost:3000/api/system/reset-data
```

## 🚀 Deployment

### Environment Variables
```bash
# Required
DATABASE_URL="your-database-connection-string"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"

# Optional - for demo/QA environments
DEMO_MODE=true                    # Enable demo features
NODE_ENV=production              # Environment
```

### Build and Deploy
```bash
# Standard deployment
npm run build
npm start

# With demo data seeding
npm run build
DEMO_MODE=true npm run seed:deploy
npm start
```

### Docker Deployment
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage  
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Seed database if in demo mode
RUN if [ "$DEMO_MODE" = "true" ]; then npm run seed:deploy; fi

EXPOSE 3000
CMD ["npm", "start"]
```

### Platform-Specific Deployment

#### Vercel
1. Connect your Git repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

#### Railway/Render
```json
{
  "scripts": {
    "build": "next build && npm run seed:demo"
  }
}
```

#### Docker/AWS/Google Cloud
Use the Docker configuration above with appropriate environment variables.

## 📁 Project Structure

```
├── prisma/                 # Database schema and seeds
│   ├── schema.prisma      # Database schema
│   ├── seed-users.cjs     # Basic user seeding
│   └── deploy-seed.js     # Deployment seeding
├── src/
│   ├── components/        # React components
│   │   ├── common/       # Shared components
│   │   ├── customers/    # Customer management
│   │   ├── orders/       # Order management  
│   │   ├── products/     # Product management
│   │   ├── users/        # User management
│   │   ├── profile/      # User profile
│   │   └── settings/     # QA settings
│   ├── pages/            # Next.js pages and API routes
│   │   ├── api/          # API endpoints
│   │   └── ...           # Page components
│   ├── services/         # Business logic
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   ├── provider/         # React Context providers
│   └── types/            # TypeScript type definitions
├── docs/                 # API documentation
└── DEPLOYMENT_SEEDING.md # Detailed seeding guide
```

## 🔒 Security Features

- **Authentication**: JWT-based authentication with NextAuth.js
- **Authorization**: Role-based access control
- **Password Security**: bcrypt hashing with salt
- **API Protection**: All API routes require authentication
- **Input Validation**: Comprehensive form and API validation
- **XSS Protection**: Built-in Next.js security features

## 🧪 QA & Testing Features

- **Settings Page**: Complete database reset functionality
- **Test Data**: Comprehensive sample data for all entities
- **Multiple User Roles**: Test different permission levels
- **API Endpoint**: Programmatic data reset via `/api/system/reset-data`
- **Environment Safety**: Production-safe seeding with multiple checks

## 📖 API Documentation

Access the interactive API documentation at `/docs` when running the application.

Key endpoints:
- `POST /api/auth/signin` - User authentication
- `GET /api/me` - Current user profile
- `PUT /api/me` - Update profile
- `PUT /api/me/change-password` - Change password
- `GET /api/customers` - Customer management
- `GET /api/orders` - Order management
- `GET /api/products` - Product management
- `GET /api/users` - User management (Admin/Manager only)
- `POST /api/system/reset-data` - Reset database (QA only)

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/dev.db
npm run db:push
npm run seed
```

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Seeding Issues
```bash
# Check logs for specific errors
npm run seed:deploy

# Force seeding in development
FORCE_SEED=true npm run seed:deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

### Development Workflow
```bash
# Setup
git clone <repo>
cd DemoWeb
npm install
npm run db:push
npm run seed
npm run dev

# Before committing
npm run lint
npm run format
npm run build  # Ensure it builds
```

## 📝 License

This software is released under the MIT License. See LICENSE file for details.

## 🆘 Support

- Check the troubleshooting section above
- Review `DEPLOYMENT_SEEDING.md` for deployment issues
- Check application logs for specific error messages
- Verify environment variables are set correctly

## 🏷️ Version

Current version: 0.1.0

---

**KeyCase™ Demo** - A comprehensive CRM demo application for QA and development testing.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
