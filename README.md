# 🤖 FastRoboX 1.0 — National Robotics Competition Platform

<p align="center">
  <img src="frontend/public/images/hero_robotics_bg.png" alt="FastRoboX 1.0 Banner" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>Official Management Platform for the National Robotics &amp; Technology Competition</strong><br />
  Hosted by <em>Bangladesh University of Business and Technology (BUBT)</em>
</p>

<p align="center">
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react" alt="React Vite" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Backend-PHP%208.x%20REST%20API-777BB4?style=for-the-badge&logo=php" alt="PHP REST API" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql" alt="MySQL" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Styling-Tailwind%20%2B%20Matrix%20CSS-38BDF8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-000000?style=for-the-badge&logo=jsonwebtokens" alt="JWT Auth" /></a>
</p>

---

## 📖 Table of Contents

- [About FastRoboX 1.0](#-about-fastrobox-10)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [🚀 Run the Project — Step-by-Step](#-run-the-project--step-by-step)
  - [Step 1 — Prerequisites](#step-1--prerequisites)
  - [Step 2 — Clone the Repository](#step-2--clone-the-repository)
  - [Step 3 — Start XAMPP (Apache + MySQL)](#step-3--start-xampp-apache--mysql)
  - [Step 4 — Deploy the Backend to htdocs](#step-4--deploy-the-backend-to-htdocs)
  - [Step 5 — Import the Database](#step-5--import-the-database)
  - [Step 6 — Install & Run the Frontend](#step-6--install--run-the-frontend)
  - [Step 7 — Open the App](#step-7--open-the-app)
- [Admin Access Credentials](#-admin-access-credentials)
- [API Reference & Routes](#-api-reference--routes)
- [Design System & Theme](#-design-system--theme)
- [Troubleshooting](#-troubleshooting)
- [License & Credits](#-license--credits)

---

## 🌟 About FastRoboX 1.0

**FastRoboX 1.0** is a full-stack, enterprise-grade event management platform designed for the National Robotics and Technology Competition hosted by **Bangladesh University of Business and Technology (BUBT)**.

Built with a futuristic **Matrix-Green & Dark Carbon Cyberpunk Aesthetic**, the platform provides a seamless experience for participants to register, explore competition details, track application statuses, and stay updated with official notices. Administrators get powerful tools to manage team registrations, verify payments, publish announcements, and configure competition parameters.

---

## ✨ Key Features

### Public User Portal

- 🌌 **Interactive Cyber Hero Section** — Custom particle neural canvas background, live countdown timer, and event highlights.
- 📋 **Official Notice Board** — Categorized notices with built-in search, category filters, and PDF attachments.
- ⚽ **Competition Segments** — Tabbed interactive views for *Robo Soccer*, *Line Follower Contest*, and *Project Showcase*.
- 📅 **Vertical Event Timeline** — Live schedule showing past, active, and upcoming milestones with pulse indicators.
- ❓ **FAQ Accordion** — Smooth animated FAQ section with contact support modal.
- 📝 **Multi-Step Registration Wizard** — 6-step flow covering segment selection, team details, payment upload, and review.
- 🔍 **Registration Status Checker** — Real-time status lookup using Registration ID and Leader Email.

### Admin Management Panel

- 🔐 **Secure JWT Authentication** — Bcrypt-hashed admin authentication with automatic session handling.
- 📊 **Real-time Dashboard** — Overview cards with total registrations, pending approvals, revenue metrics, and quick-action shortcuts.
- 📝 **Notice Management** — Full CRUD for publishing notices with PDF attachment support.
- 🤖 **Segment Management** — Configure team sizes, entry fees, prize pools, rulebooks, and images.
- 📑 **Registration Verification** — Inspect rosters, verify payment screenshots, approve/reject with feedback, export CSV.
- 🏆 **Sponsors & Timeline** — Manage sponsors by category tier and reorder timeline milestones.
- 🖼️ **Media Gallery & Messages** — Upload images/videos with lightbox preview, manage contact inquiries.

---

## 🛠 Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React.js 19, Vite 8 |
| **Routing & Motion** | React Router DOM v7, Framer Motion |
| **Styling & Icons** | Vanilla CSS Tokens, Tailwind CSS v4, Lucide React Icons |
| **Backend API** | PHP 8.x (RESTful Architecture, Custom Router) |
| **Authentication** | JSON Web Tokens (JWT HS256), Bcrypt Hashing |
| **Database** | MySQL (PDO Singleton Engine) |
| **Server Environment** | XAMPP / Apache (`.htaccess` URL rewriting & CORS) |

---

## 📁 Project Architecture

```
FastRoboX_IEEE/
├── frontend/                   # React + Vite Frontend Application
│   ├── public/                 # Static Assets & Generated Images
│   └── src/
│       ├── components/         # Reusable UI Primitives, Navbar, Footer
│       │   ├── Navbar/         # Responsive Sticky Glass Navbar
│       │   ├── Footer/         # Footer with Quick Links & Social Icons
│       │   └── UI/             # Canvas Animations, Modals, Badges, Loaders
│       ├── context/            # React Context (Theme, Auth, Toast)
│       ├── pages/              # Public & Admin Views
│       │   ├── Home.jsx        # Landing Page (Hero, Segments, Sponsors)
│       │   ├── Notice.jsx      # Searchable Notice Board
│       │   ├── Register.jsx    # 6-Step Multi-Step Registration Form
│       │   ├── Status.jsx      # Registration Status Checker
│       │   └── Admin/          # Admin Dashboard & CRUD Pages
│       └── services/
│           └── api.js          # Centralized Axios Interceptor Service
│
├── backend/                    # PHP RESTful Backend API
│   ├── index.php               # Main API Router & Entry Point
│   ├── config/
│   │   ├── database.php        # DB credentials & JWT secret
│   │   └── cors.php            # CORS headers configuration
│   ├── middleware/             # JWT Authentication Middleware
│   ├── helpers/                # Upload Handlers & Response Formatters
│   ├── api/                    # Public & Admin Endpoint Controllers
│   └── uploads/                # Media Storage (Notices, Payments, Rulebooks)
│
└── database/
    ├── schema.sql              # MySQL Database Schema & Seed Data
    └── reset_admin.php         # Admin password reset utility
```

---

## 🚀 Run the Project — Step-by-Step

### Step 1 — Prerequisites

Make sure the following tools are installed before you begin:

| Tool | Minimum Version | Download |
| :--- | :--- | :--- |
| **XAMPP** | 8.0+ (Apache + MySQL + PHP) | [apachefriends.org](https://www.apachefriends.org/) |
| **Node.js** | v18.0+ | [nodejs.org](https://nodejs.org/) |
| **npm** | v9.0+ (bundled with Node.js) | — |
| **Git** | Any recent version | [git-scm.com](https://git-scm.com/) |

> **Verify your installations** by running these in a terminal:
> ```bash
> php --version       # Should show PHP 8.x
> node --version      # Should show v18.x or higher
> npm --version       # Should show 9.x or higher
> ```

---

### Step 2 — Clone the Repository

```bash
git clone https://github.com/NurShuv0/FastRoboX_IEEE.git
cd FastRoboX_IEEE
```

Or, if you already have the project folder, navigate to it:

```powershell
cd "d:\MY_CODE\ieee\natinal robotic project"
```

---

### Step 3 — Start XAMPP (Apache + MySQL)

1. Open the **XAMPP Control Panel** (run as Administrator on Windows).
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.
4. Confirm both show a **green** running status.

> ⚠️ If port **80** is blocked (e.g., by IIS or Skype), change Apache's port to **8080** in XAMPP's `httpd.conf`, or stop the conflicting service.

---

### Step 4 — Deploy the Backend to htdocs

The PHP backend must be served by Apache. Copy it into XAMPP's `htdocs` directory.

**Option A — PowerShell (Recommended, run as Administrator):**

```powershell
# Replace <project-path> with your actual path
Copy-Item -Recurse -Force "<project-path>\backend" "C:\xampp\htdocs\fastrobox\backend"
```

**Option B — Create a symbolic junction (no file duplication):**

```powershell
# Run PowerShell as Administrator
New-Item -ItemType Junction -Path "C:\xampp\htdocs\fastrobox" -Target "<project-path>"
```

**Verify the backend is running:**

Open your browser and visit:
```
http://localhost/fastrobox/backend/api/notices
```
You should see a JSON response (empty array is fine at this stage).

> 💡 **The `vite.config.js` Vite proxy is already configured** to forward all `/api` and `/uploads` requests from the frontend dev server (`localhost:5173`) to `http://localhost/fastrobox/backend`. No manual CORS changes needed.

---

### Step 5 — Import the Database

1. Open **phpMyAdmin**: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. Click **New** in the left sidebar → name the database **`fastrobox_db`** → click **Create**.
3. Select the newly created **`fastrobox_db`** database.
4. Click the **Import** tab at the top.
5. Click **Choose File** → navigate to your project and select **`database/schema.sql`**.
6. Scroll down and click **Go**.

You should see a success message: *"Import has been successfully finished."*

> The schema creates all required tables and inserts default seed data including segments, timeline events, and the default admin account.

**Default database credentials** (already configured in `backend/config/database.php`):

| Setting | Value |
| :--- | :--- |
| Host | `localhost` |
| Database | `fastrobox_db` |
| Username | `root` |
| Password | *(empty)* |

> If your MySQL uses a different username or password, edit `backend/config/database.php`:
> ```php
> define('DB_USER', 'your_username');
> define('DB_PASS', 'your_password');
> ```

---

### Step 6 — Install & Run the Frontend

Open a **new terminal window** and run:

```bash
# Navigate into the frontend directory
cd frontend

# Install all npm dependencies (only needed on first run or after pulling changes)
npm install

# Start the Vite development server
npm run dev
```

Expected output:
```
  VITE v8.x.x  ready in ~500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

> The `npm install` step only needs to be run once (or whenever `package.json` changes). For subsequent runs, just use `npm run dev`.

---

### Step 7 — Open the App

| URL | Description |
| :--- | :--- |
| **`http://localhost:5173`** | 🌐 Public-facing website |
| **`http://localhost:5173/admin/login`** | 🔐 Admin login page |
| **`http://localhost/fastrobox/backend/api/notices`** | 🔌 Backend API health check |
| **`http://localhost/phpmyadmin`** | 🗄️ Database management |

---

## 🔑 Admin Access Credentials

Use the following credentials to access the Admin Management Panel:

| Attribute | Detail |
| :--- | :--- |
| **Login Portal URL** | [http://localhost:5173/admin/login](http://localhost:5173/admin/login) |
| **Admin Email** | `admin@fastrobox.bubt.edu.bd` |
| **Password** | `Admin@123` |

> **Forgot or changed your password?** Run the reset utility:
> ```bash
> php database/reset_admin.php
> ```

---

## 🛣 API Reference & Routes

### Public Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/notices` | Fetch published notices (supports `?search=` and `?category=`) |
| `GET` | `/api/notices/:id` | Fetch single notice details |
| `GET` | `/api/segments` | List active competition segments |
| `GET` | `/api/timeline` | Get event schedule milestones |
| `POST` | `/api/registrations` | Submit new team registration with payment screenshot |
| `GET` | `/api/registrations/status` | Check registration state by ID and Email |
| `POST` | `/api/contact` | Submit user message |

### Admin Endpoints (JWT Protected)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate admin & generate JWT token |
| `GET` | `/api/dashboard/stats` | Fetch real-time dashboard analytics |
| `GET/POST/DELETE` | `/api/admin/notices` | Admin CRUD for notices |
| `GET/POST/DELETE` | `/api/admin/segments` | Admin CRUD for competition segments |
| `GET/PUT` | `/api/admin/registrations` | View registrations and update status (`approved`/`rejected`) |
| `GET/POST/DELETE` | `/api/admin/sponsors` | Admin CRUD for sponsors |

---

## 🎨 Design System & Theme

- **Primary Color**: `#22c55e` (Matrix Cyber Green)
- **Secondary Accent**: `#a3e635` (Neon Lime)
- **Background**: `#050f08` (Dark Carbon Fiber)
- **Glassmorphism**: Backdrop blur `12px` with `rgba(34, 197, 94, 0.08)` borders.
- **Theme Persistence**: Dark / Light mode preference saved in `localStorage`.

---

## 🔧 Troubleshooting

| Problem | Solution |
| :--- | :--- |
| `http://localhost/fastrobox/backend/api/notices` returns 404 | Ensure `mod_rewrite` is enabled in XAMPP's Apache config and the backend folder is correctly placed in `htdocs`. |
| Frontend shows network errors / API calls fail | Confirm Apache is running and the backend path `C:\xampp\htdocs\fastrobox\backend` exists. |
| Database connection failed (500 error) | Check `DB_USER` / `DB_PASS` in `backend/config/database.php` and ensure MySQL is running. |
| `npm install` fails | Ensure Node.js v18+ is installed. Delete `node_modules` and `package-lock.json`, then retry. |
| Port 80 already in use | Stop IIS (`net stop W3SVC` in admin PowerShell) or change XAMPP's Apache port to 8080 and update `vite.config.js` proxy target accordingly. |
| Admin login fails | Re-import `database/schema.sql` or run `php database/reset_admin.php` to reset credentials. |
| Images/uploads not displaying | Make sure the `backend/uploads/` directory exists and is writable by Apache (check XAMPP folder permissions). |

---

## 🤝 License & Credits

Developed for the **National Robotics & Technology Competition (FastRoboX 1.0)** hosted by **Bangladesh University of Business and Technology (BUBT)**.

Designed & Built with ❤️ by the IEEE BUBT Robotics Team.