import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const usePermissions = () => {
    const { user } = useContext(AuthContext);

    const hasPermission = (permission) => {
        if (!user || !user.role || !user.role.permissions) return false;
        return user.role.permissions.includes(permission);
    };

    const hasAnyPermission = (permissions) => {
        return permissions.some(permission => hasPermission(permission));
    };

    const hasAllPermissions = (permissions) => {
        return permissions.every(permission => hasPermission(permission));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions
    };
}; 