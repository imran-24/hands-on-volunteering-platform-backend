# HandsOn - Backend

## 📌 Project Overview
HandsOn is a social volunteering platform designed to connect individuals with impactful social initiatives. The backend is built with **Node.js (Express.js)** and uses **MongoDB with Prisma ORM** for data management. Authentication is handled using **JWT**.

## 🚀 Features
- User authentication (Register, Login, Logout, JWT-based auth)
- Event management (Create, update, join, and leave events)
- Help requests (Create and manage community help requests)
- Teams (Create and join volunteer teams)
- Prisma ORM for MongoDB

## 🛠️ Tech Stack
- **Framework:** Node.js (Express.js)
- **Database:** MongoDB (via Prisma ORM)
- **Authentication:** JWT
- **API Documentation:** RESTful endpoints

## ⚙️ Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Node.js (Latest LTS version)
- MongoDB (Cloud or local instance)
- Prisma CLI

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/imran-24/hands-on-volunteering-platform-backend
   cd hands-on-volunteering-platform-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```sh
     DATABASE_URL=mongodb+srv://imransyam:12341234@cluster0.k2g5n.mongodb.net/event-management

    ACCESS_TOKEN_SECRET=
    REFRESH_TOKEN_SECRET=
    NODE_ENV="development"
    BASE_URL="http://localhost:5174"

     ```

### Database Setup
Run the following commands to initialize Prisma:
```sh
npx prisma generate
npx prisma db push
```

### Running the Project
To start the development server:
```sh
npm run dev
```
The backend will run on `http://localhost:8070/`

## 📁 API Endpoints
### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get authenticated user
- `GET /auth/logout` - Logout user

### Users
- `GET /users` - Fetch all users
- `POST /users` - Create a new user
- `PATCH /users/:id` - Update a user

### Events
- `GET /events` - Fetch all events
- `GET /events/mine` - Fetch user-created events
- `POST /events` - Create an event
- `POST /events/join` - Join an event
- `POST /events/leave` - Leave an event
- `PATCH /events/:id` - Update an event

### Help Requests
- `GET /help-requests` - Fetch all help requests
- `POST /help-requests` - Create a help request
- `PATCH /help-requests/:id` - Update a help request
- `DELETE /help-requests/:id` - Delete a help request

### Teams
- `GET /teams` - Fetch all teams
- `POST /teams` - Create a team
- `POST /teams/join` - Join a team
- `POST /teams/leave` - Leave a team
- `PATCH /teams/:id` - Update a team
- `DELETE /teams/:id` - Delete a team

## 🔥 Deployment
For production, deploy using Render or a similar service:
```sh
npm start
```
Ensure the `.env` file is correctly configured on the server.

---
### 🎉 Happy Coding!

