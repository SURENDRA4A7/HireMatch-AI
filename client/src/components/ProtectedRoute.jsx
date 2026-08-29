import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
const { user, loading, isAuthenticated } = useAuth();

// Wait until localStorage user data is loaded
if (loading) {
return <div>Loading...</div>;
}

// User is not logged in
if (!isAuthenticated || !user) {
return <Navigate to="/login" replace />;
}

// Check whether user has permission
if (
allowedRoles &&
!allowedRoles.includes(user.role)
) {
return <Navigate to="/" replace />;
}

return children;
}

export default ProtectedRoute;
