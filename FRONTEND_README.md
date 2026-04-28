# Digital Identity Frontend Implementation

This is a React + TypeScript frontend implementation for the Digital Identity API OpenAPI 3.1.0 specification.

## Features

- **User Registration** - Register with personal data and ID photo upload
- **User Authentication** - Secure login with JWT tokens
- **Identity Status Management** - Track PENDING, CONFIRMED, and REJECTED statuses
- **Protected Routes** - Route guards for authenticated and confirmed users
- **State Management** - Zustand-based auth store with localStorage persistence
- **Form Validation** - Zod schemas with React Hook Form integration
- **Error Handling** - Comprehensive error handling and user feedback with Sonner toasts

## Project Structure

```
src/
├── components/
│   └── AuthLayout.tsx          # Protected route wrapper and auth guards
├── lib/
│   └── api.ts                  # API client with all endpoints
├── page/
│   ├── Register.tsx            # User registration page
│   ├── Login.tsx               # User login page
│   ├── Dashboard.tsx           # User dashboard/profile
│   └── PendingApproval.tsx     # Status checking for pending users
├── store/
│   └── authstore.ts            # Zustand auth store with persistence
├── types/
│   └── index.ts                # TypeScript types for OpenAPI spec
├── App.tsx                     # Main app with routing
└── main.tsx                    # App entry point
```

## Setup

### 1. Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

Or copy `.env.example` and modify as needed.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### Registration Flow

1. User visits `/register`
2. Fills in personal information and uploads ID photo
3. Form validates against:
   - Personal data requirements (names, DOB, place)
   - Email format
   - Password strength (min 8 chars, 1 uppercase, 1 number)
   - Photo format (JPEG, PNG, WebP) and size (max 5MB)
4. On success, user is redirected to `/pending-approval`
5. User sees status and can check for approval

### Login Flow

1. User visits `/login`
2. Enters email and password
3. Different responses based on status:
   - **CONFIRMED**: Returns JWT, redirects to `/dashboard`
   - **PENDING**: Shows message to wait for admin approval
   - **REJECTED**: Shows rejection reason

### Dashboard

Protected route (`/dashboard`) showing:
- User profile information
- Identity status
- Rejection reason (if applicable)
- Profile refresh option

## Key Components

### API Client (`src/lib/api.ts`)

Singleton instance handling:
- All endpoint calls
- Token management (localStorage)
- Request/response transformation
- Error handling

```typescript
import { apiClient } from './lib/api';

// Register
await apiClient.register(registerData);

// Login
const response = await apiClient.login({ email, password });

// Get current user
const { user } = await apiClient.getMe();

// Get user status (for polling)
const { status, rejectionReason } = await apiClient.getUserStatus();
```

### Auth Store (`src/store/authstore.ts`)

Zustand store with:
- User and token state
- Persistence to localStorage
- Auth actions (register, login, logout)
- Status checking methods

```typescript
import { useAuthStore } from './store/authstore';

const { user, token, isAuthenticated, login, logout } = useAuthStore();
```

### Protected Routes (`src/components/AuthLayout.tsx`)

```typescript
// In routing:
<Route element={<AuthLayout requireConfirmed={true} />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>

// Or use the hook:
const canAccess = useAuthGuard(requireConfirmed = true);
```

## Authentication Flow

1. **Token Storage**: JWT stored in localStorage as `authToken`
2. **Auto-hydration**: On app load, `checkAuthStatus()` verifies stored token
3. **Request Intercepting**: All API requests include `Authorization: Bearer {token}` header
4. **Logout**: Clears token and user state

## Validation

Using Zod schemas for type-safe validation:

```typescript
// Register form
const registerSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/),
  idPhoto: z.instanceof(File).refine(file => file.size <= 5 * 1024 * 1024),
  // ... more fields
});

// Login form
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
```

## Status Polling

For users in PENDING state, check status periodically:

```typescript
const { fetchUserStatus } = useAuthStore();

// Check status
const status = await fetchUserStatus();

if (status === 'CONFIRMED') {
  // Redirect to login
}
```

## Error Handling

Errors are caught and displayed via Sonner toasts:

```typescript
import { toast } from 'sonner';

try {
  await login(credentials);
} catch (error) {
  toast.error('Login failed');
  // Handle error...
}
```

## Styling

Uses Tailwind CSS with predefined gradient and color scheme:

- Primary: Purple to Pink gradient
- Components: Rounded corners, shadows, smooth transitions
- Responsive: Mobile-first design

## Types

All TypeScript types are generated from the OpenAPI spec in `src/types/index.ts`:

```typescript
export interface UserPublic {
  id: string;
  fullName: string;
  email: string;
  status: IdentityStatus;
  role: Role;
  // ... more fields
}

export enum IdentityStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
}
```

## API Endpoints Implemented

### Public
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Protected (Requires JWT)
- `GET /api/auth/me` - Get current user
- `GET /api/user/profile` - Get user profile
- `GET /api/user/status` - Get identity status

### Admin (Requires Admin Role + JWT)
- `GET /api/admin/identities/pending` - List pending users
- `GET /api/admin/identities` - List all users with filter
- `GET /api/admin/identities/{id}` - Get user detail
- `PATCH /api/admin/identities/{id}/approve` - Approve identity
- `PATCH /api/admin/identities/{id}/reject` - Reject identity

## Building for Production

```bash
npm run build
```

Creates optimized build in `dist/` directory.

## Configuration

### CORS

Ensure backend API allows requests from your frontend domain.

### Base URL

Change `VITE_API_URL` environment variable to match your backend:

```env
VITE_API_URL=https://api.yourdomain.com
```

## Troubleshooting

### Authentication not persisting
- Check browser localStorage for `auth-storage` and `authToken` keys
- Verify `checkAuthStatus()` is called on app load

### CORS errors
- Backend must include `Access-Control-Allow-Origin` header
- Check backend CORS configuration

### File upload failing
- Verify file size < 5MB
- Check supported formats: JPEG, PNG, WebP
- Review backend file upload configuration

## Next Steps

1. Set up backend API at `http://localhost:3000`
2. Create `.env.local` with `VITE_API_URL`
3. Run `npm run dev`
4. Test registration at `/register`
5. Check admin endpoints for user management

## License

MIT
