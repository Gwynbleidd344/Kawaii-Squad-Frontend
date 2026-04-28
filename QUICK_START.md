# Quick Start Guide - Digital Identity Frontend

## Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:3000` (or update VITE_API_URL)
- npm or yarn package manager

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` to match your backend API URL:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

## Testing the Application

### 1. Register a New User
1. Navigate to http://localhost:5173/register
2. Fill in the form:
   - Full Name, Father's Name, Mother's Name (min 3 chars)
   - Date of Birth
   - Place of Birth
   - Email (valid format)
   - Password (min 8 chars, 1 uppercase, 1 number)
   - ID Photo (JPEG, PNG, or WebP, max 5MB)
3. Click "Register"
4. You should be redirected to `/pending-approval`

### 2. Check Approval Status
1. Click "Check Status" button on the pending approval page
2. Status updates when admin approves/rejects
3. Once CONFIRMED, you can login

### 3. Login
1. Navigate to http://localhost:5173/login
2. Enter your email and password
3. If CONFIRMED: Redirected to `/dashboard`
4. If PENDING: Shows wait message
5. If REJECTED: Shows rejection reason

### 4. View Dashboard
1. After login, view your profile at `/dashboard`
2. See all your information and status
3. Click "Refresh Profile" to get latest data
4. Click "Logout" to sign out

## Project Structure

```
src/
├── components/          # React components
│   └── AuthLayout.tsx   # Protected route wrapper
├── hooks/               # Custom React hooks
│   └── useAuth.ts       # Auth-related hooks
├── lib/                 # Utility libraries
│   ├── api.ts           # API client
│   └── utils.ts         # Helper functions
├── page/                # Page components
│   ├── Register.tsx     # Registration page
│   ├── Login.tsx        # Login page
│   ├── Dashboard.tsx    # User profile page
│   └── PendingApproval.tsx # Status page
├── store/               # State management
│   └── authstore.ts     # Zustand auth store
├── types/               # TypeScript types
│   └── index.ts         # All OpenAPI types
├── App.tsx              # Main app with routing
├── App.css              # Global styles
└── main.tsx             # App entry point
```

## Key Files Explained

### `src/store/authstore.ts`
Zustand store managing authentication state:
- `user`: Current logged-in user
- `token`: JWT token
- `login()`, `register()`: Auth actions
- `logout()`: Clear auth

### `src/lib/api.ts`
API client for backend communication:
- All endpoint methods
- Automatic token injection
- Error handling
- FormData for file uploads

### `src/components/AuthLayout.tsx`
Protected route wrapper:
- Checks if user is authenticated
- Checks user role (USER, ADMIN)
- Checks identity status (CONFIRMED, PENDING, REJECTED)
- Guards routes accordingly

### `src/page/Register.tsx`
User registration:
- Form with Zod validation
- Photo upload with preview
- Client-side validation before API call

### `src/page/Login.tsx`
User login:
- Email & password form
- Handles different status responses
- Shows appropriate error messages

## Environment Variables

### Development
```env
VITE_API_URL=http://localhost:3000
```

### Production
```env
VITE_API_URL=https://api.yourdomain.com
```

## Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder.

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Troubleshooting

### "Cannot connect to API"
- Check backend is running on correct port
- Verify VITE_API_URL in .env.local
- Check CORS settings on backend

### "Login fails with 401"
- Verify credentials are correct
- Check backend API is receiving requests
- Ensure backend is validating passwords correctly

### "Token not persisting"
- Check browser localStorage is enabled
- Look for `auth-storage` and `authToken` keys
- Clear localStorage and try again

### "Routes not working"
- Ensure you're using http://localhost:5173 (not 5174)
- Check no other app is on port 5173
- Hard refresh browser (Ctrl+Shift+R)

## Common Tasks

### Login as Different User
1. Click Logout on dashboard
2. Go to login page
3. Enter different credentials

### Re-register After Rejection
1. Go to /register
2. Use same or different email
3. Fill form again with corrections

### Check User Status (for polling)
Use the `useCheckStatus()` hook:
```typescript
const { user, fetchUserStatus } = useAuthStore();

const handleCheckStatus = async () => {
  const status = await fetchUserStatus();
  console.log('New status:', status);
};
```

## API Endpoints Used

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user

### User
- `GET /api/user/profile` - Get full profile
- `GET /api/user/status` - Get identity status

### Admin (Optional)
- `GET /api/admin/identities/pending` - List pending users
- `GET /api/admin/identities` - List all users
- `PATCH /api/admin/identities/{id}/approve` - Approve identity
- `PATCH /api/admin/identities/{id}/reject` - Reject identity

## Next: Backend Setup

This frontend expects a backend API with:

1. User registration endpoint
2. JWT authentication
3. Identity approval/rejection workflow
4. User profile endpoints
5. Admin management endpoints

See the OpenAPI spec for full details.

## Support

For issues or questions:
1. Check IMPLEMENTATION_GUIDE.md for detailed docs
2. Check FRONTEND_README.md for feature overview
3. Review code comments in source files
4. Check browser console for errors

## Tips

- Use browser DevTools to inspect network requests
- Check localStorage for stored auth data
- Use React DevTools to inspect state
- Check terminal output for server logs

Happy coding! 🚀
