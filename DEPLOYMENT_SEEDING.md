# Deployment Seeding Guide

This guide explains how to seed your database during deployment with comprehensive test data.

## 🚀 Quick Start

### For Demo/QA Environments
```bash
# Build the application
npm run build

# Seed with demo data
npm run seed:demo
```

### For Production (with safety checks)
```bash
# Build the application  
npm run build

# Seed only if DEMO_MODE=true is set
DEMO_MODE=true npm run seed:deploy
```

## 📋 Available Scripts

| Script | Description | Safety Level |
|--------|-------------|--------------|
| `npm run seed` | Original user-only seeding | ✅ Safe |
| `npm run seed:deploy` | Full deployment seeding with safety checks | ✅ Safe |
| `npm run seed:demo` | Force demo mode seeding | ⚠️ Demo only |
| `npm run seed:force` | Force seeding (bypasses all safety checks) | ❌ Dangerous |

## 🛡️ Safety Features

The deployment seeding includes multiple safety checks:

### Environment Detection
- **Development**: Always allows seeding
- **Production**: Requires `DEMO_MODE=true` or `FORCE_SEED=true`
- **Demo/QA**: Allows seeding with `DEMO_MODE=true`

### Environment Variables
```bash
# Enable demo mode (safe for QA environments)
DEMO_MODE=true

# Force seeding (use with extreme caution)
FORCE_SEED=true
```

## 📊 Seed Data Contents

After seeding, your database will contain:

### Users (Password: Welcome1)
- **admin** - Admin role (full access)
- **john.manager** - Manager role (user/data management)  
- **jane.user** - User role (standard access)
- **bob.viewer** - Viewer role (read-only)
- **test.user** - User role (additional test account)
- **archived.user** - Viewer role (archived for testing)

### Sample Data
- **4 Roles**: Admin, Manager, User, Viewer
- **5 Customers**: Sample companies with full contact information
- **20 Products**: Software products with realistic pricing
- **10 Orders**: Mix of completed, pending, and draft orders

## 🏗️ Deployment Integration

### Docker
```dockerfile
# In your Dockerfile
RUN npm run build
RUN DEMO_MODE=true npm run seed:deploy
```

### CI/CD Pipeline
```yaml
# Example GitHub Actions
- name: Build Application
  run: npm run build

- name: Seed Database
  run: DEMO_MODE=true npm run seed:deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Vercel/Netlify
```bash
# Build command
npm run build

# In your environment variables
DEMO_MODE=true
```

### Railway/Render
Add to your build script:
```json
{
  "scripts": {
    "build": "next build && npm run seed:demo"
  }
}
```

## 🔧 Troubleshooting

### "Could not load seed function"
This happens when the TypeScript hasn't been compiled. Solutions:

1. **Recommended**: Ensure build runs before seeding:
   ```bash
   npm run build
   npm run seed:deploy
   ```

2. **Alternative**: Install ts-node for development:
   ```bash
   npm install --save-dev ts-node
   ```

### "Skipping seed in production environment"
This is the safety feature working. To enable seeding:
```bash
DEMO_MODE=true npm run seed:deploy
```

### Database Connection Issues
Ensure your `DATABASE_URL` environment variable is set correctly:
```bash
DATABASE_URL="your-database-connection-string"
```

## ⚠️ Important Notes

### Production Safety
- Never run `npm run seed:force` in production
- Always use `DEMO_MODE=true` for demo environments
- The safety checks are there to protect your data

### Database Impact
- **⚠️ WARNING**: Seeding will **DELETE ALL EXISTING DATA**
- Always backup production data before seeding
- Only use in demo/QA environments

### Performance
- Seeding creates ~41 database records
- Process typically takes 5-15 seconds
- Includes comprehensive error handling and logging

## 🎯 Best Practices

1. **Use environment-specific seeding**:
   - Development: `npm run seed:deploy`
   - Demo/QA: `DEMO_MODE=true npm run seed:deploy`
   - Production: Only with explicit approval

2. **Automate in CI/CD**:
   - Include seeding in your deployment pipeline
   - Use environment variables for configuration

3. **Monitor and log**:
   - The seed process includes comprehensive logging
   - Monitor for any errors during deployment

4. **Test after seeding**:
   - Verify all test accounts work
   - Check that sample data is properly created
   - Confirm the application functions correctly

## 🔍 Verification

After seeding, you can verify the data:

```bash
# Check user count
npx prisma studio

# Or test login with any of these accounts:
# Username: admin, Password: Welcome1
# Username: john.manager, Password: Welcome1
# Username: jane.user, Password: Welcome1
```

## 📞 Support

If you encounter issues with deployment seeding:
1. Check the logs for specific error messages
2. Verify environment variables are set correctly  
3. Ensure database connection is working
4. Review this guide for troubleshooting steps