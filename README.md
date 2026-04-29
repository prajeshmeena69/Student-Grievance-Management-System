# Student Grievance Management System

A full-stack web application built with the MERN stack that allows students to register, login, and manage their grievances efficiently. The system features JWT-based authentication, protected routes, and a modern dark-themed UI.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | https://student-grievance-frontend-03x6.onrender.com |
| Backend API | https://student-grievance-backend-fw06.onrender.com |

---

## ✨ Features

- Student registration and login with JWT authentication
- Password hashing using bcrypt
- Protected routes — only authenticated users can access the dashboard
- Submit, view, update, and delete grievances
- Search grievances by title
- Grievance categories: Academic, Hostel, Transport, Other
- Grievance status tracking: Pending / Resolved
- Logout functionality with token removal
- Modern dark-themed responsive UI

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- React Router DOM
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- JSON Web Token (JWT)
- CORS

---

## 📁 Project Structure

```
Student Grievance Management System/
├── backend/
│   ├── config/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Student.js
│   │   └── Grievance.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── grievanceRoutes.js
│   ├── .env
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── pages/
        │   ├── Register.js
        │   ├── Login.js
        │   └── Dashboard.js
        ├── App.js
        ├── index.js
        └── index.css
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/register | Register a new student |
| POST | /api/login | Login and receive JWT token |

### Grievances (Protected)
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/grievances | Submit a new grievance |
| GET | /api/grievances | Get all grievances |
| GET | /api/grievances/:id | Get a single grievance |
| PUT | /api/grievances/:id | Update a grievance |
| DELETE | /api/grievances/:id | Delete a grievance |
| GET | /api/grievances/search?title=xyz | Search grievances by title |

---

## 🔒 Security

- Passwords are hashed using **bcryptjs** before storing in the database
- Authentication is handled via **JSON Web Tokens (JWT)**
- All grievance routes are protected by an auth middleware
- Users can only access and manage their own grievances
- Token is removed from localStorage on logout

---

## ⚙️ Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000
```

---

## 👤 Author

**Prajesh Singh Meena**

- GitHub: [https://github.com/prajeshmeena69](https://github.com/prajeshmeena69)
- LinkedIn: [https://www.linkedin.com/in/prajesh-singh-meena-607437327](https://www.linkedin.com/in/prajesh-singh-meena-607437327)


