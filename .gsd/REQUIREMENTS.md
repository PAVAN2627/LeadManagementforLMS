# REQUIREMENTS.md

## Format
| ID | Requirement | Source | Status |
|----|-------------|--------|--------|
| REQ-01 | **Serverless Setup**: Configure Vercel Serverless Functions in `/api` with MongoDB connection pooling. | Goal 1 | Pending |
| REQ-02 | **User Model**: Mongoose schema for Users (roles: Admin, Manager, Agent) with password hashing. | Goal 2 | Pending |
| REQ-03 | **Auth API**: Implement `/api/auth/login` returning JWT and `/api/auth/me` for session check. | Goal 2 | Pending |
| REQ-04 | **RBAC Middleware**: Middleware to protect routes based on JWT roles. | Goal 2 | Pending |
| REQ-05 | **Lead Model**: Mongoose schema for Leads including status, notes, and activity history. | Goal 3 | Pending |
| REQ-06 | **Lead CRUD**: APIs for Creating, Reading, Updating, and Deleting leads tailored to role permissions. | Goal 3 | Pending |
| REQ-07 | **Dashboard Stats**: Aggregation pipelines for Admin/Manager/Agent analytics cards. | Goal 3 | Pending |
| REQ-08 | **Email Onboarding**: API trigger to send welcome emails via Resend when Admin adds a user. | Goal 4 | Pending |
| REQ-09 | **Notifications**: Polling-friendly API for fetching unread notifications. | Goal 4 | Pending |
| REQ-10 | **Data Migration**: Script or process to seed initial data from `mockData.ts` to MongoDB. | Goal 3 | Pending |
