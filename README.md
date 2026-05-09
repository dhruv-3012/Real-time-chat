# 💬 VibeChat — Real-Time Chat App

A full-stack real-time chat application built with React, Node.js, Socket.IO, and MongoDB.

🌐 **Live Demo:** [real-time-chat-omega-livid.vercel.app](https://real-time-chat-omega-livid.vercel.app)

---

## ✨ Features

- 🔐 User authentication (Register / Login with JWT)
- 💬 Real-time messaging with Socket.IO
- 😊 Emoji picker support
- 🟢 Online/Offline status indicators
- ✏️ Typing indicators
- 📱 Responsive design
- 🎨 Beautiful purple-themed UI

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- Socket.IO Client
- Axios
- React Router DOM
- Lucide React (icons)
- Emoji Picker React

**Backend**
- Node.js + Express.js
- Socket.IO
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

**Deployment**
- Frontend → [Vercel](https://vercel.com)
- Backend → [Render](https://render.com)
- Database → [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v16+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/dhruv-3012/Real-time-chat.git
cd Real-time-chat
```

### 2. Setup the Server

```bash
cd real-time-chat/server
npm install
```

Create a `.env` file in the `server` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the server:

```bash
node server.js
```

### 3. Setup the Client

```bash
cd client
npm install
```

Create a `.env` file in the `client` folder:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the client:

```bash
npm start
```

App will run at `http://localhost:3000`

---

## 📁 Project Structure

```
Real-time-chat/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.js
│   │   │   └── Sidebar.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   └── utils/
│   │       └── axios.js
│   └── package.json
│
└── real-time-chat/server/   # Node.js backend
    ├── models/
    │   ├── User.js
    │   ├── Message.js
    │   └── Conversation.js
    ├── routes/
    │   ├── auth.js
    │   ├── messages.js
    │   ├── conversations.js
    │   └── users.js
    ├── socket/
    │   └── socketHandler.js
    ├── middleware/
    │   └── auth.js
    └── server.js
```

---

## 🌍 Deployment

### Deploy Server (Render)
1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set Root Directory: `real-time-chat/server`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`

### Deploy Client (Vercel)
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set Root Directory: `client`
4. Add environment variable: `REACT_APP_API_URL` = https://real-time-chat-m227.onrender.com

---

## 📸 Screenshots

> Login Page
><img width="1913" height="828" alt="Image" src="https://github.com/user-attachments/assets/1fd6bace-a07e-4800-9465-4986a6c31ac9" />
> Register Page
> <img width="1893" height="822" alt="Image" src="https://github.com/user-attachments/assets/118de1f3-cce3-48cb-97a8-4c8d0288a84a" />
> Chat Window
> <img width="1911" height="820" alt="Image" src="https://github.com/user-attachments/assets/372b19d9-2773-4f79-9192-19522038ad57" />
> Emoji Picker
> <img width="1888" height="825" alt="Image" src="https://github.com/user-attachments/assets/6196b869-a6b8-4e50-bf43-f72f5e24dea6" />
> 

---

## 👨‍💻 Author

**Dhruv** — [@dhruv-3012](https://github.com/dhruv-3012)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
