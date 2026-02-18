# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
To transform the current Lead Management System (LMS) frontend prototype into a production-ready, full-stack application powered by Vercel Serverless Functions and MongoDB. The system will serve as a secure, centralized hub for Admins, Managers, and Agents to manage leads efficiently, featuring role-based access control (RBAC), real-time data handling, and automated email onboarding.

## Goals
1.  **Serverless Architecture**: Establish a robust backend using Vercel Serverless Functions (`/api`), MongoDB (Mongoose), and TypeScript within a single repository.
2.  **Secure Authentication**: Implement JWT-based authentication (sign-up/login) with encrypted password storage and strict role-based access control (Admin, Manager, Agent).
3.  **Data Persistence**: Replace all static `mockData.ts` with live MongoDB operations for Users, Leads, Activities, and Notifications.
4.  **Operational Features**: Implement automated email onboarding via Resend and a polling-based notification system for real-time updates.

## Non-Goals (Out of Scope)
- **Separate Backend Repo**: The backend will live within the frontend repository (Monorepo/Single Repo structure).
- **Express.js Server**: Pure serverless functions will be used; no long-running server processes.
- **WebSockets**: Real-time updates will be handled via polling, not WebSockets.

## Users
- **Admin**: Full system access; manages users, views all leads, and oversees system performance.
- **Manager**: Oversees assigned agents and leads; accesses team performance reports.
- **Agent**: Manages assigned leads; updates lead status and adds notes.

## Constraints
- **Stack**: React (UI), Vercel Serverless (API), MongoDB Atlas (DB), TypeScript.
- **Validation**: Zod schemas for all API inputs.
- **Deployment**: Vercel (Frontend & Serverless Functions).
- **Time**: Production-ready code quality is prioritized over speed.

## Success Criteria
- [ ] Users can log in with valid credentials and receive a JWT.
- [ ] Admin creation of a new user triggers an automated welcome email via Resend.
- [ ] All dashboards (Admin/Manager/Agent) load and display real data from MongoDB, replacing `mockData.ts`.
- [ ] Polling mechanism updates notifications and lead changes near-instantly.
- [ ] TypeScript build passes with zero errors and strict type safety across the stack.
