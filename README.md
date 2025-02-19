# Handyman
Software Dev II project

Handyman App - Backend Setup Guide
Table of Contents
Project Setup
Firebase Configuration
Running the Project
Firebase-Service-Account.json
Environment Variables


Project Setup
Prerequisites
Node.js and npm: Make sure you have Node.js and npm installed. You can check if they are installed by running:
node -v
npm -v
Download Node.js from here if not installed.

Clone the Repository: Clone the project repository to your local machine:

git clone https://github.com/YourUsername/handyman-app.git
cd handyman-app


Install Dependencies: After cloning, navigate to the project folder and install the necessary dependencies:

npm install


Firebase Configuration
Firebase Setup for Backend
To interact with Firebase services (Firestore, Authentication, Storage), the backend requires a firebase-service-account.json file. This file holds the Firebase service account credentials needed to access Firebase APIs.

Steps to Obtain Firebase Service Account Credentials
Go to Firebase Console:

Visit the Firebase Console.
Select the project you are working on (e.g., HandymanApp).
Generate Service Account File:

Navigate to Project Settings (gear icon in the top-left corner).
Click on the Service Accounts tab.
Click on Generate New Private Key. This will download a .json file containing the Firebase service account credentials.
Save the File:

Save the downloaded firebase-service-account.json file to the backend/firebase/ directory in your local repository.

Important: Do not commit this file to version control (Git) for security reasons. Add the firebase-service-account.json file to your .gitignore to ensure it is not tracked by Git.

Example .gitignore entry:\

# Ignore Firebase service account file
backend/firebase/firebase-service-account.json


Running the Project
Set Up Firebase Credentials: Ensure you have the firebase-service-account.json file in the backend/firebase/ directory. This file will allow the backend to interact with Firebase services (Firestore, Authentication, etc.).

Start the Server: Once your Firebase configuration is set, run the server using:

npm run dev
This will start the backend server on port 5000, and you can begin testing API routes.

Verify Firebase Integration: To verify that Firebase is set up correctly, you can test an API route such as:


POST http://localhost:5000/api/auth/login
If Firebase authentication works without errors, the setup is complete.

Firebase-Service-Account.json
Importance of firebase-service-account.json
This file contains sensitive credentials that are required to authenticate your backend with Firebase. This is used by the backend to interact with Firebase services like Firestore and Firebase Storage. Do not share this file or push it to version control (e.g., GitHub).

Storing Firebase Credentials Securely
If you prefer to avoid storing firebase-service-account.json in your local project folder, you can move the file to a secure location and use an environment variable to reference its path. Here's how:

Move the Firebase Credentials: You can move the firebase-service-account.json file outside of the project directory to a more secure location, e.g., ~/.secrets/firebase-service-account.json.

Update .env File: In your .env file, add the following line:


GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/firebase-service-account.json
Modify the Firebase Admin Initialization: In your firebaseAdmin.js file, update the Firebase Admin SDK initialization to use the GOOGLE_APPLICATION_CREDENTIALS environment variable:

js
const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "handymanapp-b6e50.firebasestorage.app",
});

const db = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();

module.exports = { admin, db, auth, bucket };
Environment Variables
Ensure that you have a .env file at the root of your project. It should contain the following variables:



# Firebase API Key (Required for client-side authentication)
FIREBASE_API_KEY=your-firebase-api-key

# Google Cloud Credentials (Only if you moved firebase-service-account.json)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/firebase-service-account.json
This will help the backend authenticate and communicate securely with Firebase.

By following these steps, someone from the frontend team can set up the project and securely configure Firebase for the backend. This will ensure that they have the right credentials, and Firebase integration is working correctly.




The set up for frontend and backend 

handyman-app/
│── backend/                 # Backend folder (server, routes, Firebase admin, etc.)
│   ├── firebase/            # Firebase admin setup
│   │   ├── firebaseAdmin.js
│   │   ├── firebase-service-account.json
│   │   ├── firebase.js  # Only if backend needs Firebase
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── firestore.rules     # Firestore security rules
│   ├── firestore.indexes.json  # Firestore indexes
│   ├── database.rules.json # Database security rules
│   ├── storage.rules       # Firebase Storage rules
│   ├── server.js           # Main backend entry file
│   ├── package.json        # Backend dependencies
│   ├── package-lock.json
│
│── frontend/               # Frontend folder (React app)
│   ├── src/                # React frontend code
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── firebase.js  # Firebase initialization for frontend
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context API (Auth, Theme, etc.)
│   │   ├── pages/       # Page-based routing
│   │   ├── styles/      # CSS/SCSS files
│   ├── public/          # Static assets (if using CRA)
│   ├── package.json     # Frontend dependencies
│   ├── package-lock.json
│   ├── node_modules/    # Dependencies (ignored in .gitignore)
│
│── README.md
│── firebase.json         # Firebase config
│── apphosting.yaml       # Check if needed
│── dataconnect/          # Check if needed
│── dataconnect-generated/  # Check if needed
│── functions/            # If Firebase Functions, move to backend
