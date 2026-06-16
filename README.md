# InterviewIQ.AI 🤖

AI-powered mock interview platform with voice interaction, adaptive questioning, resume analysis, real-time feedback, and performance analytics.

🔗 **Live Demo:** https://interviewapp1.onrender.com

## 🚀 Features

* 🎤 AI-powered voice interviews
* 📄 Resume PDF analysis
* 🧠 Adaptive question generation (Easy → Hard)
* ⚡ Real-time answer evaluation
* 📊 Detailed performance analytics
* 📥 PDF report download
* 📚 Interview history tracking
* 💳 Razorpay credit system
* 🔐 Google Authentication
* 🌙 Modern Glassmorphism UI

## 🛠️ Tech Stack

### Frontend

* React 18
* Vite
* Tailwind CSS
* React Router
* Framer Motion
* Axios
* Firebase Auth
* Recharts
* jsPDF

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Groq (Llama 3.1)
* Razorpay
* Multer
* PDF.js
* JWT Authentication

## ⚙️ Environment Variables

### Server

```env
PORT=8000
MONGODB_URL=
GROQ_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
JWT_SECRET=
```

### Client

```env
VITE_RAZORPAY_KEY_ID=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
```

## 🚀 Installation

```bash
git clone https://github.com/tushar-rawat03/interviewApp.git

# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:8000`

## 💳 Credit System

| Plan    | Price | Credits |
| ------- | ----- | ------- |
| Free    | ₹0    | 100     |
| Starter | ₹100  | 150     |
| Pro     | ₹500  | 650     |

**Interview Cost:** 50 Credits

## 🤖 Interview Flow

1. Select role & interview type
2. Upload resume (optional)
3. AI generates 5 questions
4. Answer via voice or text
5. Receive instant feedback
6. View detailed analytics report

## 📊 Scoring Criteria

* Confidence (0-10)
* Communication (0-10)
* Correctness (0-10)

**Final Score = Average of all metrics**

## 📄 License

MIT License

## 👨‍💻 Author

**Tushar Rawat**

Built with ❤️ using React, Node.js, MongoDB, Groq & Razorpay.
