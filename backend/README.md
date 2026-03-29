# 9jaTouch - Salon Booking Backend

Production-ready Node.js + Express + PostgreSQL backend for the 9jaTouch salon booking application.

## Features

- 🔐 JWT Authentication with refresh tokens
- 👥 Role-based access control (admin/apprentice/client)
- 📅 Appointment management system
- 📊 Dashboard analytics
- 🛒 Product catalog
- 💬 Reviews and ratings
- 📱 Mobile app friendly CORS
- 🚀 Render deployment ready

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Update .env with your database credentials
```

3. Start the server:
```bash
npm start
```

## API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Dashboard (Admin)
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/revenue` - Get revenue analytics

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/today` - Today's appointments
- `GET /api/appointments/upcoming` - Upcoming appointments
- `PATCH /api/appointments/:id/status` - Update appointment status

### Users
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update user profile

## Deployment

This backend is fully configured for Render deployment. See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed instructions.

## Environment Variables

See [.env.example](./.env.example) for all available configuration options.

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
