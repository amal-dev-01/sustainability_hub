# 🧩 Project Management System

A full-stack **Project Management Platform** built with **Django REST Framework** and **React (Vite + Redux Toolkit)**. Manage projects, contributors, and tasks with JWT authentication, Celery task scheduling, and Redis caching for optimal performance.

---

## 🚀 Features

- 🔐 **JWT Authentication** - Secure login, logout, and token refresh
- 📁 **Full CRUD Operations** - Manage Projects, Contributors, and Tasks
- ⏰ **Smart Task Management** - Automatic overdue and due task detection with Celery
- 📊 **Dashboard Analytics** - Comprehensive summary API for project insights
- ⚡ **High Performance** - Redis caching for frequently accessed endpoints
- 🌐 **Modern Frontend** - Built with React 19, Vite, Redux Toolkit, and Bootstrap

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Django 5.2, Django REST Framework, Celery, Redis, SQLite |
| **Frontend** | React 19, Vite, Redux Toolkit, React Router |
| **Cache** | Redis (`django-redis`) |
| **Task Queue** | Celery |

---

## ⚙️ Setup and Installation

### 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- Redis Server
- Git

### 🪄 1. Clone the Repository

```bash
git clone https://github.com/amal-dev-01/sustainability_hub
cd sustainability_hub
```

### 🔧 2. Backend Setup (Django)

#### Create and Activate Virtual Environment

```bash
cd backend
python -m venv venv

# On Unix/macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Run Database Migrations

```bash
python manage.py migrate
```

#### Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

#### Start Development Server

```bash
python manage.py runserver
```

✅ Backend available at: **http://127.0.0.1:8000/api/**

✅ Admin: **http://127.0.0.1:8000/admin/**


### ⚡ 3. Celery & Redis Setup

#### Start Redis Server

```bash
redis-server
```

#### Start Celery Worker

```bash
celery -A backend  worker --loglevel=info --pool=solo
```

#### Start Celery Beat (for scheduled tasks)

```bash
celery -A backend beat --loglevel=info
```

### 💻 4. Frontend Setup (React + Vite)

#### Navigate to Frontend Directory

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install
```

#### Start Development Server

```bash
npm run dev
```

✅ Frontend available at: **http://127.0.0.1:5173**

### 🐳 5. Run with Docker (Optional)

Start all services (Django, React, Redis, Celery) with Docker Compose:

```bash
docker-compose build
docker-compose up
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | User login |
| POST | `/api/auth/logout/` | User logout |
| POST | `/api/auth/token/refresh/` | Refresh JWT token |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET, POST | `/api/project/projects/` | List or create projects |
| GET, PUT, DELETE | `/api/project/projects/<int:pk>/` | Retrieve, update, or delete a project |

### Contributors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET, POST | `/api/project/contributors/` | List or create contributors |
| GET, PUT, DELETE | `/api/project/contributors/<int:pk>/` | Retrieve, update, or delete a contributor |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET, POST | `/api/project/tasks/` | List or create tasks |
| GET, PUT, DELETE | `/api/project/tasks/<int:pk>/` | Retrieve, update, or delete a task |
| GET | `/api/project/projects/<int:project_id>/tasks/` | List tasks under a specific project |
| GET | `/api/project/tasks/due/` | List due tasks |
| GET | `/api/project/tasks/overdue/` | List overdue tasks (cached) |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/project/dashboard/` | Get summary of projects, tasks, and contributors |

---

## 🗄️ Database Models

### ProjectStatus (Enum)

Defines project status options:

| Value | Label | Description |
|-------|-------|-------------|
| `ACTIVE` | Active | Project is ongoing |
| `COMPLETED` | Completed | Project is finished |
| `ON_HOLD` | On Hold | Project is temporarily paused |

### Project

Represents a project entity with the following fields:

- `name` - Unique project name
- `description` - Project description
- `location` - Project location
- `status` - Current status (ACTIVE, COMPLETED, ON_HOLD)
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update

### Contributor

Represents a project contributor linked to a User:

- `user` - One-to-one relationship with Django User
- `skills` - JSON field for flexible skill storage
- `joined_on` - Date when contributor joined
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update

### Task

Represents an individual task:

- `project` - Foreign key to Project
- `title` - Task title
- `description` - Task description
- `due_date` - Task deadline
- `is_completed` - Completion status
- `is_overdue` - Overdue status (auto-updated)
- `assigned_to` - Many-to-many relationship with Contributors
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update

### Relationships

- **User → Contributor**: One-to-One
- **Project → Task**: One-to-Many
- **Task → Contributor**: Many-to-Many

---

## ⚡ Performance Optimization

### Redis Caching

Configured via `django-redis`:

```python
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient"
        }
    }
}
CACHE_TTL = 60 * 5  # 5 minutes
```

### Cached Endpoints

- Overdue tasks list is cached for 60 minutes

### Database Optimization

- Indexed fields for frequent queries (status, due_date, is_completed)
- Query optimization using `select_related` and `prefetch_related`

---

## 🧠 Design Decisions

- **Indexed Fields**: Frequently filtered fields are indexed for faster query performance
- **Query Optimization**: Use of `select_related` and `prefetch_related` to minimize database hits
- **Redis Integration**:  Application cache
- **Flexible Data Storage**: JSON-based skill storage for Contributors allows dynamic attributes
- **Modular Architecture**: APIView architecture with search, filter, and ordering mixins

---

📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ✨ Author

**Amal Dev MP**

- 📧 Email: devmpamal@gmail.com
- 🌐 GitHub: [@amal-dev-01](https://github.com/amal-dev-01)
---
