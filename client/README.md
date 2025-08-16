# Admin Attendance Tracker  

A full-stack **Admin-only Attendance Management System** built with:  
- **Backend:** Node.js (Express) + Prisma (SQLite DB)  
- **Frontend:** React (Vite) + Axios + Recharts (for charts)  

This project is designed as a lightweight tool for administrators to:  
- Manage team members  
- Mark daily attendance  
- Visualize attendance trends with charts  

---

## 🚀 Features  

### 🔹 Backend (Express + Prisma)
- REST APIs for:
  - Add / Edit / Delete Members
  - Mark Attendance by Date
  - Fetch Attendance Records
  - Dashboard Stats (total members, attendance rate, trends)
- SQLite Database using Prisma ORM  
- Input validation using Zod  
- CORS + Morgan logging enabled  

### 🔹 Frontend (React + Vite)
- Clean responsive UI (no Tailwind, only custom CSS)  
- Pages:
  - **Home** → Overview + Feature cards  
  - **Members** → Manage team members  
  - **Attendance** → Select date & mark presence  
  - **Dashboard** → Charts + Stats for attendance trends  
- Recharts for Attendance Graphs  
- Axios for API calls  
- React Router DOM for navigation  
- Fully responsive design (works on Laptop + Mobile)  

---

## 📂 Project Structure  

Admin-attendance/
┣ server/ # Backend
┃ ┣ src/
┃ ┃ ┣ index.js # Express server entry
┃ ┃ ┣ routes/ # API routes
┃ ┃ ┣ controllers/ # API controllers
┃ ┃ ┗ prisma/ # Prisma schema + client
┃ ┗ package.json
┣ client/ # Frontend
┃ ┣ src/
┃ ┃ ┣ components/ # Navbar, etc.
┃ ┃ ┣ pages/ # Home, Members, Attendance, Dashboard
┃ ┃ ┣ App.jsx # Main router
┃ ┃ ┗ App.css # Custom styling
┃ ┗ package.json
┗ README.md


---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the repository  
```bash
git clone <repo-url>
cd Admin-attendance

cd server
npm install
npx prisma migrate dev --name init
npm run dev

