import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, CalendarDays, LogOut, Pencil, CircleUserRound } from "lucide-react";

function formatDate(dateValue) {
  if (!dateValue) return "Not available";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("relief_token");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setProfile(data.user);
      } catch (fetchError) {
        setError(fetchError.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, userId]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("relief_token");
    localStorage.removeItem("relief_user");
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0b0f1a 0%, #11172a 55%, #0b0f1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        color: "#e5e7eb",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          background: "rgba(10, 15, 28, 0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "28px",
          boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
          padding: "32px",
          backdropFilter: "blur(18px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
          <Link to="/dashboard" style={{ color: "#9ca3af", textDecoration: "none" }}>← Back to dashboard</Link>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              border: "none",
              borderRadius: "999px",
              padding: "12px 20px",
              color: "white",
              cursor: "pointer",
              background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 10px 24px rgba(59,130,246,0.28)",
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "24px", alignItems: "center", marginBottom: "28px" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(37,99,235,0.95))", display: "grid", placeItems: "center", boxShadow: "0 18px 40px rgba(124,58,237,0.35)" }}>
            <CircleUserRound size={56} color="#fff" />
          </div>

          <div>
            <p style={{ color: "#93c5fd", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "12px", marginBottom: "8px" }}>Profile Overview</p>
            <h1 style={{ fontSize: "34px", lineHeight: 1.1, margin: 0, color: "#ffffff" }}>User Profile</h1>
            <p style={{ marginTop: "10px", color: "#9ca3af", fontSize: "15px" }}>A clean dashboard-style profile section for the signed-in user.</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "28px", textAlign: "center", color: "#cbd5e1", background: "rgba(255,255,255,0.03)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            Loading profile...
          </div>
        ) : error ? (
          <div style={{ padding: "18px 20px", background: "rgba(239,68,68,0.12)", color: "#fecaca", borderRadius: "16px", border: "1px solid rgba(239,68,68,0.25)" }}>
            {error}
          </div>
        ) : (
          <div style={{ display: "grid", gap: "18px" }}>
            <div style={{ display: "grid", gap: "18px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <InfoCard icon={<User size={18} />} label="User Name" value={profile?.name || "Not available"} />
              <InfoCard icon={<Mail size={18} />} label="Email" value={profile?.email || "Not available"} />
              <InfoCard icon={<CalendarDays size={18} />} label="Account Creation Date" value={formatDate(profile?.createdAt)} />
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "6px" }}>
              <button
                type="button"
                style={{
                  border: "none",
                  borderRadius: "999px",
                  padding: "12px 20px",
                  color: "#fff",
                  cursor: "pointer",
                  background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 10px 24px rgba(59,130,246,0.28)",
                }}
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#93c5fd", marginBottom: "10px" }}>
        {icon}
        <span style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      </div>
      <div style={{ fontSize: "18px", color: "#ffffff", fontWeight: 600, wordBreak: "break-word" }}>{value}</div>
    </div>
  );
}

export default Profile;