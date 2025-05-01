# 🍽️ Restaurant Menu & Order Management System

A full-stack web app for managing restaurant menus, tracking orders, and generating reports.  
Built as part of a freelance developer portfolio project.

---

## 🚀 Features

- ✅ Product Management (Add / Edit / Disable)
- ✅ Order Creation, Editing, and Closing
- ✅ Business Day Tracking (Open/Close sessions)
- ✅ Detailed Reports:
  - Current day sales summary
  - Historical date range analysis
  - Full sales breakdown with sorting
- ✅ Recharts-based dashboards
- ✅ Supabase integration (Database + Auth)

---

## 🧱 Tech Stack

### Frontend
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Recharts](https://recharts.org/) for data visualization

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Supabase](https://supabase.com/) (PostgreSQL + Auth)

---

## 📁 Folder Structure

```
restaurant-menu-app/
├── backend/     # Express API + Supabase integration
├── frontend/    # React app (admin dashboard)
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/restaurant-menu-app.git
cd restaurant-menu-app
```

### 2. Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

### `/backend/.env`
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
PORT=5000
```

### `/frontend/.env`
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

✅ You can find these values in your Supabase project dashboard.

🛡 **Never commit your `.env` files to GitHub**  
Instead, include `.env.example` in each folder.

---

## 🛠 Run Locally

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

Then visit: [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

### Recommended Stack
| Layer        | Tool        |
|--------------|-------------|
| Frontend     | [Netlify](https://netlify.com) |
| Backend      | [Render](https://render.com) or [Railway](https://railway.app) |
| Database/API | [Supabase](https://supabase.com) |

---

## 📄 License

MIT – Free to use, modify, and share.

---

## 🙋‍♂️ Author

Developed by [Narciso Daniel Santiago](https://portfolio.com) as part of a freelance showcase.
