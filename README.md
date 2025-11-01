SLOT SWAPPER

A full-stack web application that lets users mark calendar events as swappable, browse other user's swappable slots, and request swaps. Built with Django + Django REST Framework (backend) and React (Vite) + Tailwind CSS (frontend). Authentication uses JWT (djangorestframework-simplejwt).

It enables users to:

-View and manage their personal events.

-Mark events as swappable or busy.

-Browse other users’ available slots in a marketplace view.

-Send and respond to swap requests in real time.

Built with React (frontend) and Django REST Framework (backend), the app demonstrates authentication, CRUD operations, protected APIs, and dynamic UI updates.

** Tech Stack

| Layer           | Technology Used                    |
| --------------- | ---------------------------------- |
| Frontend        | React.js (Vite) + Tailwind CSS     |
| Backend         | Django + Django REST Framework     |
| Database        | SQLite (default, easy local setup) |
| Authentication  | JWT (Simple JWT)                   |
| API Testing     | Postman                            |
| Version Control | Git + GitHub                       |


** Overview & design choices

## What it does (brief):

-Users sign up / log in (JWT).

-Each user manages events (title, start_time, end_time, status).

-Events can be BUSY, SWAPPABLE, or SWAP_PENDING.

-Users browse a marketplace of other users' SWAPPABLE slots and request swaps by offering one of their own SWAPPABLE slots.

-Requests are PENDING until receiver ACCEPTs or REJECTs. On accept, owners of the two events swap and both events become BUSY.

## Design choices:

-Django + DRF: quick, structured APIs and admin for verifying data.

-djangorestframework-simplejwt: stateless, standard JWT flows.

-React (Vite) + Tailwind: lightweight, fast dev, and easy responsive UI.

-Single combined repository (frontend + backend) for easier submission/testing.

**Design Decisions

-JWT Authentication: for secure, stateless communication between frontend and backend.

-React Context: for global state management of authentication.

-Axios Interceptors: to automatically attach JWT tokens to every request.

-Tailwind CSS: for consistent and responsive UI.

-Django ORM: for clean and reliable database interactions.

** Repository layout
slot-swapper/
├──slot-swap-backend    # Django project (manage.py, settings, api app)   
│   ├── manage.py
│   |── api
|   
├── slot-swap-frontend              # React app (Vite, Tailwind)
│   └── src/
│       ├── api/
│       ├── context/
│       ├── pages/
│       └── components/
└── README.md    


**Local setup — Backend (Django)
Open a terminal and follow these steps from project root (slot-swapper/slot-swap-backend):
1.Create & activate virtualenv

2.Install dependencies

3.Configure settings
-Ensure settings.py

4.Run migrations
-python manage.py makemigrations
-python manage.py migrate

5.Create superuser
python manage.py createsuperuser

6.Run the backend server
python manage.py runserver 

**Local setup — Frontend (React + Vite + Tailwind)
Open a second terminal in slot-swapper/slot-swap-frontend:
1.Install node modules
-cd frontend
-npm install

2.Ensure src/api/axios.js has correct base URL:
-export const API_BASE = "http://127.0.0.1:8000/api";

3.Start dev server
-npm run dev

**Running both together
1.Start Django backend:
-cd slot-swap-backend
-python manage.py runserver

2.Start frontend:
-cd slot-swap-frontend
-npm run dev

-Open your browser at http://localhost:5173/, sign up and log in. Make sure backend is up — otherwise API calls fail.

**API endpoints (summary)

All endpoints assume base http://127.0.0.1:8000/api/

## Authentication

| Endpoint          | Method | Body                                  | Returns                                |
| ----------------- | -----: | ------------------------------------- | -------------------------------------- |
| `/register/`      |   POST | `{ "username", "email", "password" }` | `{"detail":"User created"}`            |
| `/token/`         |   POST | `{ "username", "password" }`          | `{ "access": "...", "refresh":"..." }` |
| `/token/refresh/` |   POST | `{ "refresh": "..." }`                | `{ "access": "..." }`                  |


## Events (EventViewSet)
| Endpoint             | Method | Protected? | Notes                                                                       |
| -------------------- | -----: | ---------: | --------------------------------------------------------------------------- |
| `/events/`           |    GET |        Yes | List events for current user                                                |
| `/events/`           |   POST |        Yes | Create event: `title, start_time, end_time, status` (owner set server-side) |
| `/events/{id}/`      |    GET |        Yes | Retrieve event (must own it to edit)                                        |
| `/events/{id}/`      |  PATCH |        Yes | Partial update, e.g., `{ "status": "SWAPPABLE" }`                           |
| `/events/{id}/`      | DELETE |        Yes | Delete event                                                                |
| `/events/swappable/` |    GET |        Yes | Return other users' slots with status `SWAPPABLE`                           |

## Swap Requests (SwapRequestViewSet)

| Endpoint                       | Method | Protected? | Notes                                                                             |
| ------------------------------ | -----: | ---------: | --------------------------------------------------------------------------------- |
| `/swap-requests/`              |    GET |        Yes | List incoming & outgoing for current user                                         |
| `/swap-requests/create_swap/`  |   POST |        Yes | Create request: `{ "mySlotId": id, "theirSlotId": id }`                           |
| `/swap-requests/{id}/respond/` |   POST |        Yes | Respond: `{ "accepted": true/false }` — accepts swaps and performs owner exchange |


**Example requests (curl / JSON)

1.Obtain token
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"pass123"}'

2.Create an event
curl -X POST http://127.0.0.1:8000/api/events/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"title":"Team Meeting","start_time":"2025-11-01T10:00:00Z","end_time":"2025-11-01T11:00:00Z","status":"BUSY"}'

3.Get marketplace swappable slots
curl -X GET http://127.0.0.1:8000/api/events/swappable/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

4.Create swap request
curl -X POST http://127.0.0.1:8000/api/swap-requests/create_swap/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"mySlotId": 5, "theirSlotId": 2}'

5.Respond to swap request (accept)
curl -X POST http://127.0.0.1:8000/api/swap-requests/1/respond/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"accepted": true}'

**Postman collection
I recommend exporting a Postman collection with the endpoints above for easy testing.

**Features by Page 

🏠 Home Page

Simple landing page introducing Slot Swapper.

Navigation to Login / Signup.

🔑 Authentication

Sign Up form for new users.

Login form with JWT-based authentication.

📅 Dashboard

Displays all events owned by the logged-in user.

Allows creating, viewing, and updating event statuses.

Toggle button to mark an event as Swappable or Busy.

🛍️ Marketplace

Lists all available Swappable slots from other users.

Allows the logged-in user to request swaps by selecting one of their own available slots.

🔔 Notifications / Requests

Displays:

Incoming Requests: from other users (with Accept/Reject buttons).

Outgoing Requests: swaps initiated by the current user (shows status).

🚪 Logout

Clears JWT tokens and redirects to the login page.


**Assumptions & decisions
-JWT access and refresh token keys stored in localStorage as access and refresh.

-Events are created server-side with owner = request.user (frontend must not set owner).

-Endpoint base path: /api/ 

-Default database: SQLite for local testing.

-SWAP_PENDING prevents double-offers while a swap is processed.


👩‍💻 Author

Name:Pariveda Cherishma
Email:parivedac@gmail.com

