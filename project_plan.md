# MentorAI - AI-Powered Mentorship Web App

## 1. Project Description
MentorAI is an AI-powered mentorship platform that connects mentees with expert mentors through intelligent matching, live video sessions with real-time AI transcription, and post-session synthesis. The platform guides users from onboarding through a structured learning journey with an AI tutor and progress tracking dashboard.

**Target Users:** Career changers, early-career professionals, and anyone seeking structured mentorship.
**Core Value:** Remove friction from mentorship — AI handles matching, note-taking, and learning path creation so humans can focus on connection.

## 2. Page Structure
- `/` - Authentication (Login / Signup)
- `/intake` - Intake Form (Resume upload + goals)
- `/profile-summary` - AI Profile Summary (parsed resume + AI insights)
- `/smart-match` - Smart Mentor Match (3 mentor cards)
- `/video-room` - In-App Video Room (live session + AI scribe)
- `/session-summary` - Session Summary (resource vault + roadmap)
- `/dashboard` - Daily Dashboard + AI Tutor Chat

## 3. Core Features
- [ ] Authentication (Login / Signup UI)
- [ ] Resume drag-and-drop upload + goal input
- [ ] AI Profile Summary display (parsed data + AI cards)
- [ ] Smart Mentor Match with booking overlay
- [ ] Live video room with collapsible AI scribe sidebar
- [ ] Session summary with resource vault and priority to-do list
- [ ] Daily dashboard with goal rings, roadmap, and quick actions
- [ ] AI Tutor chat slide-in panel with task completion flow

## 4. Data Model Design
(No Supabase connected — using mock data for all screens)

### Mock Data Entities
- User profile (name, role, experience, tech stack)
- AI analysis (strengths, gaps, proposed focus)
- Mentor profiles (photo, name, role, company, match reason)
- Session transcript (speaker, text, timestamp)
- Resource vault items (title, url, favicon)
- To-do tasks (step, title, subtasks)
- Goal rings (label, percentage)

## 5. Backend / Third-party Integration Plan
- Supabase: Not connected (future: auth, data storage)
- Shopify: Not needed
- Stripe: Not needed
- AI/LLM: Simulated with mock data (future: OpenAI API via edge functions)

## 6. Development Phase Plan

### Phase 1: All Core Screens (UI)
- Goal: Build all 7 screens with full UI, mock data, and navigation
- Deliverable: Complete clickable prototype of the full user journey

### Phase 2: Interactivity & Animations
- Goal: Add micro-interactions, animations, and state transitions
- Deliverable: Polished, production-ready UI with smooth flows

### Phase 3: Backend Integration (Future)
- Goal: Connect Supabase for auth and data, integrate AI APIs
- Deliverable: Fully functional app with real data
