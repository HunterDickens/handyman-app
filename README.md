# Handyman
Software Dev II projecty 


The set up for frontend and backend 

handyman-app/
│── backend/                 # Backend folder (server, routes, Firebase admin, etc.)
│   ├── routes/
│   ├── services/
│   ├── firebase/
│   │   ├── firebaseAdmin.js
│   │   ├── firebase-service-account.json
│   │   ├── firebase.js  # (Only if backend needs Firebase)
│   ├── server.js
│   ├── package.json
│── frontend/                # Frontend folder (React app)
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── firebase.js  # Now correctly placed in frontend
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   ├── package.json
│── dataconnect/             # (Check if this is needed)
│── dataconnect-generated/   # (Check if this is needed)
│── firebase.json            # Firebase config
│── firestore.rules          # Firestore security rules
│── firestore.indexes.json   # Firestore indexes
│── database.rules.json      # Database security rules
│── functions/               # (Are these Firebase Functions? If not, move them to backend)
│── public/                  # Frontend static assets (if using CRA)
│── node_modules/            # Dependencies
│── storage.rules            # Storage rules (for Firebase)
│── package.json
│── package-lock.json
│── README.md
│── apphosting.yaml          # (Check if needed)
