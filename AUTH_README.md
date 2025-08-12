# Authentication System

## Overview

The application now features a complete authentication system using NextAuth.js with database authentication against your Prisma User schema.

## Features

✅ **Beautiful Login Page** - Modern, responsive design matching your app's style
✅ **Database Authentication** - Authenticates against users in your database
✅ **Role-Based Access** - Supports Admin, Manager, and User roles
✅ **Session Management** - Secure JWT-based sessions
✅ **User Profile Display** - Shows user info and role in navbar
✅ **Password Security** - Uses bcrypt for password hashing

## Demo Users

The system has been seeded with demo users:

| Username | Password | Role | Department |
|----------|----------|------|------------|
| `admin` | `Welcome1` | Admin | IT |
| `john.doe` | `Welcome1` | User | Sales |
| `jane.manager` | `Welcome1` | Manager | Sales |
| `test.user` | `Welcome1` | User | QA |

## URLs

- **Login**: `/login`
- **Logout**: `/logout`
- **Main App**: `/` (requires authentication)
- **Users Management**: `/users` (requires authentication)

## Usage

1. Navigate to `/login`
2. Enter any of the demo credentials above
3. You'll be redirected to the main app
4. Your user info and role will be displayed in the navbar
5. Click "Logout" to sign out

## Authentication Flow

1. User submits credentials on login page
2. NextAuth validates against database users
3. Password is checked using bcrypt
4. JWT token is created with user data
5. Session includes user ID, name, role, and department
6. Protected routes check for valid session

## Adding New Users

Use the Users management page (`/users`) to create new users, or add them directly to the database with hashed passwords.

## Technical Details

- **Framework**: NextAuth.js
- **Password Hashing**: bcrypt with salt
- **Session Storage**: JWT tokens
- **Database Integration**: Direct Prisma queries
- **Route Protection**: Built-in NextAuth guards