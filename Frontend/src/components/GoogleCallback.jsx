import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userDataStr = params.get("user");

    if (token && userDataStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userDataStr));
        
        localStorage.setItem("relief_token", token);
        localStorage.setItem("relief_user", JSON.stringify(user));
        if (user.id) {
          localStorage.setItem("userId", user.id);
        }

        // Redirect based on role
        if (user.role === "volunteer") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/user-dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050511]">
      <div className="text-white text-xl">Authenticating with Google...</div>
    </div>
  );
};

export default GoogleCallback;
