# IBM Event Manager

A **premium, glassmorphic event management platform** built with React, TypeScript, Tailwind CSS, and Firebase. Features a stunning **Midnight Indigo** theme with frosted glass components, animated background gradients, and a sleek, Luma-inspired user experience.

![IBM Event Manager](https://img.shields.io/badge/IBM-Event_Manager-06091a?style=for-the-badge&labelColor=7c5bf5)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=flat-square&logo=firebase&logoColor=black)

---

## ✨ Features

- **Premium Glassmorphic UI** — Deep indigo theme with frosted glass cards, animated teal/violet gradient orbs, and elegant spacing.
- **Authentication** — Email/Password and Google Sign-In via Firebase Auth.
- **Demo Mode w/ Local Storage** — Try the full app instantly! Your test events are intelligently saved and loaded from browser `localStorage` when bypassing Firebase.
- **Dashboard** — View your events with real-time stats (total events, upcoming, attendees).
- **Create Event** — Luma-inspired layout with robust state handling (e.g. seamless multi-day end date synchronization), native inline location inputs, and conditional event options.
- **Event Details** — Full-width hero image, RSVP toggle (Going / Maybe / Can't Go), and real-time attendee counts.
- **Real-time Updates** — Firestore `onSnapshot` listeners for live data syncing across active clients.
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile with generous whitespace.

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

To use your own Firebase backend for persistent data and authentication, follow these steps:

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"** and follow the setup wizard.

### Step 2: Enable Services

1. **Authentication** → Sign-in method → Enable **Email/Password** and **Google**.
2. **Firestore Database** → Create database → Start in **test mode** (or use the rules below).

### Step 3: Register a Web App

1. In Project Settings (⚙️) → **Add App** → Choose **Web** (`</>`).
2. Register your app and copy the configuration object.

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

```javascript
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

Restart your dev server (`npm run dev`) and sign up with an email or via Google. Your events and real-time RSVPs will now persist in your own Firestore database!

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

The app utilizes a custom Tailwind CSS v4 design system defined in `src/index.css`. The aesthetic is "Midnight Indigo":

| Token                     | Value        | Usage                          |
|---------------------------|-------------|--------------------------------|
| `--color-bg-deep`         | `#06091a`   | Page backgrounds               |
| `--color-surface`         | `#0a0f2c`   | Glass card backgrounds         |
| `--color-accent`          | `#3dd6c8`   | Primary TEAL accent, buttons   |
| `--color-violet`          | `#7c5bf5`   | Secondary VIOLET gradient hue  |
| `--color-text-primary`    | `#ffffff`   | Headings                       |
| Glass effect              | `backdrop-blur-xl` | Frosted panel backgrounds |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with 💚 by <a href="https://github.com/ChinmaySinha">Chinmay Sinha</a>
</p>
