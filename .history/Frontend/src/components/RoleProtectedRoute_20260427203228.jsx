import { Navigate } from "react-router-dom";

function RoleProtectedRoute({ allowedRoles, children }) {
  const rawUser = localStorage.getItem("relief_user");
  const token = localStorage.getItem("relief_token");

  if (!token || !rawUser) {
    return <Navigate to="/login" replace />;
  }

  let user = null;
  try {
    user = JSON.parse(rawUser);
  } catch (error) {
    localStorage.removeItem("relief_user");
    localStorage.removeItem("relief_token");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    const fallbackRoute = user?.role === "volunteer" ? "/dashboard" : "/user-dashboard";
    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
}

export default RoleProtectedRoute;

