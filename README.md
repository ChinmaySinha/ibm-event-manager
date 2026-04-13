# IBM Event Manager

A premium, glassmorphic event management application built with React and Firebase.

## Features
- **Premium Glassmorphic UI**: Beautiful dark theme with dynamic background orbs and sleek glass panels.
- **Authentication**: Email/Password and Google Sign-in supported.
- **Demo Mode**: Allow users to try out the application natively without needing login.
- **Dashboard**: View your events and key statistics.
- **Create Event**: A Luma-inspired sleek "Create Event" page.
- **Firebase Backend**: Real-time event storage using Cloud Firestore.

## Tech Stack
- Frontend: React (Vite), React Router
- Styling: Custom Vanilla CSS (Design system with variables)
- Icons: React Icons (`react-icons`)
- Backend & Auth: Firebase

## How to Run Locally

1. Clone the repository and navigate into the folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Connect to Your Own Firebase Database

To run your own backend with Firebase, you'll need to create a project and update the Firebase config files:

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** (Email/Password & Google) and **Firestore Database**.
3. Register a Web App in the project settings, which will give you a configuration object.
4. Open the `src/config/firebase.js` file and replace the existing `firebaseConfig` with your own credentials:

   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     projectId: "YOUR_PROJECT",
     storageBucket: "YOUR_PROJECT.firebasestorage.app",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcde",
     measurementId: "G-XXXXXXXXXX"
   };
   ```

5. Deploy standard security rules to Firestore so your app can read and write properly:
   ```text
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /events/{eventId} {
         // Anyone can read events
         allow read: if true;
         // Only authenticated users can write/create events
         allow write: if request.auth != null;
       }
     }
   }
   ```
