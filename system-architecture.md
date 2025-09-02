# Clinical AI System - Architecture Diagrams

## 🏗️ System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React UI<br/>Port 5173<br/>TypeScript + Vite]
        UI_AUTH[AuthContext<br/>JWT Management]
        UI_CHAT[ChatContext<br/>Message State]
        UI_SERVICES[API Services<br/>Axios Clients]
    end

    subgraph "Backend Layer"
        BACKEND[Express Backend<br/>Port 3000<br/>Node.js]
        AUTH_CTRL[Auth Controller<br/>Login/Signup]
        CHAT_CTRL[Chat Controller<br/>Session Management]
        SUB_CTRL[Subscription Controller<br/>Stripe Integration]
        USER_CTRL[User Controller<br/>Profile Management]
    end

    subgraph "AI Service Layer"
        AI_SERVICE[FastAPI AI Service<br/>Port 8000<br/>Python]
        RAG_PIPELINE[RAG Pipeline<br/>Retrieval + Generation]
        VECTOR_DB[ChromaDB<br/>Vector Store]
        LLM_SERVICE[LLM Service<br/>Local/HF/OpenAI]
        EMBEDDING[Embedding Service<br/>Sentence Transformers]
    end

    subgraph "Data Layer"
        MONGODB[(MongoDB<br/>Port 27017<br/>User Data & Chat History)]
        CHROMA_VOL[(ChromaDB Volume<br/>Medical Knowledge<br/>Vector Embeddings)]
    end

    subgraph "External Services"
        STRIPE[Stripe API<br/>Payment Processing]
        HF_API[Hugging Face API<br/>Model Inference]
        OPENAI_API[OpenAI API<br/>GPT Models]
    end

    %% Frontend connections
    UI --> UI_AUTH
    UI --> UI_CHAT
    UI --> UI_SERVICES
    UI_SERVICES --> BACKEND

    %% Backend internal connections
    BACKEND --> AUTH_CTRL
    BACKEND --> CHAT_CTRL
    BACKEND --> SUB_CTRL
    BACKEND --> USER_CTRL

    %% Backend to data
    AUTH_CTRL --> MONGODB
    CHAT_CTRL --> MONGODB
    USER_CTRL --> MONGODB
    SUB_CTRL --> STRIPE

    %% Backend to AI
    CHAT_CTRL --> AI_SERVICE

    %% AI Service internal
    AI_SERVICE --> RAG_PIPELINE
    RAG_PIPELINE --> VECTOR_DB
    RAG_PIPELINE --> LLM_SERVICE
    LLM_SERVICE --> EMBEDDING
    VECTOR_DB --> CHROMA_VOL

    %% AI to external
    LLM_SERVICE --> HF_API
    LLM_SERVICE --> OPENAI_API

    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef ai fill:#e8f5e8
    classDef data fill:#fff3e0
    classDef external fill:#ffebee

    class UI,UI_AUTH,UI_CHAT,UI_SERVICES frontend
    class BACKEND,AUTH_CTRL,CHAT_CTRL,SUB_CTRL,USER_CTRL backend
    class AI_SERVICE,RAG_PIPELINE,VECTOR_DB,LLM_SERVICE,EMBEDDING ai
    class MONGODB,CHROMA_VOL data
    class STRIPE,HF_API,OPENAI_API external
```

## 🔄 Detailed Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React UI
    participant BE as Backend API
    participant AI as AI Service
    participant VDB as Vector DB
    participant LLM as LLM Service
    participant MDB as MongoDB

    %% Authentication Flow
    U->>UI: Login (email/password)
    UI->>BE: POST /api/auth/login
    BE->>MDB: Find user & validate password
    MDB-->>BE: User data
    BE->>BE: Generate JWT token
    BE-->>UI: JWT token + user data
    UI->>UI: Store token in localStorage
    UI-->>U: Redirect to chat

    %% Chat Session Creation
    U->>UI: Navigate to chat
    UI->>BE: POST /api/chat/session
    BE->>MDB: Create ChatSession
    MDB-->>BE: Session ID
    BE-->>UI: Session ID
    UI->>UI: Store session ID

    %% Medical Query Processing
    U->>UI: Enter medical case
    UI->>BE: POST /api/chat/query
    BE->>MDB: Save user message
    BE->>AI: POST /process (medical query)
    
    %% RAG Pipeline
    AI->>VDB: Query relevant documents
    VDB-->>AI: Retrieved medical documents
    AI->>AI: Build context from documents
    AI->>LLM: Generate response with context
    LLM-->>AI: Structured medical response
    AI->>AI: Post-process with citations
    AI-->>BE: Response + citations + metadata
    
    %% Response Handling
    BE->>MDB: Save AI response
    BE-->>UI: Response + sources
    UI->>UI: Update chat history
    UI-->>U: Display response with citations
```

## 🗂️ File Structure & Dependencies

```mermaid
graph TD
    subgraph "Root Level"
        DOCKER[docker-compose.yaml<br/>Service Orchestration]
    end

    subgraph "Frontend (/ui/)"
        UI_PKG[package.json<br/>Dependencies]
        UI_MAIN[main.tsx<br/>Entry Point]
        UI_APP[App.tsx<br/>Routing]
        UI_AUTH_CTX[AuthContext.tsx<br/>JWT Management]
        UI_CHAT_CTX[ChatContext.tsx<br/>Message State]
        
        subgraph "UI Services"
            UI_API[api.ts<br/>Axios Config]
            UI_AUTH_SVC[authService.ts<br/>Auth API]
            UI_CHAT_SVC[chatService.ts<br/>Chat API]
        end
        
        subgraph "UI Pages"
            UI_CHAT_PAGE[ChatPage.tsx<br/>Main Interface]
        end
        
        subgraph "UI Components"
            UI_CHAT_INPUT[ChatInput.tsx<br/>Message Input]
            UI_CHAT_MSG[ChatMessage.tsx<br/>Message Display]
            UI_CITATION[CitationPanel.tsx<br/>Sources Display]
        end
        
        UI_CONFIG[vite.config.ts<br/>Build Config]
    end

    subgraph "Backend (/backend/)"
        BE_PKG[package.json<br/>Dependencies]
        BE_SERVER[server.js<br/>HTTP Server]
        BE_APP[app.js<br/>Express App]
        
        subgraph "Backend Config"
            BE_DB[config/db.js<br/>MongoDB Connection]
        end
        
        subgraph "Backend Models"
            BE_USER[models/User.js<br/>User Schema]
            BE_SESSION[models/ChatSession.js<br/>Session Schema]
            BE_MSG[models/Message.js<br/>Message Schema]
        end
        
        subgraph "Backend Controllers"
            BE_AUTH_CTRL[controllers/authController.js<br/>Auth Logic]
            BE_CHAT_CTRL[controllers/chatController.js<br/>Chat Logic]
            BE_SUB_CTRL[controllers/subscriptionController.js<br/>Subscription Logic]
        end
        
        subgraph "Backend Middleware"
            BE_AUTH_MID[middleware/authMiddleware.js<br/>JWT Validation]
        end
        
        subgraph "Backend Routes"
            BE_AUTH_ROUTE[routes/auth.js<br/>Auth Endpoints]
            BE_CHAT_ROUTE[routes/chat.js<br/>Chat Endpoints]
            BE_USER_ROUTE[routes/user.js<br/>User Endpoints]
            BE_SUB_ROUTE[routes/subscription.js<br/>Subscription Endpoints]
        end
        
        subgraph "Backend Services"
            BE_AI_CLIENT[services/aiClient.js<br/>AI Service Client]
        end
        
        BE_DOCKER[dockerfile<br/>Container Config]
        BE_TEST[__tests__/chat.e2e.test.js<br/>E2E Tests]
        BE_API_DOC[openapi-summary.yaml<br/>API Documentation]
    end

    subgraph "AI Service (/ai/)"
        AI_DOCKER[Dockerfile<br/>Container Config]
        AI_REQ[requirements.txt<br/>Python Dependencies]
        AI_APP[app.py<br/>FastAPI App]
        
        subgraph "AI API"
            AI_PROCESS[api/process.py<br/>Main Endpoint]
        end
        
        subgraph "AI RAG"
            AI_RAG[rag/rag_pipeline.py<br/>RAG Implementation]
            AI_PROMPT[rag/prompt_templates.py<br/>Prompt Engineering]
        end
        
        subgraph "AI Vector Store"
            AI_CHROMA[vectorstore/chroma_store.py<br/>Vector DB Operations]
        end
        
        subgraph "AI LLM"
            AI_LLM[llm/medical_llm.py<br/>Language Model Integration]
        end
        
        subgraph "AI Embeddings"
            AI_EMBED[embeddings/embedder.py<br/>Text Embeddings]
        end
        
        subgraph "AI Utils"
            AI_LOGGER[utils/logger.py<br/>Logging]
            AI_PREPROC[utils/preprocess.py<br/>Document Ingestion]
        end
        
        AI_TEST[tests/test_rag.py<br/>RAG Tests]
    end

    %% Dependencies
    DOCKER --> UI_PKG
    DOCKER --> BE_PKG
    DOCKER --> AI_REQ
    
    UI_MAIN --> UI_APP
    UI_APP --> UI_AUTH_CTX
    UI_APP --> UI_CHAT_CTX
    UI_APP --> UI_CHAT_PAGE
    UI_CHAT_PAGE --> UI_CHAT_INPUT
    UI_CHAT_PAGE --> UI_CHAT_MSG
    UI_CHAT_PAGE --> UI_CITATION
    UI_CHAT_PAGE --> UI_CHAT_SVC
    UI_CHAT_SVC --> UI_API
    UI_AUTH_CTX --> UI_AUTH_SVC
    UI_AUTH_SVC --> UI_API
    
    BE_SERVER --> BE_APP
    BE_APP --> BE_DB
    BE_APP --> BE_AUTH_ROUTE
    BE_APP --> BE_CHAT_ROUTE
    BE_APP --> BE_USER_ROUTE
    BE_APP --> BE_SUB_ROUTE
    BE_AUTH_ROUTE --> BE_AUTH_CTRL
    BE_CHAT_ROUTE --> BE_CHAT_CTRL
    BE_SUB_ROUTE --> BE_SUB_CTRL
    BE_CHAT_CTRL --> BE_AI_CLIENT
    BE_AUTH_ROUTE --> BE_AUTH_MID
    BE_CHAT_ROUTE --> BE_AUTH_MID
    BE_USER_ROUTE --> BE_AUTH_MID
    BE_SUB_ROUTE --> BE_AUTH_MID
    BE_AUTH_CTRL --> BE_USER
    BE_CHAT_CTRL --> BE_SESSION
    BE_CHAT_CTRL --> BE_MSG
    
    AI_APP --> AI_PROCESS
    AI_PROCESS --> AI_RAG
    AI_RAG --> AI_CHROMA
    AI_RAG --> AI_LLM
    AI_RAG --> AI_PROMPT
    AI_LLM --> AI_EMBED
    AI_PREPROC --> AI_CHROMA
    AI_PREPROC --> AI_EMBED

    classDef root fill:#ffecb3
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef ai fill:#e8f5e8

    class DOCKER root
    class UI_PKG,UI_MAIN,UI_APP,UI_AUTH_CTX,UI_CHAT_CTX,UI_API,UI_AUTH_SVC,UI_CHAT_SVC,UI_CHAT_PAGE,UI_CHAT_INPUT,UI_CHAT_MSG,UI_CITATION,UI_CONFIG frontend
    class BE_PKG,BE_SERVER,BE_APP,BE_DB,BE_USER,BE_SESSION,BE_MSG,BE_AUTH_CTRL,BE_CHAT_CTRL,BE_SUB_CTRL,BE_AUTH_MID,BE_AUTH_ROUTE,BE_CHAT_ROUTE,BE_USER_ROUTE,BE_SUB_ROUTE,BE_AI_CLIENT,BE_DOCKER,BE_TEST,BE_API_DOC backend
    class AI_DOCKER,AI_REQ,AI_APP,AI_PROCESS,AI_RAG,AI_PROMPT,AI_CHROMA,AI_LLM,AI_EMBED,AI_LOGGER,AI_PREPROC,AI_TEST ai
```

## 🔐 Authentication & Authorization Flow

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    
    Unauthenticated --> LoginForm: User visits app
    LoginForm --> Authenticating: Submit credentials
    Authenticating --> Authenticated: Valid credentials
    Authenticating --> LoginForm: Invalid credentials
    
    Authenticated --> ProtectedRoute: Access protected page
    ProtectedRoute --> Authenticated: Valid JWT
    ProtectedRoute --> LoginForm: Invalid/expired JWT
    
    Authenticated --> Logout: User logs out
    Logout --> Unauthenticated
    
    state Authenticated {
        [*] --> TokenValid
        TokenValid --> TokenExpired: JWT expires
        TokenExpired --> TokenValid: Refresh token
        TokenExpired --> Unauthenticated: No refresh
    }
    
    state ProtectedRoute {
        [*] --> CheckAuth
        CheckAuth --> AllowAccess: Valid token
        CheckAuth --> RedirectLogin: Invalid token
    }
```

## 🤖 RAG Pipeline Detailed Flow

```mermaid
flowchart TD
    A[Medical Query] --> B[Text Preprocessing]
    B --> C[Query Embedding]
    C --> D[Vector Database Search]
    D --> E{Found Documents?}
    
    E -->|No| F[Return: Insufficient Evidence]
    E -->|Yes| G[Retrieve Top-K Documents]
    
    G --> H[Build Context String]
    H --> I[Create Prompt with Context]
    I --> J[LLM Generation]
    
    J --> K{LLM Backend}
    K -->|Local| L[Local Model Pipeline]
    K -->|Hugging Face| M[HF Inference API]
    K -->|OpenAI| N[OpenAI API]
    
    L --> O[Raw Response]
    M --> O
    N --> O
    
    O --> P[Response Post-processing]
    P --> Q[Extract JSON Structure]
    Q --> R[Add Citations]
    R --> S[Format Final Response]
    S --> T[Return to Backend]
    
    subgraph "Vector Database"
        V1[Document Chunks]
        V2[Embeddings]
        V3[Metadata]
        V4[Similarity Search]
    end
    
    D --> V4
    V4 --> V2
    V2 --> V1
    V1 --> V3
    
    subgraph "LLM Options"
        LLM1[Local: Flan-T5]
        LLM2[HF: Custom Models]
        LLM3[OpenAI: GPT-4]
    end
    
    L --> LLM1
    M --> LLM2
    N --> LLM3
```

## 💾 Database Schema Relationships

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String name
        String email UK
        String passwordHash
        String role
        Object subscription
    }
    
    CHAT_SESSION {
        ObjectId _id PK
        ObjectId userId FK
        String title
        Date createdAt
        Date updatedAt
    }
    
    MESSAGE {
        ObjectId _id PK
        ObjectId sessionId FK
        ObjectId userId FK
        String role
        String content
        Array citations
        Number tokensUsed
        Object meta
        Date createdAt
        Date updatedAt
    }
    
    USER ||--o{ CHAT_SESSION : "has many"
    CHAT_SESSION ||--o{ MESSAGE : "contains many"
    USER ||--o{ MESSAGE : "creates many"
    
    %% Subscription object structure
    USER {
        Object subscription {
            String tier
            Date validUntil
        }
    }
    
    %% Citation object structure
    MESSAGE {
        Array citations {
            String id
            String snippet
            String url
            Number score
        }
    }
```

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Docker Compose Environment"
        subgraph "Frontend Container"
            UI_CONTAINER[React App<br/>Port 5173<br/>Vite Dev Server]
        end
        
        subgraph "Backend Container"
            BE_CONTAINER[Express Server<br/>Port 3000<br/>Node.js]
        end
        
        subgraph "AI Service Container"
            AI_CONTAINER[FastAPI Server<br/>Port 8000<br/>Python]
        end
        
        subgraph "Database Container"
            MONGO_CONTAINER[MongoDB<br/>Port 27017<br/>Database]
        end
    end
    
    subgraph "Persistent Volumes"
        MONGO_VOL[(MongoDB Data<br/>mongodata)]
        CHROMA_VOL[(ChromaDB Data<br/>chroma)]
        AI_DATA_VOL[(AI Service Data<br/>./ai/data)]
    end
    
    subgraph "Network"
        APPNET[appnet<br/>Internal Network]
    end
    
    subgraph "External Services"
        STRIPE_API[Stripe API<br/>Payments]
        HF_API[Hugging Face API<br/>Models]
        OPENAI_API[OpenAI API<br/>GPT Models]
    end
    
    %% Container connections
    UI_CONTAINER --> BE_CONTAINER
    BE_CONTAINER --> AI_CONTAINER
    BE_CONTAINER --> MONGO_CONTAINER
    AI_CONTAINER --> CHROMA_VOL
    MONGO_CONTAINER --> MONGO_VOL
    AI_CONTAINER --> AI_DATA_VOL
    
    %% Network connections
    UI_CONTAINER -.-> APPNET
    BE_CONTAINER -.-> APPNET
    AI_CONTAINER -.-> APPNET
    MONGO_CONTAINER -.-> APPNET
    
    %% External connections
    BE_CONTAINER --> STRIPE_API
    AI_CONTAINER --> HF_API
    AI_CONTAINER --> OPENAI_API
    
    classDef container fill:#e3f2fd
    classDef volume fill:#f1f8e9
    classDef network fill:#fff3e0
    classDef external fill:#ffebee
    
    class UI_CONTAINER,BE_CONTAINER,AI_CONTAINER,MONGO_CONTAINER container
    class MONGO_VOL,CHROMA_VOL,AI_DATA_VOL volume
    class APPNET network
    class STRIPE_API,HF_API,OPENAI_API external
```

## 🔄 API Endpoints & Request/Response Flow

```mermaid
graph LR
    subgraph "Frontend (React)"
        UI_AUTH[Auth Pages]
        UI_CHAT[Chat Interface]
        UI_PROFILE[Profile Pages]
    end
    
    subgraph "Backend API (Express)"
        subgraph "Auth Routes (/api/auth)"
            AUTH_SIGNUP[POST /signup]
            AUTH_LOGIN[POST /login]
        end
        
        subgraph "Chat Routes (/api/chat)"
            CHAT_SESSION[POST /session]
            CHAT_QUERY[POST /query]
            CHAT_HISTORY[GET /history]
        end
        
        subgraph "User Routes (/api/user)"
            USER_PROFILE[GET /profile]
        end
        
        subgraph "Subscription Routes (/api/subscription)"
            SUB_STATUS[GET /status]
            SUB_UPGRADE[POST /upgrade]
        end
    end
    
    subgraph "AI Service (FastAPI)"
        AI_PROCESS[POST /process]
    end
    
    subgraph "External APIs"
        STRIPE[Stripe API]
        HF[Hugging Face]
        OPENAI[OpenAI API]
    end
    
    %% Frontend to Backend
    UI_AUTH --> AUTH_SIGNUP
    UI_AUTH --> AUTH_LOGIN
    UI_CHAT --> CHAT_SESSION
    UI_CHAT --> CHAT_QUERY
    UI_CHAT --> CHAT_HISTORY
    UI_PROFILE --> USER_PROFILE
    UI_PROFILE --> SUB_STATUS
    UI_PROFILE --> SUB_UPGRADE
    
    %% Backend to AI
    CHAT_QUERY --> AI_PROCESS
    
    %% Backend to External
    SUB_UPGRADE --> STRIPE
    AI_PROCESS --> HF
    AI_PROCESS --> OPENAI
    
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef ai fill:#e8f5e8
    classDef external fill:#ffebee
    
    class UI_AUTH,UI_CHAT,UI_PROFILE frontend
    class AUTH_SIGNUP,AUTH_LOGIN,CHAT_SESSION,CHAT_QUERY,CHAT_HISTORY,USER_PROFILE,SUB_STATUS,SUB_UPGRADE backend
    class AI_PROCESS ai
    class STRIPE,HF,OPENAI external
```

## 📊 Component State Management

```mermaid
graph TD
    subgraph "React Context Providers"
        AUTH_PROVIDER[AuthProvider<br/>JWT Token Management]
        CHAT_PROVIDER[ChatProvider<br/>Message State]
    end
    
    subgraph "Auth State"
        AUTH_TOKEN[JWT Token<br/>localStorage]
        AUTH_USER[User Object<br/>Decoded from JWT]
        AUTH_LOADING[Loading State]
    end
    
    subgraph "Chat State"
        CHAT_MESSAGES[Message Array<br/>Conversation History]
        CHAT_SESSION[Session ID<br/>Current Chat]
        CHAT_CITATIONS[Citation Array<br/>AI Sources]
        CHAT_LOADING[Loading State]
    end
    
    subgraph "UI Components"
        NAVBAR[Navbar<br/>Auth Status]
        CHAT_PAGE[ChatPage<br/>Main Interface]
        CHAT_INPUT[ChatInput<br/>Message Input]
        CHAT_MSG[ChatMessage<br/>Message Display]
        CITATION_PANEL[CitationPanel<br/>Sources Display]
    end
    
    %% Context to State
    AUTH_PROVIDER --> AUTH_TOKEN
    AUTH_PROVIDER --> AUTH_USER
    AUTH_PROVIDER --> AUTH_LOADING
    
    CHAT_PROVIDER --> CHAT_MESSAGES
    CHAT_PROVIDER --> CHAT_SESSION
    CHAT_PROVIDER --> CHAT_CITATIONS
    CHAT_PROVIDER --> CHAT_LOADING
    
    %% State to Components
    AUTH_TOKEN --> NAVBAR
    AUTH_USER --> NAVBAR
    AUTH_LOADING --> NAVBAR
    
    CHAT_MESSAGES --> CHAT_PAGE
    CHAT_SESSION --> CHAT_PAGE
    CHAT_CITATIONS --> CHAT_PAGE
    CHAT_LOADING --> CHAT_PAGE
    
    CHAT_MESSAGES --> CHAT_MSG
    CHAT_LOADING --> CHAT_INPUT
    CHAT_CITATIONS --> CITATION_PANEL
    
    classDef context fill:#e8f5e8
    classDef state fill:#fff3e0
    classDef component fill:#e1f5fe
    
    class AUTH_PROVIDER,CHAT_PROVIDER context
    class AUTH_TOKEN,AUTH_USER,AUTH_LOADING,CHAT_MESSAGES,CHAT_SESSION,CHAT_CITATIONS,CHAT_LOADING state
    class NAVBAR,CHAT_PAGE,CHAT_INPUT,CHAT_MSG,CITATION_PANEL component
```

## 🔧 Development & Testing Workflow

```mermaid
graph LR
    subgraph "Development Environment"
        DEV_UI[UI Dev Server<br/>Vite + Hot Reload]
        DEV_BE[Backend Dev Server<br/>Node.js + Nodemon]
        DEV_AI[AI Service Dev<br/>FastAPI + Uvicorn]
        DEV_DB[MongoDB Local<br/>Development Data]
    end
    
    subgraph "Testing"
        UNIT_TESTS[Unit Tests<br/>Jest + Supertest]
        E2E_TESTS[E2E Tests<br/>Chat Flow Testing]
        AI_TESTS[AI Tests<br/>RAG Pipeline Testing]
    end
    
    subgraph "Build Process"
        UI_BUILD[UI Build<br/>TypeScript + Vite]
        BE_BUILD[Backend Build<br/>Node.js Production]
        AI_BUILD[AI Build<br/>Python + Dependencies]
    end
    
    subgraph "Deployment"
        DOCKER_BUILD[Docker Build<br/>Multi-stage Builds]
        DOCKER_COMPOSE[Docker Compose<br/>Service Orchestration]
        PROD_DEPLOY[Production Deployment<br/>Containerized Services]
    end
    
    %% Development flow
    DEV_UI --> DEV_BE
    DEV_BE --> DEV_AI
    DEV_AI --> DEV_DB
    
    %% Testing flow
    DEV_BE --> UNIT_TESTS
    DEV_AI --> AI_TESTS
    UNIT_TESTS --> E2E_TESTS
    
    %% Build flow
    DEV_UI --> UI_BUILD
    DEV_BE --> BE_BUILD
    DEV_AI --> AI_BUILD
    
    %% Deployment flow
    UI_BUILD --> DOCKER_BUILD
    BE_BUILD --> DOCKER_BUILD
    AI_BUILD --> DOCKER_BUILD
    DOCKER_BUILD --> DOCKER_COMPOSE
    DOCKER_COMPOSE --> PROD_DEPLOY
    
    classDef dev fill:#e3f2fd
    classDef test fill:#f1f8e9
    classDef build fill:#fff3e0
    classDef deploy fill:#ffebee
    
    class DEV_UI,DEV_BE,DEV_AI,DEV_DB dev
    class UNIT_TESTS,E2E_TESTS,AI_TESTS test
    class UI_BUILD,BE_BUILD,AI_BUILD build
    class DOCKER_BUILD,DOCKER_COMPOSE,PROD_DEPLOY deploy
```
