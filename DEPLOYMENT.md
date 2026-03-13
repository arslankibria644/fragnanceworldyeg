# Luxe Scents - Deployment Guide

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Auth**: NextAuth.js (JWT)
- **Storage**: Cloudinary
- **Payments**: Stripe + Cash on Delivery
- **State**: Zustand
- **Real-time**: Socket.io
- **AI**: Anthropic Claude (product descriptions)

---

## 1. Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)
- Stripe account
- Anthropic API key (optional, for AI descriptions)

---

## 2. MongoDB Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Click **Connect** → **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database password
6. Add `/luxe-scents` at the end (database name)

```
mongodb+srv://username:password@cluster.mongodb.net/luxe-scents?retryWrites=true&w=majority
```

---

## 3. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com) and sign up
2. From the Dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

---

## 4. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your **Publishable Key** and **Secret Key** from API Keys section
3. For webhooks (local testing): install Stripe CLI and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

---

## 5. Environment Variables

Create a `.env` file from `.env.example` and fill in all values:

```bash
cp .env.example .env
```

Required variables:
```env
DATABASE_URL=           # MongoDB connection string
NEXTAUTH_URL=           # Your app URL (http://localhost:3000 for dev)
NEXTAUTH_SECRET=        # Random secret (run: openssl rand -base64 32)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ANTHROPIC_API_KEY=      # Optional, for AI descriptions
SMTP_HOST=              # Optional, for email notifications
SMTP_USER=
SMTP_PASS=
```

---

## 6. Installation & Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed with sample data (admin user + sample products)
npm run db:seed
```

**Admin credentials after seeding:**
- Email: `admin@luxescents.com`
- Password: `admin123456`

---

## 7. Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 8. Deploying to Vercel

### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option B: GitHub Integration
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import the repository
3. Add all environment variables in Vercel dashboard
4. Deploy

### Important Vercel Settings:
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next`

---

## 9. Deploying to Netlify

> Note: Vercel is recommended for Next.js apps. For Netlify:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

Add a `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## 10. Post-Deployment Checklist

- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Update Stripe webhook URL in Stripe Dashboard
- [ ] Add your domain to Cloudinary's allowed origins
- [ ] Change admin password after first login
- [ ] Add real product images via admin panel
- [ ] Configure SMTP for order confirmation emails
- [ ] Test checkout with Stripe test cards
- [ ] Test Cash on Delivery order flow

---

## 11. Stripe Test Cards

| Card | Number | CVC | Expiry |
|------|--------|-----|--------|
| Success | 4242 4242 4242 4242 | Any | Any future |
| Declined | 4000 0000 0000 0002 | Any | Any future |

---

## 12. Admin Panel Features

Access at `/admin`:

| Feature | Path |
|---------|------|
| Dashboard | /admin |
| Orders | /admin/orders |
| Products | /admin/products |
| Categories | /admin/categories |
| Brands | /admin/brands |
| Customers | /admin/customers |
| Coupons | /admin/coupons |
| Reviews | /admin/reviews |
| Banners | /admin/banners |
| Theme | /admin/theme |

---

## 13. Default Coupon Code

After seeding:
- Code: `WELCOME10`
- Discount: 10% off
- Min order: PKR 5,000
