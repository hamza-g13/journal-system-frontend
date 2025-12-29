import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

const LoginPage = () => {
    const { login, isAuthenticated } = useAuth();

    // Automatically redirect to Keycloak if not authenticated
    // OR show a "Login with Keycloak" button

    useEffect(() => {
        if (isAuthenticated) {
            // Should be handled by App router to redirect to dashboard
            // But just in case
        }
    }, [isAuthenticated]);

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Journal System</h2>
                <p>Secure Login via Keycloak</p>

                <button
                    className="login-button"
                    onClick={() => login()}
                >
                    Login with Keycloak
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
