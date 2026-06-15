<img width="1902" height="864" alt="Screenshot 2026-06-16 012926" src="https://github.com/user-attachments/assets/eddece2b-b275-420d-b202-1e3fd50ea7ea" />
<img width="1899" height="865" alt="Screenshot 2026-06-16 012941" src="https://github.com/user-attachments/assets/284386a9-d3f1-4add-9996-2f653b7efe86" />
<img width="2548" height="1267" alt="Screenshot 2026-06-16 013454" src="https://github.com/user-attachments/assets/bab68e23-3b1b-409a-acf1-b0c65fa570a4" />
<img width="2540" height="1264" alt="Screenshot 2026-06-16 013537" src="https://github.com/user-attachments/assets/f6cdd641-5b00-4370-9927-d0608dab1e17" />

<img width="1944" height="1237" alt="Screenshot 2026-06-16 013245" src="https://github.com/user-attachments/assets/98d6d0eb-4650-4a01-9e52-7c88c3abdec0" />
<img width="1890" height="868" alt="Screenshot 2026-06-16 013650" src="https://github.com/user-attachments/assets/cbc49979-3d2a-4683-a6cb-6bd26ed2ede0" />


# 🎨 SketchOn

> A state-of-the-art collaborative visual workspace and AI-powered diagramming application.

SketchOn is a modern collaborative whiteboard and diagramming application built using the MERN stack. It allows users to brainstorm, design, and interact with schemas, system architectures, and drawings on a canvas powered by React Flow and Framer Motion. With integrated AI analysis and a secure, verified onboarding email system, SketchOn is a production-grade platform for visual collaboration.

---

## ⚡ Core Features

* **Infinite Interactive Canvas:** Create complex system diagrams, mind maps, and workflow charts using a fully responsive, zoomable canvas built with React Flow.
* **AI Diagram Analysis:** Upload or build diagrams and get intelligent reviews, architecture suggestions, and node generation via integrated AI models.
* **Seamless Authentication:** Enterprise-ready user management and secure authentication flows powered by Clerk.
* **Secure Webhook Pipeline:** Real-time user synchronization using Clerk Webhooks, protected by Svix cryptographic signature verification.
* **Personalized User Onboarding:** Automated delivery of professional, responsive HTML onboarding emails via Resend on new registration.
* **Credit & Subscription System:** Multi-tier plan support (Basic & Pro) and credit-based system for AI queries.
* **Premium User Experience:** Sleek dark-mode aesthetic with custom animations powered by Framer Motion.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Usage |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7 | Fast build times, HMR, and smooth routing |
| **Styling** | Tailwind CSS v4, Framer Motion | Modern utility-first styling and micro-animations |
| **Canvas** | React Flow | Node-based whiteboard, edge rendering, and connection logic |
| **Backend** | Node.js, Express.js | Production-ready RESTful APIs and server routes |
| **Database** | MongoDB, Mongoose | Schema validation, user indexing, and diagram storage |
| **Auth** | Clerk | Multi-tenant user auth, sessions, and webhook dispatch |
| **Security** | Svix Webhook SDK, CORS | Secure, encrypted webhook verification and server origin configuration |
| **Emails** | Resend SDK | Fast SaaS onboarding emails utilizing HTML templates |

---

## 🛰️ System Architecture & Webhook Flow

Below is the execution sequence when a new user registers on SketchOn:

```mermaid
sequenceDiagram
    autonumber
    actor User as New User
    participant Clerk as Clerk Auth
    participant Backend as Express Backend
    participant DB as MongoDB
    participant Resend as Resend API

    User->>Clerk: Registers/Signs up
    Clerk-->>User: Account created successfully
    Clerk->>Backend: POST /api/webhooks/clerk (payload + Svix headers)
    
    Note over Backend: 1. Extract raw body buffer<br/>2. Verify signature via Svix SDK
    
    alt Signature Verification Fails
        Backend-->>Clerk: HTTP 400 Bad Request
    else Signature Verification Succeeds
        Backend->>DB: Check if clerkUserId exists
        alt User has welcomeEmailSent == true (Duplicate)
            Backend-->>Clerk: HTTP 200 OK (Skip duplicate)
        else welcomeEmailSent is false or User record missing
            Backend->>DB: Save/update User details with welcomeEmailSent = false
            Backend->>Resend: sendWelcomeEmail(email, firstName) using templates
            alt Resend Success
                Backend->>DB: Update welcomeEmailSent = true
                Backend-->>Clerk: HTTP 200 OK
            else Resend Failure
                Backend-->>Clerk: HTTP 500 Server Error (Clerk will retry)
            end
        end
    end
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **MongoDB** (Local instance or MongoDB Atlas Connection string)
* **Clerk Developer Keys**
* **Resend API Key**

---

### Environment Setup

Create `.env` files in both the frontend and backend folders.

#### 1. Backend Configuration
Create `backend/.env` with the following variables:
```env
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sketchon
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx       # Obtained from Clerk Dashboard -> Webhooks -> Signing Secret
RESEND_API_KEY=re_xxx
APP_URL=http://localhost:5173
NODE_ENV=development
```

#### 2. Frontend Configuration
Create `frontend/.env` with the following variables:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

---

### Installation & Launch

#### Step 1: Run the Backend
```bash
cd backend
npm install --legacy-peer-deps
npm run dev
```
The server will start on `http://localhost:4000`.

#### Step 2: Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will open on `http://localhost:5173`.

---

## 🔌 API Reference

### Whiteboard Diagrams
* `GET /api/diagrams` - Fetch all diagrams for the authenticated user.
* `POST /api/diagrams` - Save a new diagram layout.
* `GET /api/diagrams/:id` - Fetch details of a specific diagram.
* `PUT /api/diagrams/:id` - Save updates to a diagram's nodes and edges.
* `DELETE /api/diagrams/:id` - Remove a diagram from the collection.

### User Profiles
* `GET /api/users/profile` - Retrieve credits and account plans.
* `POST /api/users/add-credits` - Add test credits to an account (Testing tool).
* `POST /api/users/subscribe` - Toggle subscription plan status (Testing tool).

### Webhooks
* `POST /api/webhooks/clerk` - Endpoint for Clerk authentication webhook events (e.g. `user.created`).

---

## 🔒 Security Practices

1. **Webhook Integrity Verification:** All Clerk webhook payloads are validated using the `svix` library using SHA-256 HMAC cryptographic signatures. 
2. **Idempotence & Duplicate Prevention:** Every processed webhook is logged in the user schema. The backend tracks `welcomeEmailSent` flags to guarantee that users receive exactly one welcome email, even in the event of retry delivery attempts.
3. **CORS Safe Origin Access:** The backend enforces CORS restriction policies, accepting requests only from configured frontend domains.
4. **Environment Encapsulation:** Critical API keys (`RESEND_API_KEY`, `CLERK_SECRET_KEY`) are kept strictly server-side.
