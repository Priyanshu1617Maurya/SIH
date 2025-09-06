RAPIDAPI_KEY=d9821664ffmshfd9eff687fbc92cp13abdcjsnc7024232815e
RAPIDAPI_HOST=train-running-api.p.rapidapi.com

trackmitra-web/
├── client/               # Frontend (React + Tailwind)
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   └── MapView.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── ControllerDashboard.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── Simulation.jsx
│       │   └── PassengerPWA.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── server/              # Backend (FastAPI)
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── trains.py
│   │   │   ├── ai.py
│   │   │   ├── alerts.py
│   │   │   └── simulation.py
│   │   ├── models/
│   │   │   └── database.py
│   │   ├── schemas/
│   │   │   └── schemas.py
│   │   └── utils/
│   │       ├── auth.py
│   │       └── websocket.py
│   └── requirements.txt
├── docker-compose.yml
└── README.md
   this is the complete file and folder structure make this for the sih and so that the  there is search option to get the live location fo tthe train and whcih can i render on the frontend give me code of each using the best