# Task Management System

A modern task management system built with React and Laravel, featuring real-time updates, drag-and-drop task ordering, and task list sharing capabilities.

## Features

- 📝 Create, update, and delete task lists
- ✅ Add, edit, and mark tasks as complete
- 🔄 Drag and drop tasks to reorder them
- 👥 Share task lists with other users
- 📊 View task completion statistics
- 🔐 Secure authentication and authorization
- 🎨 Modern and responsive UI with Material-UI

## Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI for UI components
- React Query for state management
- React Hook Form with Zod for form validation
- React Beautiful DnD for drag and drop
- Axios for API communication

### Backend
- Laravel 11
- PostgreSQL database
- Laravel Sanctum for authentication
- Gate/Policy based authorization
- RESTful API architecture

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- PHP 8.2+ (for local development)
- PostgreSQL 15+ (for local development)

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/task_management.git
cd task_management
```

2. Copy environment files:
```bash
cp backend/.env.docker backend/.env
```

3. Start the Docker containers:
```bash
docker-compose up -d
```

4. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - PostgreSQL: localhost:5432

### Manual Setup

#### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Copy environment file and configure it:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Run migrations:
```bash
php artisan migrate
```

#### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get authenticated user

### Task Lists
- `GET /api/task-lists` - Get all task lists
- `POST /api/task-lists` - Create a new task list
- `GET /api/task-lists/{taskList}` - Get a specific task list
- `PUT /api/task-lists/{taskList}` - Update a task list
- `DELETE /api/task-lists/{taskList}` - Delete a task list
- `GET /api/task-lists/shared/with-me` - Get lists shared with user
- `GET /api/task-lists/stats/all` - Get task list statistics

### Tasks
- `GET /api/task-lists/{taskList}/tasks` - Get all tasks in a list
- `POST /api/task-lists/{taskList}/tasks` - Create a new task
- `PUT /api/tasks/{task}` - Update a task
- `DELETE /api/tasks/{task}` - Delete a task
- `PUT /api/tasks/{task}/toggle-complete` - Toggle task completion
- `POST /api/task-lists/{taskList}/reorder` - Reorder tasks

### Sharing
- `POST /api/task-lists/{taskList}/share` - Share a task list
- `PUT /api/task-lists/{taskList}/share/{userId}` - Update share permissions
- `DELETE /api/task-lists/{taskList}/share/{userId}` - Remove share

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE] for details.
