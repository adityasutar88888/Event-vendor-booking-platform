# EventEase — Event Vendor Booking Platform

EventEase is a full-stack web application that connects customers with event service vendors. Customers can browse listings, view vendor details, and submit booking requests. Vendors can manage a business profile and accept or reject those requests.

This project is built as a B.Tech college mini-project. It does not process online payments.

## Features

- Customer and vendor registration with hashed passwords and JWT login
- Protected dashboards based on user role
- Vendor directory with search, category, location, and price sorting
- Vendor detail pages with booking request forms
- Customer booking list with cancel for pending requests
- Vendor booking inbox with accept and reject actions
- Vendor profile editing
- Sample vendor seed data

## Technology stack

- Frontend: React (Vite), React Router, Axios, Lucide React, CSS3
- Backend: Node.js, Express, JWT, bcryptjs, CORS, dotenv
- Database: MongoDB Atlas with Mongoose

## Folder structure

```text
backend/
  config/db.js
  controllers/
  middleware/authMiddleware.js
  models/
  routes/
  scripts/seed.js
  server.js
frontend/
  src/components/
  src/pages/
  src/context/
  src/services/api.js
  src/styles/
```

## Installation

### Prerequisites

- Node.js 18 or later
- npm
- A MongoDB Atlas cluster (or a local MongoDB instance)

### 1. Clone or open the project

```bash
cd Event_vendor_booking_platform_cursor
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## MongoDB Atlas setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and password.
3. In **Network Access**, allow your IP address (or `0.0.0.0/0` for a short demo).
4. Click **Connect** → **Drivers** and copy the connection string.
5. Replace `<password>` and the database name. Example:

```text
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/eventease?retryWrites=true&w=majority
```

6. Paste that string into `backend/.env` as `MONGODB_URI`.

If MongoDB is missing or invalid, the API prints a clear error and does not start.

## Run the application

Terminal 1 — API:

```bash
cd backend
npm run dev
```

Terminal 2 — sample vendors (once):

```bash
cd backend
npm run seed
```

Terminal 3 — UI:

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Demo instructions

1. Seed vendors, then open **Explore Vendors**. Sample vendor login emails use the `.test` domain and password `vendor123`.
2. Register a **customer** account from the Register page.
3. Open a vendor, click **Book Now**, and submit an event request.
4. Log out, then log in as that vendor (or a seeded vendor) and accept or reject the request from the vendor dashboard.
5. Log back in as the customer to see the updated status. Pending bookings can be cancelled by the customer.

Seeded vendor accounts (password: `vendor123`):

- aarav@lumenframes.test
- priya@spiceandpetal.test
- rohan@gildedbloom.test
- ananya@theivorycourt.test
- vikram@nightharvest.test
- meera@ateliernoir.test
- kabir@goldenhour.test
- sana@marigoldtable.test

## API endpoints

### Authentication

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | JWT |

### Vendors

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/vendors` | Public |
| GET | `/api/vendors/:id` | Public |
| POST | `/api/vendors` | Vendor JWT |
| GET | `/api/vendors/profile` | Vendor JWT |
| PUT | `/api/vendors/profile` | Vendor JWT |

Query parameters for `GET /api/vendors`: `search`, `category`, `location`, `sort` (`price-asc` or `price-desc`).

### Bookings

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/bookings` | Customer JWT |
| GET | `/api/bookings/my` | Customer JWT |
| GET | `/api/bookings/vendor` | Vendor JWT |
| PATCH | `/api/bookings/:id/status` | Vendor JWT (own bookings) |
| PATCH | `/api/bookings/:id/cancel` | Customer JWT (own pending bookings) |

Send the JWT as `Authorization: Bearer <token>`.

## Notes

- Passwords are hashed with bcryptjs and are never stored in plain text.
- JWT secrets and database credentials belong only in `.env` files.
- Booking dates must be today or later. Customers cannot book their own vendor account.
