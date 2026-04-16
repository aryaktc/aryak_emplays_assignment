# AI Prompt Library — PromptVault

A full-stack web application to manage AI Image Generation Prompts. Built with **Angular 18**, **Django**, **PostgreSQL**, and **Redis**.

![Prompt List](./screenshots/prompt-list.png)

---

## 🛠 Tech Stack

| Layer       | Technology               |
|-------------|--------------------------|
| Frontend    | Angular 18 (Standalone)  |
| Backend     | Django 6.x (plain views) |
| Database    | PostgreSQL 14            |
| Cache       | Redis 7                  |
| DevOps      | Docker + Docker Compose  |
| Styling     | Custom CSS (Glassmorphism, Dark Theme) |

---

## ✨ Features

### Core
- **Prompt List View** — Browse all prompts with title, complexity badges (color-coded), tags, and creation date
- **Prompt Detail View** — View full prompt content with live Redis-backed view counter
- **Add Prompt Form** — Reactive form with real-time validation (title min 3, content min 20, complexity 1-10)
- **Tag Filtering** — Filter prompts by tags (Bonus B)

### Bonus A: Authentication
- Session-based authentication using Django's built-in auth system
- Login/Logout functionality
- Default credentials: `admin` / `admin123`

### Bonus B: Tagging System
- Many-to-Many Tag model
- Filter API (`?tag=anime`)
- Tag chips in list and detail views
- Tag input on create form

---

## 📋 API Endpoints

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| GET    | `/api/prompts/`      | List all prompts                   |
| GET    | `/api/prompts/?tag=` | List prompts filtered by tag       |
| POST   | `/api/prompts/`      | Create a new prompt                |
| GET    | `/api/prompts/:id/`  | Retrieve prompt + increment views  |
| GET    | `/api/tags/`         | List all tags                      |
| POST   | `/api/auth/login/`   | Login (session-based)              |
| POST   | `/api/auth/logout/`  | Logout                             |
| GET    | `/api/auth/session/` | Check authentication status        |

---

## 🏗 Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Angular    │────▶│    Django     │────▶│  PostgreSQL  │
│  (Port 4200) │     │  (Port 8000) │     │  (Port 5432) │
│   Frontend   │     │   Backend    │     │   Database   │
└─────────────┘     └──────┬───────┘     └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Redis     │
                    │  (Port 6379) │
                    │ View Counter │
                    └──────────────┘
```

### Key Design Decisions

1. **Plain Django Views (No DRF)**: As specified in requirements, API endpoints use `JsonResponse` with function-based views instead of Django REST Framework.

2. **Redis as Source of Truth for View Counts**: View counts are stored only in Redis using `INCR` for atomic increments. This avoids database writes on every page view, improving performance.

3. **Angular Standalone Components**: Uses Angular 18's modern standalone component architecture instead of NgModules for cleaner code.

4. **Glassmorphism UI**: Premium dark-themed UI with frosted glass cards, gradient accents, and smooth animations.

5. **SQLite Fallback**: Backend auto-detects PostgreSQL configuration and falls back to SQLite for easy local development without Docker.

---

## 🚀 Getting Started

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd emplays_assignment

# Create .env file (optional — defaults work out of box)
cp .env.example .env

# Build and start all services
docker-compose up --build
```

Open **http://localhost:4200** in your browser.

### Option 2: Local Development

#### Prerequisites
- Python 3.10+
- Node.js 18+
- Redis (optional — view counter degrades gracefully)

#### Backend
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver 8000
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start dev server with proxy
npx ng serve --proxy-config proxy.conf.json
```

Open **http://localhost:4200** in your browser.

---

## 📁 Project Structure

```
emplays_assignment/
├── backend/
│   ├── config/
│   │   ├── settings.py          # Django settings (DB, Redis, CORS)
│   │   ├── urls.py              # Root URL routing
│   │   └── wsgi.py              # WSGI config
│   ├── prompts/
│   │   ├── models.py            # Prompt + Tag models
│   │   ├── views.py             # API views (list, create, detail, auth)
│   │   ├── urls.py              # Prompt URL routes
│   │   ├── auth_urls.py         # Auth URL routes
│   │   ├── validators.py        # Input validation
│   │   ├── redis_client.py      # Redis view counter client
│   │   ├── admin.py             # Django admin config
│   │   └── migrations/
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── entrypoint.sh
│
├── frontend/
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── prompt-list/     # Prompt grid with tag filtering
│   │   │   ├── prompt-detail/   # Detail view with view counter
│   │   │   ├── add-prompt/      # Reactive form with validation
│   │   │   ├── navbar/          # Navigation with auth state
│   │   │   └── login/           # Login form
│   │   ├── services/
│   │   │   ├── prompt.service.ts
│   │   │   └── auth.service.ts
│   │   ├── models/
│   │   │   └── prompt.model.ts
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── proxy.conf.json          # Dev proxy → Django
│   ├── nginx.conf               # Production Nginx config
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env
├── .gitignore
└── README.md
```

---

## 🧪 Testing

### Backend Endpoints (curl)

```bash
# List all prompts
curl http://localhost:8000/api/prompts/

# Get single prompt (increments view count)
curl http://localhost:8000/api/prompts/1/

# Create a prompt
curl -X POST http://localhost:8000/api/prompts/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Prompt", "content": "This is a test prompt with enough content length.", "complexity": 5}'

# Filter by tag
curl http://localhost:8000/api/prompts/?tag=anime

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

---

## 📝 Assumptions & Trade-offs

1. **CSRF Exemption**: POST endpoints use `@csrf_exempt` for API simplicity. In production, CSRF tokens should be properly handled.
2. **Redis Graceful Fallback**: If Redis is unavailable, view counts return 0 instead of crashing.
3. **No DRF**: As per requirements, all API logic uses plain Django views with `JsonResponse`.
4. **Session Auth over JWT**: Simpler implementation with Django's built-in session framework.
5. **Seed Data**: 6 sample prompts with tags are created during initial setup for demo purposes.

---

## 🎯 Bonus Features Completed

- [x] **Bonus A**: Session-based Authentication (Login/Logout + session check)
- [x] **Bonus B**: Tagging System (M2M model, filter API, UI tag chips)
- [ ] **Bonus C**: Live Hosting (ready for deployment)
