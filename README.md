<p align="center">
  <img src="frontend/public/logo.png" alt="Sketch On Logo" width="80" height="80" style="border-radius: 16px;" />
</p>

<h1 align="center">Sketch On — AI-Powered System Design Whiteboard</h1>

<p align="center">
  <strong>Design, visualize, and analyze system architectures with AI-powered feedback.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Clerk-Auth-purple?logo=clerk" alt="Clerk" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Status-Beta-orange" alt="Beta" />
</p>

---

## Introduction

**Sketch On** is a full-stack web application that lets developers and architects design High-Level Design (HLD) diagrams on an interactive whiteboard canvas — then get instant, AI-powered analysis of their system architecture.

Whether you're preparing for a system design interview, planning a new microservice architecture, or documenting an existing system, Sketch On provides the tools to sketch it out and get actionable feedback from AI in seconds.

**Live Demo:** [https://sketchon.app](https://sketchon.app)

---

## Motive

System design is a critical skill for software engineers, yet most whiteboard tools are either too complex or lack intelligent feedback. Sketch On was built to solve this gap:

- **Interview Prep** — Practice system design questions with instant AI review, just like having a senior architect beside you.
- **Quick Prototyping** — Rapidly sketch architectures with drag-and-drop components and real tech icons (AWS, Docker, Kubernetes, etc.).
- **Learning Tool** — Understand bottlenecks, missing components, and scalability issues through AI-generated analysis.
- **Collaboration** — Save and manage multiple diagrams in a personal dashboard.

---

## Features

### Canvas & Diagramming

- **Drag-and-drop canvas** powered by React Flow — add nodes, draw edges, pan, and zoom freely.
- **4 Shape types** — Rectangle, Circle, Diamond, and Text Box nodes for building any diagram style.
- **34+ Tech icons** — Pre-built icons for popular technologies including:
  - **Cloud:** AWS, Azure, CloudFront, EC2, S3, Lambda
  - **Databases:** MongoDB, PostgreSQL, MySQL, Redis, Cassandra, DynamoDB, SQL Server
  - **Backend:** Node.js, Express.js, Spring, GraphQL, Nginx
  - **Frontend:** React, Redux, JavaScript
  - **DevOps:** Docker, Kubernetes, VMware
  - **Infra:** Load Balancer, Firewall, DNS, RabbitMQ, Server
  - **Auth:** JWT, User
- **Icon search** — Quickly filter and find icons by name or keyword.
- **Editable labels** — Double-click any node to rename it directly on the canvas.
- **Auto-save** — Diagrams are automatically saved to the cloud as you work.
- **Manual save** with visual status indicator (saved / saving / unsaved).

### AI Analysis

- **One-click AI review** — Analyzes your architecture and returns structured feedback covering:
  - Architecture Summary
  - Strengths
  - Bottlenecks
  - Missing Components
  - Scalability Improvements
  - Reliability Improvements
  - Performance Optimizations
  - Security Improvements
  - Interview Feedback
  - Suggested Components to Add
- **Multi-model fallback** — Automatically tries cheaper AI models if the primary one fails (Gemini Flash → LLaMA → Claude Haiku).
- **Slide-out analysis panel** with categorized, color-coded sections.

### Dashboard & Projects

- **Personal dashboard** — View, manage, rename, and delete all your saved diagrams.
- **Project metadata** — See node/edge counts, creation date, and last modified timestamps.
- **Create new projects** with a title modal.
- **Load existing projects** from the dashboard directly into the canvas.

### Authentication

- **Clerk-powered auth** — Secure sign-in/sign-up with email, Google, GitHub, and more.
- **Dark-themed auth UI** using Clerk's dark theme.
- **Protected routes** — Dashboard, canvas, and AI endpoints require authentication.

### UI & UX

- **Fully responsive** — Works on desktop, tablet, and mobile.
- **Dark theme throughout** — Sleek neutral-950 dark mode design.
- **Framer Motion animations** — Smooth transitions, hover effects, and page animations.
- **Landing page** with animated feature carousel, stats counter, testimonials, and how-to-use guide.
- **Pricing page** (under development).

---

## Tech Stack

### Frontend

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| **React 19**       | UI framework                  |
| **Vite 7**         | Build tool & dev server       |
| **React Flow 11**  | Interactive node-based canvas |
| **Tailwind CSS 4** | Utility-first styling         |
| **Framer Motion**  | Animations & transitions      |
| **React Router 7** | Client-side routing           |
| **Clerk React**    | Authentication UI components  |
| **React Icons**    | Icon library                  |
| **React CountUp**  | Animated number counters      |

### Backend

| Technology               | Purpose                       |
| ------------------------ | ----------------------------- |
| **Node.js 18+**          | Runtime environment           |
| **Express 5**            | Web framework & REST API      |
| **MongoDB + Mongoose 9** | Database & ODM                |
| **Clerk SDK**            | Server-side auth verification |
| **Anthropic SDK**        | AI integration (Claude)       |
| **OpenRouter API**       | AI model routing & fallback   |

### Infrastructure & Services

| Service                    | Purpose                                   |
| -------------------------- | ----------------------------------------- |
| **MongoDB Atlas**          | Cloud database                            |
| **Clerk**                  | Authentication & user management          |
| **OpenRouter / Anthropic** | AI analysis (Gemini Flash, LLaMA, Claude) |
| **Render**                 | Backend hosting                           |
| **Netlify / Render**       | Frontend hosting                          |

---

## Project Structure

```
Whiteboard Ai/
├── README.md
├── package.json                  # Root dependencies
│
├── backend/
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   ├── .env                      # Environment variables (local)
│   ├── .env.production           # Production env template
│   ├── config/                   # DB & app configuration
│   ├── controller/
│   │   ├── aiController.js       # AI analysis logic & OpenRouter integration
│   │   └── diagramController.js  # CRUD operations for diagrams
│   ├── middleware/
│   │   └── clerkAuth.js          # Clerk JWT verification middleware
│   ├── routes/
│   │   ├── aiRoutes.js           # POST /api/ai/analyze
│   │   ├── diagramRoutes.js      # CRUD /api/diagrams
│   │   └── debugRoutes.js        # Debug/health endpoints
│   └── schema/
│       └── diagram.js            # Mongoose schema for diagrams
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env                      # Frontend env variables (local)
│   ├── .env.production           # Production env template
│   ├── public/
│   │   ├── _redirects            # Netlify SPA redirect rules
│   │   └── icons/                # 34+ tech icon PNGs
│   └── src/
│       ├── App.jsx               # Router & route definitions
│       ├── main.jsx              # Clerk provider & app entry
│       ├── index.css             # Global styles
│       ├── components/
│       │   ├── Hero.jsx          # Landing page hero section
│       │   ├── AiAnalysisPanel.jsx  # AI results slide-out panel
│       │   ├── CanvasSurface.jsx    # React Flow canvas wrapper
│       │   ├── IconSelectorModal.jsx
│       │   ├── ProjectTitleModal.jsx
│       │   ├── BetaPopup.jsx
│       │   ├── Footer.jsx
│       │   ├── HowToUse.jsx
│       │   ├── Reviews.jsx
│       │   └── nodes/            # Custom React Flow node types
│       │       ├── RectangleNode.jsx
│       │       ├── CircleNode.jsx
│       │       ├── DiamondNode.jsx
│       │       ├── TextNode.jsx
│       │       └── IconNode.jsx
│       ├── data/
│       │   └── icons.js          # Icon definitions & search utility
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Pricing.jsx
│       │   ├── HowToUse.jsx
│       │   └── SketchPage/
│       │       ├── CanvasPage.jsx  # Main canvas page with AI integration
│       │       └── Sidebar.jsx     # Shapes, icons & project info panel
│       └── services/
│           ├── diagramService.js   # API client for all backend calls
│           └── apiUtils.js         # Loading state manager
```

---

## API Endpoints

### Diagrams (requires authentication)

| Method   | Endpoint            | Description                                 |
| -------- | ------------------- | ------------------------------------------- |
| `GET`    | `/api/diagrams`     | Get all diagrams for the authenticated user |
| `GET`    | `/api/diagrams/:id` | Get a single diagram by ID                  |
| `POST`   | `/api/diagrams`     | Create a new diagram                        |
| `PUT`    | `/api/diagrams/:id` | Update an existing diagram                  |
| `DELETE` | `/api/diagrams/:id` | Delete a diagram                            |

### AI Analysis (requires authentication)

| Method | Endpoint          | Description                                                   |
| ------ | ----------------- | ------------------------------------------------------------- |
| `POST` | `/api/ai/analyze` | Analyze a diagram with AI — accepts `{ title, nodes, edges }` |

### Health & Debug

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| `GET`  | `/`                 | API status                |
| `GET`  | `/health`           | Health check              |
| `GET`  | `/api/debug/config` | Server configuration info |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier works)
- **Clerk** account ([clerk.com](https://clerk.com))
- **OpenRouter** API key ([openrouter.ai](https://openrouter.ai)) or **Anthropic** API key

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/whiteboard-ai.git
cd whiteboard-ai
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment Variables

**Backend** — Create `backend/.env`:

```env
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/sketchon?retryWrites=true&w=majority
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NODE_ENV=development

# AI Configuration (choose one)
# Option A: OpenRouter key (recommended — supports multiple models)
ANTHROPIC_API_KEY=sk-or-v1-your_openrouter_key
OPENROUTER_MODEL=google/gemini-2.0-flash-001

# Option B: Anthropic key (Claude only)
# ANTHROPIC_API_KEY=sk-ant-your_anthropic_key
```

**Frontend** — Create `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:4000/api
```

### 4. Run the Application

```bash
# Terminal 1 — Start backend
cd backend
npm run dev

# Terminal 2 — Start frontend
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:4000`.

---

## Configuration Reference

### Backend Environment Variables

| Variable            | Required | Description                                                     |
| ------------------- | -------- | --------------------------------------------------------------- |
| `PORT`              | No       | Server port (default: 4000)                                     |
| `MONGODB_URI`       | Yes      | MongoDB Atlas connection string                                 |
| `CLERK_SECRET_KEY`  | Yes      | Clerk secret key for JWT verification                           |
| `NODE_ENV`          | No       | `development` or `production`                                   |
| `ANTHROPIC_API_KEY` | Yes      | OpenRouter (`sk-or-v1-...`) or Anthropic (`sk-ant-...`) API key |
| `OPENROUTER_MODEL`  | No       | Default AI model (default: `google/gemini-2.0-flash-001`)       |

### Frontend Environment Variables

| Variable                     | Required | Description                            |
| ---------------------------- | -------- | -------------------------------------- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Yes      | Clerk publishable key                  |
| `VITE_API_BASE_URL`          | No       | Backend API URL (auto-detected in dev) |

---

## Deployment

### Backend (Render)

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set the following:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add all environment variables from the table above in the Render dashboard.

### Frontend (Netlify or Render)

**Netlify:**

1. Create a new site on [Netlify](https://netlify.com).
2. Connect your GitHub repository.
3. Set the following:
   - **Base Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `frontend/dist`
4. Add environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY` — your production Clerk publishable key
   - `VITE_API_BASE_URL` — your Render backend URL (e.g., `https://your-app.onrender.com/api`)

> The `frontend/public/_redirects` file is pre-configured for Netlify SPA routing.

### CORS Configuration

The backend CORS whitelist in `server.js` includes:

- `http://localhost:5173` (Vite dev)
- `http://localhost:5174`
- `https://sketchon.app` & `https://www.sketchon.app`
- `https://sketchon.onrender.com`

Add your custom domain to the CORS `origin` array if deploying elsewhere.

---

## AI Model Configuration

Sketch On uses **OpenRouter** for AI analysis with automatic model fallback:

| Priority | Model                                   | Cost       | Notes                               |
| -------- | --------------------------------------- | ---------- | ----------------------------------- |
| 1        | `google/gemini-2.0-flash-001`           | Very cheap | Default — recommended for free tier |
| 2        | `meta-llama/llama-3.1-8b-instruct:free` | Free       | Fallback if credits run out         |
| 3        | `anthropic/claude-3.5-haiku`            | Cheap      | Quality fallback                    |

If the primary model returns a **402** (insufficient credits), the system automatically retries with the next cheapest model. This ensures the AI feature remains functional even on free-tier OpenRouter accounts.

To use a different default model, set `OPENROUTER_MODEL` in your `.env`:

```env
OPENROUTER_MODEL=anthropic/claude-3.7-sonnet
```

---

## Screenshots

<img width="1901" height="865" alt="Screenshot 2026-03-06 003516" src="https://github.com/user-attachments/assets/1db155d3-8939-4bdc-90df-2818d8f5ed73" />
<img width="1902" height="870" alt="Screenshot 2026-03-06 003430" src="https://github.com/user-attachments/assets/19d76caf-21a5-4ddc-88f7-5785a4abfac3" />
<img width="1918" height="865" alt="Screenshot 2026-03-06 003358" src="https://github.com/user-attachments/assets/98e0464e-7f9b-4c2b-9352-1809037a0e89" />
<img width="1903" height="870" alt="Screenshot 2026-03-06 003106" src="https://github.com/user-attachments/assets/4630a2ff-e34b-4cce-bbfc-2551c36debcb" />


---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is open-source. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with care by <strong>Subhransu</strong><br/>
  <sub>Sketch On — Design. Analyze. Ship.</sub>
</p>
