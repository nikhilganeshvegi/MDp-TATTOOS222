# Black Needle Tattoo Studio - Real Appointment Booking System

A real full-stack appointment booking system designed for a single-artist tattoo studio with real-time slot generation, break collision detection, weekend restriction, and atomic pre-save database conflict prevention.

## Tech Stack
- **Frontend**: React 18, Vite, Lucide Icons, Modern CSS
- **Backend**: Node.js, Express (ES Modules)
- **Database**: MongoDB (via Mongoose and `process.env.MONGODB_URI`)
- **API**: RESTful endpoints

---

## Studio Business Rules
- **Artist Capacity**: 1 resident tattoo artist only
- **Working Days**: Monday to Friday (Saturday & Sunday are closed holidays)
- **Studio Hours**: 9:00 AM – 9:00 PM
- **Artist Break**: 12:00 PM – 1:00 PM (Strictly protected; no appointments can overlap this window)
- **Zero Double-Booking**: No two appointments can overlap in any capacity
- **Slot Generation**: 1-hour candidate intervals (09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00). Unavailable slots remain visible but blurred and disabled with specific conflict reasons.

---

## Tattoo Catalog & Estimated Durations
| Duration | Tattoo Styles |
| :--- | :--- |
| **1 Hour** | Small Tattoo, Minimalist Tattoo, Fine Line Tattoo, Lettering / Name, Small Symbol |
| **2 Hours** | Traditional Tattoo, Blackwork Tattoo, Dotwork Tattoo, Geometric Tattoo, Mandala Tattoo, Ornamental Tattoo, Watercolor Tattoo, Anime Tattoo |
| **3 Hours** | Neo-Traditional Tattoo, Realism Tattoo, Portrait Tattoo, Black & Grey Tattoo, Japanese Tattoo, Custom Tattoo, Cover-Up Tattoo |

*(The backend schema does not impose an artificial maximum on duration hours, allowing future extended sessions.)*

---

## Setup & Running Instructions

### 1. Configure MongoDB Connection in Server
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Copy the template environment file:
   ```bash
   cp .env.example .env
   ```
3. Open `server/.env` and replace `MONGODB_URI` with your own MongoDB connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tattoo_booking?retryWrites=true&w=majority
   ```
   *(Note: Never commit real credentials to version control. The repository contains only `.env.example`.)*

### 2. Start the Backend Server
```bash
cd server
npm start
```
The server will start on port `5000` and establish a live connection to your MongoDB database.

### 3. Start the Frontend Application
In a separate terminal:
```bash
cd client
npm run dev
```
The Vite development server will start on `http://localhost:3000`.

---

## API Endpoints

- `GET /api/tattoo-types`: Returns catalog of 20 tattoo styles and durations.
- `GET /api/slots?date=YYYY-MM-DD&tattooType=Name`: Calculates and returns candidate 1-hour slots for the date with live availability status and conflict explanations.
- `POST /api/appointments`: Books an appointment. Re-verifies slot availability against MongoDB right before persisting to prevent double-booking race conditions. Returns 201 on success or 409 on conflict.
- `GET /api/appointments/:id`: Fetches confirmed appointment details.
- `GET /api/appointments`: Retrieves confirmed appointments for the day/studio.
- `GET /api/health`: Health status and database connection indicator.
