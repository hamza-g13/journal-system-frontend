import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from "react-oidc-context";

// Konfiguration för Keycloak i CBH Cloud
const oidcConfig = {
    // VIKTIGT: Byt ut URL:en nedan mot din Keycloak i CBH Cloud
    // T.ex: https://journal-system-keycloak-xyz.app.cloud.cbh.kth.se/realms/journal-realm
    authority: "https://journal-system-keycloak.app.cloud.cbh.kth.se/realms/journal-realm",

    client_id: "journal-frontend",
    redirect_uri: window.location.origin, // Automatiskt http://localhost:5173 när du kör lokalt
    onSigninCallback: () => {
        // Snygga till URL:en efter inloggning (ta bort ?code=...)
        window.history.replaceState({}, document.title, window.location.pathname);
    }
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider {...oidcConfig}>
            <App />
        </AuthProvider>
    </React.StrictMode>,
)
