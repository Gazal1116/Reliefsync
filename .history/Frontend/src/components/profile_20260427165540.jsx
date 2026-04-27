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

          const data = await readJsonSafely(response);

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
          background:
            "radial-gradient(circle at top left, rgba(124,58,237,0.22), transparent 30%), radial-gradient(circle at top right, rgba(37,99,235,0.20), transparent 32%), linear-gradient(135deg, #0b0f1a 0%, #0e1322 48%, #0b0f1a 100%)",
          padding: "24px",
          color: "#e5e7eb",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            background: "rgba(10, 15, 28, 0.88)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "30px",
            boxShadow: "0 28px 80px rgba(0,0,0,0.48)",
            padding: "30px",
            backdropFilter: "blur(18px)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "center", flexWrap: "wrap", marginBottom: "28px" }}>
            <Link
              to="/dashboard"
              style={{
                color: "#cbd5e1",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              ← Back to dashboard
            </Link>

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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(120px, 140px) 1fr",
              gap: "24px",
              alignItems: "center",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "136px",
                height: "136px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(124,58,237,0.98), rgba(37,99,235,0.98))",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 20px 48px rgba(124,58,237,0.33)",
                border: "1px solid rgba(255,255,255,0.16)",
              }}
            >
              <CircleUserRound size={66} color="#fff" />
            </div>

            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background: "rgba(59,130,246,0.12)",
                  color: "#93c5fd",
                  border: "1px solid rgba(147,197,253,0.22)",
                  marginBottom: "16px",
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                <ShieldCheck size={14} />
                Profile Overview
              </div>

              <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.05, margin: 0, color: "#ffffff", letterSpacing: "-0.03em" }}>
                {displayName}
              </h1>

              <p style={{ marginTop: "12px", color: "#9ca3af", fontSize: "15px", maxWidth: "58ch", lineHeight: 1.7 }}>
                This is your secure account summary. You can review your contact information, account creation date, and move back to the dashboard with one click.
              </p>
            </div>
          </div>

          {loading ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "#cbd5e1",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "22px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              Loading profile...
            </div>
          ) : error ? (
            <div
              style={{
                padding: "18px 20px",
                background: "rgba(239,68,68,0.12)",
                color: "#fecaca",
                borderRadius: "16px",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              {error}
            </div>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
                <ProfileCard icon={User} label="User Name" value={profile?.name || "Not available"} accent="#c4b5fd" />
                <ProfileCard icon={Mail} label="Email Address" value={profile?.email || "Not available"} accent="#93c5fd" />
                <ProfileCard icon={CalendarDays} label="Account Creation Date" value={formatDate(profile?.createdAt)} accent="#86efac" />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "22px",
                    padding: "20px",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#93c5fd" }}>
                    Account Status
                  </p>
                  <div style={{ marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "999px", background: "rgba(16,185,129,0.12)", color: "#a7f3d0", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <Sparkles size={14} />
                    Active and secure
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "22px",
                    padding: "20px",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#93c5fd" }}>
                    Quick Action
                  </p>
                  <button
                    type="button"
                    style={{
                      marginTop: "14px",
                      border: "none",
                      borderRadius: "999px",
                      padding: "12px 18px",
                      color: "#fff",
                      cursor: "pointer",
                      background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 10px 24px rgba(59,130,246,0.28)",
                    }}
                  >
                    <PencilLine size={16} />
                    Edit Profile
                  </button>
                </div>
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