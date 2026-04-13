# IBM Event Manager

A **premium, glassmorphic event management platform** built with React, TypeScript, Tailwind CSS, and Firebase. Features a stunning dark emerald theme with frosted glass components, animated backgrounds, and a Luma-inspired UI.

![IBM Event Manager](https://img.shields.io/badge/IBM-Event_Manager-0a1f1a?style=for-the-badge&labelColor=c9a84c)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=flat-square&logo=firebase&logoColor=black)

---

## ✨ Features

- **Premium Glassmorphic UI** — Dark emerald theme with frosted glass cards, animated gradient orbs, and gold accents
- **Authentication** — Email/Password and Google Sign-In via Firebase Auth
- **Demo Mode** — Try the full app instantly without creating an account or connecting Firebase
- **Dashboard** — View your events with real-time stats (total events, upcoming, attendees)
- **Create Event** — Luma-inspired two-column layout with cover image upload, date/time pickers, and event options
- **Event Details** — Hero image, RSVP toggle (Going / Maybe / Can't Go), and attendee counts
- **Real-time Updates** — Firestore `onSnapshot` listeners for live data syncing
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile

---

## 🛠 Tech Stack

| Layer       | Technology                                                              |
|-------------|-------------------------------------------------------------------------|
| **Frontend**   | React 18, React Router v7                                            |
| **Language**   | TypeScript 5                                                         |
| **Styling**    | Tailwind CSS v4 (custom `@theme` design system)                      |
| **Icons**      | Lucide React                                                         |
| **Build Tool** | Vite 6 (with `@tailwindcss/vite` plugin)                            |
| **Backend**    | Firebase (Authentication + Cloud Firestore)                          |
| **Fonts**      | Playfair Display (headings) + Inter (body) via Google Fonts          |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/ChinmaySinha/ibm-event-manager.git
cd ibm-event-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Dev Server

```bash
npm run dev
```

The app will open at **http://localhost:5173**. Click **"Try Demo"** on the login page to explore with sample data — no Firebase setup required!

---

## 🔥 Connect Your Own Firebase

To use your own Firebase backend for persistent data and authentication:

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"** and follow the setup wizard

### Step 2: Enable Services

1. **Authentication** → Sign-in method → Enable **Email/Password** and **Google**
2. **Firestore Database** → Create database → Start in **test mode** (or use the rules below)

### Step 3: Register a Web App

1. In Project Settings (⚙️) → **Add App** → Choose **Web** (</>) 
2. Register your app and copy the configuration object

### Step 4: Update Firebase Config

Open `src/config/firebase.ts` and replace the config values with your own:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "G-XXXXXXXXXX"
};
```

### Step 5: Set Firestore Security Rules

In the Firebase Console → Firestore → Rules, deploy these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      // Anyone can read events
      allow read: if true;
      // Only authenticated users can create/update/delete events
      allow write: if request.auth != null;
    }
  }
}
```

### Step 6: Restart & Sign In

Restart your dev server (`npm run dev`) and sign up with email or Google. Your events will now persist in Firestore!

---

## 📁 Project Structure

```
src/
├── config/
│   └── firebase.ts              # Firebase configuration
├── contexts/
│   └── AuthContext.tsx           # Auth provider (Firebase + Demo mode)
├── types/
│   └── event.ts                 # Shared TypeScript interfaces
├── components/
│   ├── AnimatedBackground.tsx   # Floating gradient orbs
│   ├── GlassCard.tsx            # Reusable frosted glass card
│   ├── GlassNavbar.tsx          # Scroll-responsive navigation bar
│   ├── ProtectedRoute.tsx       # Auth-gated route wrapper
│   └── RsvpToggle.tsx           # Interactive RSVP capsule toggle
├── pages/
│   ├── LoginPage.tsx            # Login with email/password or demo
│   ├── SignupPage.tsx           # Account registration
│   ├── DashboardPage.tsx        # Event grid + statistics
│   ├── CreateEventPage.tsx      # Two-column event creation form
│   └── EventDetailPage.tsx      # Event details + RSVP
├── index.css                    # Tailwind CSS design system
├── main.tsx                     # App entry point
└── App.tsx                      # Route definitions
```

---

## 🎨 Design System

The app uses a custom Tailwind CSS v4 design system defined in `src/index.css`:

| Token                     | Value        | Usage                          |
|---------------------------|-------------|--------------------------------|
| `--color-emerald-deep`    | `#0a1f1a`   | Page backgrounds               |
| `--color-emerald-medium`  | `#143d30`   | Glass card backgrounds         |
| `--color-emerald-accent`  | `#2dd4a0`   | Primary accent, links, CTAs    |
| `--color-gold`            | `#c9a84c`   | Headings, badges, highlights   |
| `--color-cream`           | `#f5f0e8`   | Body text                      |
| Glass effect              | `backdrop-blur-xl` | Frosted panel backgrounds |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with 💚 by <a href="https://github.com/ChinmaySinha">Chinmay Sinha</a>
</p>
