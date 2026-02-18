# 🎬 MovieWatch Backend API

A complete RESTful API for managing movies and personal watchlists built with Node.js, Express, and MongoDB.

![Node.js](https://img.shields.io/badge/Node.js-v22.16.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Express](https://img.shields.io/badge/Express-v5.1.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Workflows](#workflows)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

MovieWatch is a backend API that allows users to manage movies and maintain personal watchlists. Users can create, read, update, and delete movies, while also tracking their watch status, ratings, and personal notes for each movie.

**Key Capabilities:**
- Secure user authentication with JWT tokens
- Complete movie management (CRUD operations)
- Personal watchlist with status tracking
- Movie rating system (1-10 scale)
- User-based ownership and permissions

---

## ✨ Features

### 🔐 Authentication System
- **User Registration**: Secure signup with email validation
- **User Login**: JWT token-based authentication
- **User Logout**: Token invalidation
- **Password Security**: Bcrypt hashing with salt rounds
- **Protected Routes**: Middleware-based authorization

### 🎬 Movie Management
- **Create Movies**: Add new movies with detailed information
- **View All Movies**: Public access to movie catalog
- **Update Movies**: Edit your own movie entries
- **Delete Movies**: Remove movies you created
- **Movie Details**: Title, overview, release year, genres, runtime, poster URL
- **Creator Tracking**: Each movie linked to its creator

### 📺 Watchlist System
- **Add to Watchlist**: Save movies to personal list
- **Status Tracking**: Track watch progress (Planned, Watching, Completed, Dropped)
- **Rating System**: Rate movies from 1-10
- **Personal Notes**: Add custom notes for each movie
- **Update Status**: Change watch status and ratings anytime
- **Remove from List**: Delete movies from watchlist
- **Duplicate Prevention**: Can't add same movie twice

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v22.16.0
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose v8.x

### Security
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Cookie Parsing**: cookie-parser

### Development
- **Hot Reload**: Nodemon
- **Environment**: dotenv
- **Module System**: ES Modules (import/export)

---

## 🏗️ System Architecture
```
┌─────────────────┐
│   Client        │
│ (Thunder Client)│
└────────┬────────┘
         │
         │ HTTP Requests
         │
         ▼
┌─────────────────────────────────────────┐
│         Express Server                  │
│  ┌───────────────────────────────────┐ │
│  │   Middleware Layer                │ │
│  │  • express.json()                 │ │
│  │  • cookieParser()                 │ │
│  │  • authMiddleware (JWT verify)    │ │
│  │  • validators (input validation)  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Routes Layer                    │ │
│  │  • /auth   → authRoutes           │ │
│  │  • /movies → movieRoutes          │ │
│  │  • /watchlist → watchlistRoutes   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Controllers Layer               │ │
│  │  • authController                 │ │
│  │  • movieController                │ │
│  │  • watchlistController            │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Models Layer (Mongoose)         │ │
│  │  • User                           │ │
│  │  • Movie                          │ │
│  │  • WatchlistItem                  │ │
│  └───────────────────────────────────┘ │
└────────────┬────────────────────────────┘
             │
             │ Mongoose ODM
             │
             ▼
    ┌─────────────────┐
    │  MongoDB Atlas  │
    │   (Database)    │
    └─────────────────┘
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,           // Auto-generated
  name: String,            // Required
  email: String,           // Required, Unique
  password: String,        // Required, Hashed
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

**Indexes:**
- `email`: Unique index for fast lookups

**Example:**
```json
{
  "_id": "699457c1a9850513d9114a8f",
  "name": "Laiba",
  "email": "laiba@test.com",
  "password": "$2a$10$xyz...",
  "createdAt": "2026-02-17T10:00:00Z",
  "updatedAt": "2026-02-17T10:00:00Z"
}
```

---

### Movie Model
```javascript
{
  _id: ObjectId,           // Auto-generated
  title: String,           // Required
  overview: String,        // Optional
  releaseYear: Number,     // Optional
  genres: [String],        // Optional, Array
  runtime: Number,         // Optional (minutes)
  posterUrl: String,       // Optional
  createdBy: ObjectId,     // Required, References User
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

**Relationships:**
- `createdBy` → References `User._id`

**Example:**
```json
{
  "_id": "67953a1b2f4e8c9d1a2b3c4d",
  "title": "Inception",
  "overview": "A thief who steals corporate secrets...",
  "releaseYear": 2010,
  "genres": ["Action", "Sci-Fi", "Thriller"],
  "runtime": 148,
  "posterUrl": "https://image.tmdb.org/t/p/w500/inception.jpg",
  "createdBy": "699457c1a9850513d9114a8f",
  "createdAt": "2026-02-17T11:00:00Z",
  "updatedAt": "2026-02-17T11:00:00Z"
}
```

---

### WatchlistItem Model
```javascript
{
  _id: ObjectId,           // Auto-generated
  userId: ObjectId,        // Required, References User
  movieId: ObjectId,       // Required, References Movie
  status: String,          // Enum: ["PLANNED", "WATCHING", "COMPLETED", "DROPPED"]
  rating: Number,          // Optional, Min: 1, Max: 10
  notes: String,           // Optional
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

**Relationships:**
- `userId` → References `User._id`
- `movieId` → References `Movie._id`

**Business Rules:**
- Each user can add a movie to watchlist only once
- Status defaults to "PLANNED" if not specified
- Rating must be between 1-10 if provided

**Example:**
```json
{
  "_id": "67953def456abc789xyz",
  "userId": "699457c1a9850513d9114a8f",
  "movieId": "67953a1b2f4e8c9d1a2b3c4d",
  "status": "COMPLETED",
  "rating": 9,
  "notes": "Mind-blowing movie!",
  "createdAt": "2026-02-17T12:00:00Z",
  "updatedAt": "2026-02-17T14:00:00Z"
}
```

---

## 🔌 API Endpoints

### Authentication Routes

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "699457c1a9850513d9114a8f",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation:**
- Name: Required, non-empty string
- Email: Required, valid email format
- Password: Required, minimum 6 characters

**Errors:**
- `400`: User already exists
- `400`: Validation errors

---

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "699457c1a9850513d9114a8f",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `401`: Invalid email or password

---

#### Logout User
```http
POST /auth/logout
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

### Movie Routes

#### Get All Movies (Public)
```http
GET /movies
```

**No authentication required**

**Response (200):**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "movies": [
      {
        "_id": "67953a1b2f4e8c9d1a2b3c4d",
        "title": "Inception",
        "overview": "A thief who steals...",
        "releaseYear": 2010,
        "genres": ["Action", "Sci-Fi"],
        "runtime": 148,
        "posterUrl": "https://...",
        "createdBy": {
          "_id": "699457c1a9850513d9114a8f",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "createdAt": "2026-02-17T11:00:00Z",
        "updatedAt": "2026-02-17T11:00:00Z"
      }
    ]
  }
}
```

---

#### Create Movie (Protected)
```http
POST /movies
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "The Matrix",
  "overview": "A computer hacker learns...",
  "releaseYear": 1999,
  "genres": ["Action", "Sci-Fi"],
  "runtime": 136,
  "posterUrl": "https://image.tmdb.org/t/p/w500/matrix.jpg"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "movie": {
      "_id": "67953xyz...",
      "title": "The Matrix",
      "overview": "A computer hacker learns...",
      "releaseYear": 1999,
      "genres": ["Action", "Sci-Fi"],
      "runtime": 136,
      "posterUrl": "https://...",
      "createdBy": "699457c1a9850513d9114a8f",
      "createdAt": "2026-02-17T11:30:00Z",
      "updatedAt": "2026-02-17T11:30:00Z"
    }
  }
}
```

**Validation:**
- Title: Required, non-empty
- Release Year: 1888 - (current year + 10)
- Genres: Array of strings
- Runtime: Positive number
- Poster URL: Valid URL format

**Errors:**
- `401`: Not authorized (no token)
- `400`: Validation errors

---

#### Update Movie (Protected)
```http
PUT /movies/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "runtime": 150,
  "overview": "Updated description"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "movie": {
      "_id": "67953xyz...",
      "title": "The Matrix",
      "runtime": 150,
      "overview": "Updated description",
      ...
    }
  }
}
```

**Authorization:**
- Only the user who created the movie can update it

**Errors:**
- `401`: Not authorized
- `403`: You can only update your own movies
- `404`: Movie not found

---

#### Delete Movie (Protected)
```http
DELETE /movies/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Movie deleted successfully"
}
```

**Errors:**
- `401`: Not authorized
- `403`: You can only delete your own movies
- `404`: Movie not found

---

### Watchlist Routes

**All watchlist routes require authentication**

#### Add to Watchlist
```http
POST /watchlist
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "movieId": "67953a1b2f4e8c9d1a2b3c4d",
  "status": "WATCHING",
  "rating": 9,
  "notes": "Great movie!"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "watchlistItem": {
      "_id": "67953def...",
      "userId": {
        "_id": "699457c1a9850513d9114a8f",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "movieId": {
        "_id": "67953a1b2f4e8c9d1a2b3c4d",
        "title": "Inception",
        "releaseYear": 2010,
        "genres": ["Action", "Sci-Fi"]
      },
      "status": "WATCHING",
      "rating": 9,
      "notes": "Great movie!",
      "createdAt": "2026-02-17T12:00:00Z",
      "updatedAt": "2026-02-17T12:00:00Z"
    }
  }
}
```

**Validation:**
- MovieId: Required, valid ObjectId
- Status: One of ["PLANNED", "WATCHING", "COMPLETED", "DROPPED"]
- Rating: Number between 1-10 (optional)
- Notes: String (optional)

**Errors:**
- `400`: Movie already in your watchlist
- `400`: Validation errors
- `401`: Not authorized

---

#### Update Watchlist Item
```http
PUT /watchlist/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "COMPLETED",
  "rating": 10,
  "notes": "Masterpiece!"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "watchlistItem": {
      "_id": "67953def...",
      "status": "COMPLETED",
      "rating": 10,
      "notes": "Masterpiece!",
      ...
    }
  }
}
```

**Errors:**
- `401`: Not authorized
- `403`: You can only update your own watchlist
- `404`: Watchlist item not found

---

#### Remove from Watchlist
```http
DELETE /watchlist/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Removed from watchlist successfully"
}
```

**Errors:**
- `401`: Not authorized
- `403`: You can only delete your own watchlist items
- `404`: Watchlist item not found

---

## 🔄 Workflows

### 1. User Registration Flow
```
┌─────────────┐
│   Client    │
│  (Register) │
└──────┬──────┘
       │
       │ POST /auth/register
       │ { name, email, password }
       │
       ▼
┌──────────────────────────────┐
│  validateRegister Middleware │
│  • Check name exists         │
│  • Validate email format     │
│  • Check password length     │
└──────┬───────────────────────┘
       │ ✅ Valid
       │
       ▼
┌──────────────────────────────┐
│   authController.register    │
│  1. Check if email exists    │
│  2. Hash password (bcrypt)   │
│  3. Save user to MongoDB     │
│  4. Generate JWT token       │
│  5. Set cookie               │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   MongoDB Atlas              │
│  users collection            │
│  • Store user document       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Response to Client         │
│  • User info (no password)   │
│  • JWT token                 │
└──────────────────────────────┘
```

---

### 2. User Login Flow
```
┌─────────────┐
│   Client    │
│   (Login)   │
└──────┬──────┘
       │
       │ POST /auth/login
       │ { email, password }
       │
       ▼
┌──────────────────────────────┐
│  validateLogin Middleware    │
│  • Check email exists        │
│  • Check password exists     │
└──────┬───────────────────────┘
       │ ✅ Valid
       │
       ▼
┌──────────────────────────────┐
│   authController.login       │
│  1. Find user by email       │
│     ❌ Not found → 401       │
│  2. Compare passwords        │
│     (bcrypt.compare)         │
│     ❌ Wrong → 401           │
│  3. Generate JWT token       │
│  4. Set cookie               │
└──────┬───────────────────────┘
       │ ✅ Success
       │
       ▼
┌──────────────────────────────┐
│   Response to Client         │
│  • User info                 │
│  • JWT token                 │
└──────────────────────────────┘
```

---

### 3. Create Movie Flow (Protected)
```
┌─────────────┐
│   Client    │
│ (Logged in) │
└──────┬──────┘
       │
       │ POST /movies
       │ Authorization: Bearer <token>
       │ { title, overview, releaseYear... }
       │
       ▼
┌──────────────────────────────┐
│   authMiddleware             │
│  1. Extract token from       │
│     Authorization header     │
│  2. Verify token (jwt.verify)│
│     ❌ Invalid → 401         │
│  3. Find user in MongoDB     │
│     ❌ Not found → 401       │
│  4. Attach user to req.user  │
└──────┬───────────────────────┘
       │ ✅ Authenticated
       │
       ▼
┌──────────────────────────────┐
│  validateCreateMovie         │
│  • Check title required      │
│  • Validate releaseYear      │
│  • Validate genres array     │
│  • Validate runtime          │
│  • Validate posterUrl        │
└──────┬───────────────────────┘
       │ ✅ Valid
       │
       ▼
┌──────────────────────────────┐
│   movieController.create     │
│  1. Extract movie data       │
│  2. Add createdBy: req.user._id │
│  3. Save to MongoDB          │
│  4. Return created movie     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   MongoDB Atlas              │
│  movies collection           │
│  • Store movie document      │
│  • Link to user via ObjectId │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Response (201 Created)     │
│  • Full movie object         │
└──────────────────────────────┘
```

---

### 4. Get All Movies Flow (Public)
```
┌─────────────┐
│   Client    │
│  (Anyone)   │
└──────┬──────┘
       │
       │ GET /movies
       │ (No authentication)
       │
       ▼
┌──────────────────────────────┐
│  movieController.getAll      │
│  1. Movie.find()             │
│  2. .populate("createdBy")   │
│     • Fetch user details     │
│     • Include name, email    │
│     • Exclude password       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   MongoDB Atlas              │
│  • Query all movies          │
│  • Join with users           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Response (200 OK)          │
│  • results: count            │
│  • movies: [{...}]           │
│    (with creator info)       │
└──────────────────────────────┘
```

---

### 5. Update Movie Flow (Protected with Ownership)
```
┌─────────────┐
│   Client    │
│ (Logged in) │
└──────┬──────┘
       │
       │ PUT /movies/:id
       │ Authorization: Bearer <token>
       │ { runtime: 150 }
       │
       ▼
┌──────────────────────────────┐
│   authMiddleware             │
│  • Verify token              │
│  • Attach req.user           │
└──────┬───────────────────────┘
       │ ✅ Authenticated
       │
       ▼
┌──────────────────────────────┐
│  validateUpdateMovie         │
│  • Validate changed fields   │
└──────┬───────────────────────┘
       │ ✅ Valid
       │
       ▼
┌──────────────────────────────┐
│   movieController.update     │
│  1. Find movie by ID         │
│     ❌ Not found → 404       │
│  2. Check ownership:         │
│     movie.createdBy ==       │
│     req.user._id             │
│     ❌ Not owner → 403       │
│  3. Update movie             │
│  4. Return updated movie     │
└──────┬───────────────────────┘
       │ ✅ Updated
       │
       ▼
┌──────────────────────────────┐
│   MongoDB Atlas              │
│  • Update movie document     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Response (200 OK)          │
│  • Updated movie object      │
└──────────────────────────────┘
```

---

### 6. Add to Watchlist Flow
```
┌─────────────┐
│   Client    │
│ (Logged in) │
└──────┬──────┘
       │
       │ POST /watchlist
       │ Authorization: Bearer <token>
       │ { movieId, status, rating, notes }
       │
       ▼
┌──────────────────────────────┐
│   authMiddleware             │
│  (via router.use)            │
│  • Verify token              │
│  • Attach req.user           │
└──────┬───────────────────────┘
       │ ✅ Authenticated
       │
       ▼
┌──────────────────────────────┐
│  validateAddToWatchlist      │
│  • Check movieId required    │
│  • Validate status enum      │
│  • Validate rating 1-10      │
└──────┬───────────────────────┘
       │ ✅ Valid
       │
       ▼
┌──────────────────────────────┐
│ watchlistController.add      │
│  1. Check duplicate:         │
│     WatchlistItem.findOne({  │
│       userId: req.user._id,  │
│       movieId: movieId       │
│     })                        │
│     ❌ Exists → 400          │
│  2. Create watchlist item    │
│     • userId: req.user._id   │
│     • movieId: from body     │
│     • status: default PLANNED│
│  3. Populate movie & user    │
│  4. Return full item         │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   MongoDB Atlas              │
│  watchlistItems collection   │
│  • Store item                │
│  • Reference user & movie    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Response (201 Created)     │
│  • Full watchlist item       │
│    (with populated details)  │
└──────────────────────────────┘
```

---

### 7. Update Watchlist Status Flow
```
┌─────────────┐
│   Client    │
│ (User)      │
└──────┬──────┘
       │
       │ PUT /watchlist/:id
       │ { status: "COMPLETED", rating: 10 }
       │
       ▼
┌──────────────────────────────┐
│   authMiddleware             │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  validateUpdateWatchlist     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ watchlistController.update   │
│  1. Find item by ID          │
│     ❌ Not found → 404       │
│  2. Check ownership:         │
│     item.userId ==           │
│     req.user._id             │
│     ❌ Not owner → 403       │
│  3. Update fields            │
│  4. Populate & return        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Response (200 OK)          │
│  • Updated watchlist item    │
└──────────────────────────────┘
```

---

## 🚀 Installation

### Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account (free tier)
- Git installed

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/moviewatch-backend.git
cd moviewatch-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
# In project root
touch .env
```

Add the following variables:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/moviewatch
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
PORT=5001
NODE_ENV=development
```

4. **Generate JWT Secret**
```bash
# Run this command to generate a secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and paste it as your `JWT_SECRET` in `.env`

5. **Start the development server**
```bash
npm run dev
```

You should see:
```
Server is running on port 5001
MongoDB Atlas Connected Successfully
```

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/moviewatch` |
| `JWT_SECRET` | Secret key for JWT signing | Generated 64-byte hex string |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` (7 days) |
| `PORT` | Server port number | `5001` |
| `NODE_ENV` | Environment mode | `development` or `production` |

**Security Notes:**
- Never commit `.env` to version control
- Use different secrets for development and production
- Rotate JWT secrets periodically in production
- Use strong, random secrets (minimum 32 bytes)

---

## 📚 Usage Examples

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

**Create Movie:**
```bash
curl -X POST http://localhost:5001/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Inception",
    "overview": "A thief who steals...",
    "releaseYear": 2010,
    "genres": ["Action", "Sci-Fi"],
    "runtime": 148
  }'
```

**Get All Movies:**
```bash
curl http://localhost:5001/movies
```

**Add to Watchlist:**
```bash
curl -X POST http://localhost:5001/watchlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "movieId": "MOVIE_ID_HERE",
    "status": "WATCHING",
    "rating": 9
  }'
```

---

### Using JavaScript (Fetch API)
```javascript
// Register
const register = async () => {
  const response = await fetch('http://localhost:5001/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepass123'
    })
  });
  const data = await response.json();
  localStorage.setItem('token', data.data.token);
  return data;
};

// Create Movie
const createMovie = async (token) => {
  const response = await fetch('http://localhost:5001/movies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Inception',
      overview: 'A thief who steals...',
      releaseYear: 2010,
      genres: ['Action', 'Sci-Fi'],
      runtime: 148
    })
  });
  return await response.json();
};

// Get All Movies
const getMovies = async () => {
  const response = await fetch('http://localhost:5001/movies');
  return await response.json();
};

// Add to Watchlist
const addToWatchlist = async (token, movieId) => {
  const response = await fetch('http://localhost:5001/watchlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      movieId: movieId,
      status: 'WATCHING',
      rating: 9,
      notes: 'Great movie!'
    })
  });
  return await response.json();
};
```

---

## 📁 Project Structure
```
moviewatch-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic (register, login, logout)
│   │   ├── movieController.js    # Movie CRUD operations
│   │   └── watchlistController.js # Watchlist operations
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Movie.js              # Movie schema
│   │   └── WatchlistItem.js      # Watchlist schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── movieRoutes.js        # Movie endpoints
│   │   └── watchlistRoutes.js    # Watchlist endpoints
│   ├── utils/
│   │   └── generateToken.js      # JWT token generation
│   ├── validators/
│   │   ├── authValidators.js     # Auth input validation
│   │   ├── movieValidators.js    # Movie input validation
│   │   └── watchlistValidators.js # Watchlist validation
│   └── server.js                 # Express app entry point
├── .env                          # Environment variables (not in git)
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies & scripts
├── package-lock.json             # Dependency lock file
└── README.md                     # Project documentation
```

---

## 🔒 Security Features

### 1. Password Security
- **Bcrypt Hashing**: All passwords hashed with 10 salt rounds
- **Never Stored Plain**: Original passwords never stored
- **Salt Generation**: Unique salt for each password

### 2. JWT Authentication
- **Stateless**: No session storage required
- **Expiration**: Tokens expire after 7 days
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Secure Flag**: HTTPS-only in production

### 3. Authorization
- **Ownership Checks**: Users can only modify their own resources
- **Protected Routes**: Sensitive operations require valid token
- **Role Separation**: Clear distinction between public and private routes

### 4. Input Validation
- **Pre-Controller**: All inputs validated before reaching controllers
- **Type Checking**: Data types enforced
- **Sanitization**: Trimming whitespace, format validation
- **Business Rules**: Custom validation (e.g., rating 1-10)

### 5. Database Security
- **MongoDB Atlas**: Cloud-hosted with built-in security
- **Connection Encryption**: TLS/SSL enabled
- **Unique Constraints**: Prevents duplicate emails
- **ObjectId**: Unpredictable IDs prevent enumeration attacks

### 6. Error Handling
- **No Stack Traces in Production**: Sensitive info hidden
- **Consistent Error Format**: Predictable error responses
- **Status Codes**: Proper HTTP status codes used

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "error": "Error message here"
}
```

### HTTP Status Codes Used

| Code | Meaning | Use Case |
|------|---------|----------|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST (resource created) |
| `400` | Bad Request | Invalid input data |
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Valid token but no permission |
| `404` | Not Found | Resource doesn't exist |
| `500` | Internal Server Error | Server-side error |

### Common Error Scenarios

**Authentication Errors:**
```json
{
  "error": "Not authorized, no token provided"
}
```

**Validation Errors:**
```json
{
  "error": "Password must be at least 6 characters"
}
```

**Ownership Errors:**
```json
{
  "error": "You can only update your own movies"
}
```

**Duplicate Errors:**
```json
{
  "error": "Movie already in your watchlist"
}
```

---

## 🔮 Future Enhancements

### Planned Features

1. **Get User's Watchlist**
   - `GET /watchlist` - Retrieve all watchlist items for logged-in user
   - Filter by status
   - Sort by rating, date added

2. **Search & Filter**
   - Search movies by title
   - Filter by genre
   - Filter by release year range
   - Sort by various fields

3. **Pagination**
   - Limit results per page
   - Page navigation
   - Total count metadata

4. **User Profile**
   - Get user details
   - Update user information
   - Change password
   - Delete account

5. **Movie Reviews**
   - Full text reviews
   - Review likes/dislikes
   - Review replies

6. **Social Features**
   - Follow other users
   - Share watchlists
   - Activity feed

7. **External API Integration**
   - TMDB API for real movie data
   - Auto-populate movie details
   - Fetch posters automatically

8. **File Uploads**
   - Upload custom posters
   - Cloudinary integration
   - Image compression

9. **Advanced Security**
   - Rate limiting
   - Email verification
   - Password reset via email
   - Two-factor authentication

10. **Admin Features**
    - Admin dashboard
    - User management
    - Content moderation

---



---

*Last updated: February 18, 2026*
