# Classroom Management System

A modern classroom management application built with the PERN stack (PostgreSQL, Express, React, and Node.js), with TypeScript for a more reliable and scalable codebase.

## Overview

This project is designed to help educators and administrators manage classroom operations more efficiently. It provides a simple interface for tracking students, managing assignments, monitoring progress, and organizing learning activities in one place.

## Features

- Student management
- Course and classroom tracking
- Assignment and grade management
- Secure authentication and role-based access
- Responsive dashboard for desktop and mobile
- Clean, scalable TypeScript-based architecture

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL
- Styling: CSS
- Tooling: TypeScript, ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kingpin9292/Classroom-a-pern-project.git
   cd Classroom-a-pern-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure your environment variables:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=classroom_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key
   ```

4. Run database migrations/setup (if applicable):
   ```bash
   npm run migrate
   ```

5. Start the application:
   ```bash
   npm run dev
   ```

## Project Structure

```bash
classroom-app/
├── client/          # Frontend React application
├── server/          # Express API
├── shared/          # Shared TypeScript utilities/types
├── .env.example     # Example environment configuration
├── package.json
├── README.md
└── ...
```

## Usage

Once the app is running, open the frontend in your browser and sign in to begin managing classrooms, students, and academic records.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with your proposed changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
