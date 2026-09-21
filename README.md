# VEXA IT - Modern Full-Stack Platform

Modern web platform and business software solutions suite for VEXA IT, built with React, Vite, Tailwind CSS, Express.js, and MongoDB Atlas.

---

## 📁 Repository Structure

```
VEXA IT/
├── backend/          # Express.js REST API with MongoDB Atlas & Mongoose
├── frontend/         # React 19 + TypeScript + Vite + Tailwind CSS frontend
└── package.json      # Root orchestration scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Configure Environment
Copy `.env.example` in `backend/`:
```bash
cp backend/.env.example backend/.env
```
- Ensure `MONGO_URI` is configured.
- To receive inquiry emails directly at **`vexa.it2026@gmail.com`**, configure your 16-character Google App Password in `SMTP_PASS`:
  1. Enable 2-Step Verification on `vexa.it2026@gmail.com`
  2. Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
  3. Create an app password for "Mail" and set `SMTP_PASS=your_16_char_password` in `backend/.env`.


### 4. Run Locally

#### Run Backend:
```bash
npm run server
# or with live reloading:
npm run server:dev
```

#### Run Frontend:
```bash
npm run dev
```

---

## 🔐 Admin Panel
- Access via **`/admin`** (e.g. `http://localhost:5173/admin` or `/#admin`)
- Manage **Our Projects** (add photos via URL or direct file upload, edit, delete).
- Manage **Contact Inquiries** & Leads (view submissions, add custom leads, update status, WhatsApp/Email shortcuts).

---

## 🛠️ Build for Production

```bash
npm run build:frontend
```
