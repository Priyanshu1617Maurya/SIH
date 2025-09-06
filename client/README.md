# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




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
