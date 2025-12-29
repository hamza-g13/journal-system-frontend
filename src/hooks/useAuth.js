import { useAuth as useOidcAuth } from "react-oidc-context";
import { useMemo } from 'react';

export function useAuth() {
    const auth = useOidcAuth();

    const login = () => auth.signinRedirect();
    const logout = () => {
        auth.removeUser();
        auth.signoutRedirect();
    };

    const { userRole, userId, token } = useMemo(() => {
        if (!auth.user) {
            return { userRole: null, userId: null, token: null };
        }

        // Parse Access Token for roles (Keycloak specific)
        const accessToken = auth.user.access_token;
        let roles = [];
        try {
            const tokenParts = accessToken.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                if (payload.realm_access && payload.realm_access.roles) {
                    roles = payload.realm_access.roles;
                }
            }
        } catch (e) {
            console.error("Failed to parse access token roles", e);
        }

        let role = null;
        // Check for roles (case-insensitive just in case, but realm-export uses UPPER)
        if (roles.includes('ADMIN')) role = 'admin';
        else if (roles.includes('DOCTOR')) role = 'doctor';
        else if (roles.includes('STAFF')) role = 'staff';
        else if (roles.includes('PATIENT')) role = 'patient';

        // Fallback or log if no role found
        if (!role && roles.length > 0) {
            console.warn("User has roles but none matched known types:", roles);
        }

        return {
            userRole: role,
            userId: auth.user.profile.sub, // sub is standard in ID token
            token: accessToken
        };
    }, [auth.user]);

    return {
        token,
        userRole,
        userId,
        login,
        logout,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        error: auth.error
    };
}
