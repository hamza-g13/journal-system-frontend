// src/App.js - Förenklad version
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import PageWrapper from './components/PageWrapper';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import DoctorPage from './pages/DoctorPage';
import StaffPage from './pages/StaffPage';
import PatientPage from './pages/PatientPage';
import MessagesPage from './pages/MessagesPage';
import PatientManagementPage from './pages/PatientManagementPage';
import ImagesPage from './pages/ImagesPage';
import SearchPage from './pages/SearchPage';
import CreateProfilePage from './pages/CreateProfilePage';
import { patientService } from './services/patientService';
import { practitionerService } from './services/practitionerService';
import './styles/global.css';

// Route configuration för bättre underhåll
const routeConfig = {
    admin: { component: AdminPage, allowedRoles: ['admin'] },
    doctor: { component: DoctorPage, allowedRoles: ['doctor'] },
    staff: { component: StaffPage, allowedRoles: ['staff'] },
    patient: { component: PatientPage, allowedRoles: ['patient'] },
    messages: { component: MessagesPage, allowedRoles: ['patient', 'doctor', 'staff', 'admin'] },
    patients: { component: PatientManagementPage, allowedRoles: ['staff', 'doctor', 'admin'] },
    images: { component: ImagesPage, allowedRoles: ['patient', 'doctor', 'staff', 'admin'] },
    search: { component: SearchPage, allowedRoles: ['doctor', 'staff', 'admin'] }
};

function App() {
    const { token, userRole, userId, login, logout, isAuthenticated, isLoading } = useAuth();
    const [profileChecked, setProfileChecked] = useState(false);
    const [profileMissing, setProfileMissing] = useState(false);

    useEffect(() => {
        const checkProfile = async () => {
            if (!isAuthenticated || !userRole || !token) return;

            // Admins don't need a profile
            if (userRole === 'admin') {
                setProfileChecked(true);
                return;
            }

            if (!userRole) {
                console.warn("Authenticated but no recognized role found.");
                setProfileChecked(true); // Stop loading
                return;
            }

            try {
                if (userRole === 'patient') {
                    await patientService.getMe(token);
                } else if (userRole === 'doctor' || userRole === 'staff') {
                    await practitionerService.getMe(token);
                }
                setProfileMissing(false);
            } catch (error) {
                console.log("Profile check failed or not found:", error);
                // Assume 404 or similar means missing profile
                setProfileMissing(true);
            } finally {
                setProfileChecked(true);
            }
        };

        if (isAuthenticated) {
            checkProfile();
        }
    }, [isAuthenticated, userRole, token]);

    const handleProfileCreated = () => {
        setProfileMissing(false);
        setProfileChecked(true);
    };

    if (isLoading) {
        return <div className="loading">Loading authentication...</div>;
    }

    if (isAuthenticated && !profileChecked && userRole !== 'admin') {
        return <div className="loading">Checking profile...</div>;
    }

    if (isAuthenticated && profileMissing) {
        return (
            <Router>
                <div className="app">
                    <Navbar userRole={userRole} onLogout={logout} />
                    <PageWrapper>
                        <CreateProfilePage onProfileCreated={handleProfileCreated} />
                    </PageWrapper>
                </div>
            </Router>
        );
    }

    return (
        <Router>
            <div className="app">
                {isAuthenticated && <Navbar userRole={userRole} onLogout={logout} />}

                {isAuthenticated ? (
                    <PageWrapper>
                        <Routes>
                            <Route path="/" element={<Navigate to={`/${userRole}`} replace />} />

                            {/* Dynamiskt genererade routes */}
                            {Object.entries(routeConfig).map(([path, config]) =>
                                renderProtectedRoute(path, config)
                            )}

                            {/* Catch-all route */}
                            <Route path="*" element={<Navigate to={`/${userRole}`} replace />} />
                        </Routes>
                    </PageWrapper>
                ) : (
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                )}
            </div>
        </Router>
    );

    function renderProtectedRoute(path, config) {
        return (
            <Route
                key={path}
                path={`/${path}`}
                element={
                    <ProtectedRoute allowedRoles={config.allowedRoles}>
                        <config.component
                            token={token}
                            userId={userId}
                            role={userRole}
                        />
                    </ProtectedRoute>
                }
            />
        );
    }
}

export default App;
