# Golden Bites - Next.js Frontend

A modern food delivery app built with Next.js and Supabase.

## Features

- **User Authentication**: Complete sign-up/sign-in flow with Supabase Auth
- **User Session Management**: Global user context with automatic session sync
- **Real-time Cart**: Persistent cart with Supabase backend
- **Favorites System**: Save and manage favorite products
- **Product Browsing**: Search and filter products by category
- **Responsive Design**: Mobile-first design with desktop optimization

## Setup Instructions

### 1. Database Setup

First, run the SQL script in your Supabase SQL editor to create the required tables:

```sql
-- Run this in Supabase SQL Editor
-- Cart and Favorites Tables for Golden Bites App

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, product_id)
);

-- Indexes for cart table
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_product_id ON cart(product_id);

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, product_id)
);

-- Indexes for favorites table
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);

-- Add image_url column to product table if it doesn't exist
ALTER TABLE product ADD COLUMN IF NOT EXISTS image_url VARCHAR(2048);
ALTER TABLE product ADD COLUMN IF NOT EXISTS ingredients TEXT;
ALTER TABLE product ADD COLUMN IF NOT EXISTS details TEXT;
```

### 2. Environment Variables

Create a `.env.local` file in the `nextjs` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
cd nextjs
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

## User Session Management

The app now includes a global user context that automatically:

- Syncs user authentication state across all pages
- Fetches user profile data from the database
- Provides loading states during authentication
- Handles sign-out functionality

### Usage in Components

```tsx
import { useUser } from '../lib/userContext';

const MyComponent = () => {
  const { user, profile, loading, signOut } = useUser();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <div>Please sign in</div>;
  
  return (
    <div>
      Welcome, {profile?.first_name || user.email}!
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};
```

## Cart Functionality

The cart system now:

- Persists data in Supabase database
- Syncs across browser sessions
- Handles quantity updates
- Prevents duplicate items
- Shows real-time totals

### Cart Operations

- **Add to Cart**: Automatically checks for existing items and updates quantity
- **Update Quantity**: Real-time updates with loading states
- **Remove Items**: Permanent removal from database
- **Checkout**: Placeholder for future implementation

## Favorites System

The favorites system provides:

- Persistent storage in Supabase
- Add/remove functionality
- Integration with cart (add to cart from favorites)
- Visual feedback during operations

### Favorites Operations

- **Add to Favorites**: One-click addition from product cards
- **Remove from Favorites**: Permanent removal with confirmation
- **Add to Cart**: Quick add to cart from favorites page

## Database Schema

### Cart Table
- `id`: Primary key
- `user_id`: References user table
- `product_id`: References product table
- `quantity`: Item quantity (minimum 1)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp
- Unique constraint on (user_id, product_id)

### Favorites Table
- `id`: Primary key
- `user_id`: References user table
- `product_id`: References product table
- `created_at`: Creation timestamp
- Unique constraint on (user_id, product_id)

## API Endpoints

The app uses Supabase client for all database operations:

- **Cart**: `supabase.from('cart')`
- **Favorites**: `supabase.from('favorites')`
- **Products**: `supabase.from('product')`
- **Users**: `supabase.from('user')`

## Styling

The app uses:
- **Gold Theme**: `#E2B24A` for highlights and primary actions
- **Responsive Design**: Mobile-first with desktop optimization
- **Font Awesome Icons**: For consistent iconography
- **Inline Styles**: For component-specific styling

## File Structure

```
nextjs/
├── lib/
│   ├── supabaseClient.ts    # Supabase client configuration
│   └── userContext.tsx      # User session management
├── pages/
│   ├── _app.tsx            # App wrapper with UserProvider
│   ├── index.tsx           # Home page with products
│   ├── cart.tsx            # Cart page
│   ├── favorites.tsx       # Favorites page
│   ├── sign-in.tsx         # Sign in page
│   └── sign-up.tsx         # Sign up page
├── public/
│   └── img/                # Static images
└── styles/
    └── globals.css         # Global styles
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure Supabase URL and key are correct
2. **Missing Tables**: Run the SQL script in Supabase SQL editor
3. **Authentication**: Check if user table exists and has correct structure
4. **CORS Issues**: Verify Supabase project settings

### Development Tips

- Use browser dev tools to check network requests
- Monitor Supabase logs for database errors
- Test user flows with different authentication states
- Verify data persistence across browser sessions
