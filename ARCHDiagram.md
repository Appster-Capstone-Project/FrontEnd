
# TiffinBox Application Architecture

This document outlines the architecture of the TiffinBox web application. It's designed to be simple, scalable, and maintainable, leveraging modern web technologies.

## Architectural Diagram (Text-Based)

Here is a visual representation of how the different parts of the system interact.

```
+----------------------+       +-------------------------+       +-------------------------+
|                      |       |                         |       |                         |
|   User's Browser     |------>|    Next.js Frontend     |<----->|      Backend API        |
|  (Client/PWA)        |       |   (This Project)        |       | (Your IP: 172.191.11.228) |
|                      |       |                         |       |                         |
+-----------+----------+       +------------+------------+       +------------+------------+
            |                               |                           |
            | User interacts with UI        | Next.js server handles    | Manages all business
            | (e.g., clicks buttons,        | page rendering and API    | logic, data storage,
            | fills forms).                 | proxying.                 | and user authentication.
            |                               |                           |
            |                               |                           |
+-----------v-------------------------------v---------------------------v-----------------+
|                                                                                         |
|  Key Components & Data Flow:                                                            |
|                                                                                         |
|  1. User & Client (Browser/PWA)                                                         |
|     - The user interacts with the application through their web browser.                 |
|     - The UI is built with React, Next.js, and shadcn/ui components.                     |
|     - All interactions, like signing in, viewing dishes, or placing an order, start here.|
|                                                                                         |
|  2. Next.js Frontend (This Project in Firebase Studio)                                  |
|     - **Framework**: Next.js handles both server-side rendering (for fast initial loads) |
|       and client-side rendering (for dynamic updates).                                   |
|     - **UI Components**: Reusable components (`/src/components`) create a consistent     |
|       user experience.                                                                   |
|     - **Routing**: The `src/app` directory (App Router) defines all the pages and routes,|
|       like `/dashboard`, `/sell`, and `/vendors/[id]`.                                   |
|     - **API Proxy**: The `next.config.ts` file is configured with a rewrite rule.        |
|       Any request from the client to `/api/...` is automatically and securely proxied    |
|       to your backend server. This avoids CORS issues and hides the backend IP from      |
|       the public.                                                                        |
|     - **State Management**: React Context (`/src/context/CartContext.tsx`) is used for   |
|       managing global state like the shopping cart.                                      |
|                                                                                         |
|  3. Backend API (Running on 172.191.11.228)                                             |
|     - **Business Logic**: This is the "brain" of your application. It handles user       |
|       registration, login, order processing, and managing listings (dishes).             |
|     - **Database Interaction**: The backend is responsible for all communication with    |
|       the database (not pictured) where users, listings, and orders are stored.          |
|     - **Authentication**: It issues JWT tokens upon successful login, which are then used|
|       to secure all other API endpoints.                                                 |
|     - **REST Endpoints**: Provides a clear API for the frontend, with endpoints like:    |
|       - `POST /sellers/register`                                                         |
|       - `POST /users/login`                                                              |
|       - `GET /listings`                                                                  |
|       - `POST /orders`                                                                   |
|                                                                                         |
+-----------------------------------------------------------------------------------------+

```

## Summary of Flow

1.  A user visits the TiffinBox application.
2.  The Next.js server renders the initial page and sends it to the browser.
3.  The user browses vendors and dishes. When data is needed (e.g., fetching all vendors), the frontend client makes a request to a local path like `/api/sellers`.
4.  The Next.js `rewrites` feature proxies this request to `http://172.191.11.228:8000/sellers`.
5.  The backend API processes the request, fetches data from the database, and returns a JSON response.
6.  The Next.js server forwards this JSON response back to the frontend client.
7.  The client receives the data and updates the UI to display the information.

This architecture separates the frontend presentation layer from the backend business logic, which is a very common and effective pattern for building modern web applications.

Good luck with your presentation!
