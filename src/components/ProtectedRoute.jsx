// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children, allowedRoles }) {
    const { token, userRole, isAuthenticated } = useAuth();
    const location = useLocation();

    // Om användaren inte är inloggad, redirect till login
    if (!isAuthenticated || !token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Om användaren inte har rätt roller, redirect till deras dashboard
    if (!allowedRoles || !allowedRoles.includes(userRole)) {
        console.warn(`Unauthorized access attempt: User role ${userRole} tried to access route requiring ${allowedRoles}`);

        // Redirect till användarens hem-sida baserat på deras roll
        const userDashboard = `/${userRole}`;
        return <Navigate to={userDashboard} replace />;
    }

    // Validera att children finns och är giltig
    if (!children) {
        console.error('ProtectedRoute: No children provided');
        return <Navigate to={`/${userRole}`} replace />;
    }

    return children;
}

export default ProtectedRoute;