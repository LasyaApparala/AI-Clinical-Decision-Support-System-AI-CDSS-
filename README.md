# Clinical AI LAS - AI Clinical Decision Support Platform

A comprehensive AI-powered clinical decision support system built with React, Node.js, and Python.

## Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Chat Interface**: Interactive AI chat with clinical decision support
- **Chat History**: Persistent chat sessions with searchable history
- **Subscription Management**: Pro plan upgrades with Stripe integration
- **Profile Management**: User profile editing and management
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB
- **AI Service**: Python + FastAPI + ChromaDB
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS

## Quick Start

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- MongoDB
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Clinical-AI-LAS
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../ui
   npm install
   
   # AI service dependencies
   cd ../ai
   pip install -r requirements.txt
   ```

3. **Environment Setup**
   
   Create `.env` files in the backend and ai directories:
   
   **backend/.env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/clinical-ai
   JWT_ACCESS_SECRET=your-secret-key
   PORT=3000
   ```
   
   **ai/.env:**
   ```env
   OPENAI_API_KEY=your-openai-key
   CHROMA_DB_PATH=./chroma_db
   ```

4. **Start the services**
   
   ```bash
   # Start MongoDB (if not running)
   mongod
   
   # Start Backend (in backend directory)
   npm start
   
   # Start Frontend (in ui directory)
   npm run dev
   
   # Start AI Service (in ai directory)
   python app.py
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - AI Service: http://localhost:8000

## Usage

1. **Landing Page**: Visit the homepage to learn about the platform
2. **Sign Up**: Create a new account with your clinical credentials
3. **Login**: Access your account and start chatting
4. **Chat Interface**: Ask clinical questions and get AI-powered responses
5. **Upgrade**: Access Pro features through the subscription page

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Chat
- `POST /api/chat/session` - Create new chat session
- `POST /api/chat/query` - Send message to AI
- `GET /api/chat/sessions` - Get chat history
- `GET /api/chat/history` - Get session messages

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Subscription
- `POST /api/subscription/create-checkout-session` - Create payment session
- `GET /api/subscription/status` - Get subscription status

## Development

### Project Structure
```
Clinical-AI-LAS/
├── ui/                 # React frontend
├── backend/           # Node.js backend
├── ai/               # Python AI service
└── docker-compose.yaml
```

### Key Components
- **LandingPage**: Homepage with login/signup
- **AuthPage**: Authentication forms
- **ChatPage**: Main chat interface
- **SubscriptionPage**: Payment and upgrade
- **ProfilePage**: User profile management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
