# Anime Tracker ⛩️

A modern, full-stack web application built to help users search, discover, and track their favorite anime. Built using React (Vite), Tailwind CSS, the public Jikan API, and a secure Supabase backend.

## Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, Context API
* **Backend:** Supabase (PostgreSQL, Authentication)
* **External API:** Jikan API (MyAnimeList)

## Development Journey & Overcoming Challenges

This project was built utilizing an AI-assisted "vibe coding" workflow. While this allowed for rapid development, it required strict oversight to ensure production-level security and performance[cite: 1]. Here is how we planned the app and the major challenges we resolved:

### 1. Choosing the Backend Architecture
During the planning phase, we evaluated three distinct ways to build a backend: a NoSQL Backend-as-a-Service, a Custom Full-Stack Server, and a SQL Database-as-a-Service[cite: 2]. We ultimately chose Supabase (SQL DBaaS) for its powerful relational data structures[cite: 2]. *(Note: We also explored using agentic platforms like Google Antigravity, which can be used to autonomously build a custom backend server from scratch[cite: 2].)*

### 2. The "403 Forbidden" Bouncer
**The Problem:** When we first wired up the database, saving new anime was completely blocked by a 403 Forbidden error[cite: 2]. 
**The Solution:** The database wasn't actually broken; Supabase's Row Level Security (RLS) was turned on and acting as a strict bouncer[cite: 2]. We resolved this by writing explicit SQL policies to safely unlock access for authenticated users[cite: 2]. 

### 3. Preventing AI "Error Swallowing" & Insecure Shortcuts
**The Problem:** Because an AI's default instinct is to optimize for making the code work, it will often take shortcuts, like turning off security checks or swallowing errors using a simple `console.log(e)`[cite: 1].
**The Solution:** We set firm boundaries and guardrails before coding[cite: 1]. We enforced the use of environment variables, mandated that raw database errors were never returned to the frontend, and required the AI to write robust RLS policies instead of just bypassing them[cite: 1].

### 4. Hallucinated Dependencies & Red Team Audits
**The Problem:** Vibe coding moves incredibly fast, which can introduce silent vulnerabilities or prompt the AI to import fake NPM packages[cite: 1].
**The Solution:** We required the AI to verify every external library to keep the dependency tree small and secure[cite: 1]. Furthermore, we ran simulated "Red Team" security audits to check for missing client-side input validation and to ensure strict object-level authorization (preventing User A from accessing User B's data)[cite: 1].

## Getting Started (Local Development)
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file and add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Run `npm run dev` to start the local server.
