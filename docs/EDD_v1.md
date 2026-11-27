# PromptVault - Engineering Design Document (EDD) v1

**Course:** COMP229 - Web Application Development
**Project:** PromptVault - AI Prompt Sharing Platform
**Prepared for:** Project team
**Version:** 1.0
**Date:** November 27, 2026

> This document describes the implementation visible in the project source and the current PR #9 summary. It distinguishes verified local checks from live integration that still requires a configured database.

## 1. Project Overview

### Purpose

PromptVault is a web application for sharing, discovering, and organizing AI prompts for tools such as ChatGPT, Claude, and Gemini. It is built for COMP229 Web Application Development using MongoDB, Express, React, and Node.js.

### Project scope

The current implementation includes a React client, an Express REST API, MongoDB data models, JWT authentication, prompt and category management, a member directory, public member pages, and a protected personal profile.

### User roles

Visitors can browse prompts and member pages. Signed-in members can create prompts and manage their own prompts and accounts. Administrators can manage categories and manage prompts according to server-side authorization rules.

## 2. System Architecture

### Frontend

React 18, React Router, Vite, and Lucide icons. Screens include Explore, Sign In, Sign Up, Prompt Details, Create/Edit Prompt, Account, Admin Categories, Users, Member Details, and My Profile.

### Backend

Node.js and Express using MVC conventions. Authentication, user, prompt, and category routes connect controllers to Mongoose models; middleware provides authentication and validation.

### Database

MongoDB stores User, Prompt, and Category documents. Prompt documents reference their author through userId and their category through categoryId. Password hashes are excluded from normal user query results and JSON responses.

### Deployment

The repository is configured for Netlify. The React app builds to client/dist and the Express API runs as a Netlify Function. The deployed API base path is /api.

## 3. Main Functional Requirements

### Prompt discovery

Visitors and members can browse, search, and open prompt details. Search uses the prompts API with query and category parameters.

### Prompt management

Authenticated members can create prompts and edit or delete their own prompts. Administrators have broader prompt-management permissions enforced by the server.

### Authentication and account

Users can register and sign in with JWT-based API authentication. Members can view/update their profile or delete their account after password confirmation.

### Community pages

The Users page lists members with prompt counts. A member detail page shows public member information and that member's public prompts.

### Personal profile

The protected My Profile page displays the signed-in user's information and prompts, with links to existing prompt edit/delete flows and account settings.

### Category administration

Administrators can list, create, update, and delete categories. The API prevents deleting a category while prompts still use it.

## 4. API Design

### Authentication

POST /api/auth/register and POST /api/auth/login handle account creation and sign-in.

### Users

GET /api/users and GET /api/users/:id are public and return selected public member data and prompts. GET /api/users/profile and GET /api/users/profile/prompts require authentication. PUT and DELETE /api/users/profile update or delete the signed-in user's account.

### Prompts

GET /api/prompts and GET /api/prompts/:id are public. POST /api/prompts requires authentication. PUT and DELETE /api/prompts/:id are restricted to the prompt owner or an administrator.

### Categories

GET /api/categories is public. Category administration endpoints require an administrator.

### Responses

The API returns JSON. Errors include a message and may include field-level details. The health endpoint reports whether the API and database connection are healthy.

## 5. Data and Security Design

### User data

A user has a name, email, password hash, role, and timestamps. Password hashes are stored in the database but excluded from standard query results and JSON responses.

### Prompt data

A prompt has a title, description, content, platform, tags, userId, categoryId, and timestamps. The author is taken from the authenticated request, not trusted from the client body.

### Category data

A category has a unique name and optional description. Prompts reference categories by database ID.

### Security controls

The application uses JWT authentication, password hashing, route-level authorization, input validation, and password confirmation for sensitive account changes. The server re-checks permissions rather than relying only on frontend route guards.

### Configuration

Database connection strings, JWT secrets, and deployment values belong in environment variables and must not be committed.

## 6. User Interface and Accessibility

### Navigation

The navbar provides Explore, Users, Create Prompt, Categories for administrators, My Profile for signed-in users, and Sign In/Sign Up for visitors.

### Responsive layout

Responsive CSS supports member cards, prompt actions, and navigation on smaller screens.

### Accessibility

The interface uses accessible link labels, button titles, status and alert roles, and semantic headings. Decorative icons are hidden from assistive technology where appropriate.

## 7. Testing and Verification

### Frontend tests

Three focused React tests passed: the PromptVault wordmark on Explore, the signed-out Sign In navigation label, and singular/plural prompt counts on the Users page.

### Build and source checks

The client production build passed. Backend JavaScript syntax checks and git diff --check passed.

### Integration limitation

A live API integration run was not performed because it requires a configured MongoDB database and API environment. A successful frontend build does not prove every live API workflow.

## 8. Deployment and Operations

### Local setup

Install dependencies in server and client, configure server/.env with MONGODB_URI and JWT_SECRET, start the API, then start the Vite client in a separate terminal.

### Database setup

Run the category seed script for a fresh database. The optional demo seed script creates sample users and prompts when DEMO_PASSWORD is configured.

### Production setup

Configure MONGODB_URI and JWT_SECRET in Netlify environment variables, deploy the site, and verify /api/health. Netlify routes /api requests to the server function.

### Operational safeguards

Do not commit .env files, credentials, tokens, node_modules, or build output. Review pull requests and run the application before merging to main.

## 9. Known Gaps and Next Steps

### Official team logo

The repository contains docs/logo/.gitkeep but no official team logo artwork. Current branding uses the PromptVault wordmark; add the approved logo when the team supplies the asset.

### Wireframes and screenshots

The repository has placeholder folders for wireframes and screenshots. Add approved design artifacts and evidence from the running application.

### Live integration test

Configure a test MongoDB database and verify registration, sign-in, prompt CRUD, category administration, member pages, profile updates, and account deletion end to end.

### Pull request review

PR #9 is open and unmerged in the last checked repository state. Obtain teammate review and resolve any merge conflicts before merging.

## 10. References

- Repository: https://github.com/Jude-Anandaraj/PromptVault
- Pull request #9: https://github.com/Jude-Anandaraj/PromptVault/pull/9
- Project API contract: `docs/api-contract.md`
- Setup instructions: root `README.md`, `client/README.md`, and `server/README.md`
