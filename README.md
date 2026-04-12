# MentorAI — AI-Powered Mentorship Platform

## Try it live

> **[Open MentorAI live website →](https://pashu28.github.io/mentorship-webapp/)**  


---

MentorAI connects mentees with expert mentors through intelligent AI matching, live video sessions with real-time AI transcription, and post-session synthesis. The platform guides users from onboarding through a structured learning journey with an AI tutor and progress tracking dashboard.

---

## Tech Stack

- **React 19** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool & dev server
- **Tailwind CSS** — Utility-first styling
- **React Router v7** — Client-side routing
- **Recharts** — Data visualization
- **i18next** — Internationalization
- **Lucide React** — Icon library

---

## Prerequisites

Make sure you have the following installed before getting started:

- [Node.js](https://nodejs.org/) **v18 or higher**
- [npm](https://www.npmjs.com/) **v9 or higher** (comes with Node.js)

To verify your versions:

```bash
node -v
npm -v
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:pashu28/mentorship-webapp.git
cd mentorship-webapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The app will be running at **[http://localhost:3000](http://localhost:5173)** by default.

---

## Available Scripts


| Command              | Description                                        |
| -------------------- | -------------------------------------------------- |
| `npm run dev`        | Start the local development server with hot reload |
| `npm run build`      | Build the app for production (outputs to `dist/`)  |
| `npm run preview`    | Preview the production build locally               |
| `npm run lint`       | Run ESLint to check for code issues                |
| `npm run type-check` | Run TypeScript type checking without building      |


---

## Project Structure

```
mentorai/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── base/               # Reusable base UI components (buttons, inputs, cards)
│   │   └── feature/            # Shared feature components (navbar, layout)
│   ├── hooks/                  # Custom React hooks
│   ├── i18n/                   # Internationalization config & locale files
│   ├── mocks/                  # Mock data files (used in place of a backend)
│   ├── pages/
│   │   ├── auth/               # Login / Signup page
│   │   ├── intake/             # Intake form (resume upload + goals)
│   │   ├── profile-summary/    # AI-generated profile summary
│   │   ├── smart-match/        # Smart mentor matching
│   │   ├── video-room/         # Live video session with AI scribe
│   │   ├── session-summary/    # Post-session summary & resources
│   │   ├── dashboard/          # Daily dashboard + AI tutor
│   │   ├── find-mentor/        # Browse & search mentors
│   │   ├── resources/          # Resource vault
│   │   ├── task-dashboard/     # Task & milestone tracker
│   │   ├── tutor/              # AI tutor chat
│   │   ├── profile/            # User profile & settings
│   │   └── meeting-lobby/      # Pre-session lobby
│   ├── router/
│   │   ├── config.tsx          # Route definitions
│   │   └── index.ts            # Router setup (do not modify)
│   ├── App.tsx                 # Root app component
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles
├── index.html                  # HTML entry point
├── tailwind.config.ts          # Tailwind CSS configuration
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## Page Routes


| Route              | Page                            |
| ------------------ | ------------------------------- |
| `/`                | Authentication (Login / Signup) |
| `/intake`          | Intake Form                     |
| `/profile-summary` | AI Profile Summary              |
| `/smart-match`     | Smart Mentor Match              |
| `/video-room`      | Live Video Room                 |
| `/session-summary` | Session Summary                 |
| `/dashboard`       | Daily Dashboard                 |
| `/find-mentor`     | Find a Mentor                   |
| `/resources`       | Resource Vault                  |
| `/task-dashboard`  | Task Dashboard                  |
| `/tutor`           | AI Tutor Chat                   |
| `/profile`         | User Profile & Settings         |
| `/meeting-lobby`   | Meeting Lobby                   |


---

## Mock Data

This project currently runs entirely on **mock data** — no backend or database connection is required. All mock data lives in `src/mocks/` and is imported directly into components.

When a real backend (Supabase) is connected in a future phase, the mock data files will be replaced with live API calls.

---

## Future Integrations (Phase 3)

- **Supabase** — Authentication, database, and storage
- **OpenAI API** — Real AI matching, transcription, and tutor responses (via Supabase Edge Functions)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.