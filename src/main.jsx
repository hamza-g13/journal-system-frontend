// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
console.log('Frontend version: fixed-patient-403');

import { AuthProvider } from 'react-oidc-context';

const oidcConfig = {
    authority: "http://localhost:8080/realms/journal-realm",
    client_id: "journal-frontend",
    redirect_uri: window.location.origin,
    onSigninCallback: (_user) => {
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    }
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider {...oidcConfig}>
            <App />
        </AuthProvider>
    </React.StrictMode>,
)
