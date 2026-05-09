# MERN Task Manager

A full-stack Task Manager application built with the MERN stack (MongoDB, Express, React, Node.js). Users can register, log in, and manage their personal tasks with a modern, responsive UI.

<img width="1200" height="840" alt="Vite-React-TS-07-19-2025_05_44_AM" src="https://github.com/user-attachments/assets/c48af11b-edec-4e4e-bea5-75ea821509de" />


## Features

- User registration and authentication (JWT + HTTP-only cookies)
- Secure login/logout
- Create, read, update, and delete tasks
- User-specific task lists
- Responsive, clean React frontend
- Protected routes for authenticated users

## Tech Stack

- **Frontend:** React, TypeScript, Vite, React Router, React Toastify
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Styling:** CSS Modules

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB database (local or Atlas)

### Environment Variables

Create a `.env` file in the `backend/` directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

### Installation

#### 1. Clone the repository

```sh
git clone https://github.com/yourusername/mern-task-manager.git
cd mern-task-manager
```

#### 2. Install backend dependencies

```sh
cd backend
npm install
```

#### 3. Install frontend dependencies

```sh
cd ../frontend
npm install
```

### Running the Application

#### 1. Start the backend server

```sh
cd backend
npm run dev
```

#### 2. Start the frontend development server

```sh
cd ../frontend
npm run dev
```

- The frontend will be available at [http://localhost:5173](http://localhost:5173)
- The backend API runs at [http://localhost:5000](http://localhost:5004)

### API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile (protected)
- `GET /api/tasks` - Get all tasks for logged-in user (protected)
- `POST /api/tasks` - Create a new task (protected)
- `PUT /api/tasks/:id` - Update a task (protected)
- `DELETE /api/tasks/:id` - Delete a task (protected)

### Folder Structure

```
mern-task-manager/
  backend/
    controllers/
    middleware/
    models/
    routes/
    config/
    .env
    index.js
    package.json
  frontend/
    src/
      components/
      context/
      css/
      pages/
      App.tsx
      main.tsx
    package.json
    vite.config.ts
```
