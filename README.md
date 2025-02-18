# Handyman
Software Dev II projecty 


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
