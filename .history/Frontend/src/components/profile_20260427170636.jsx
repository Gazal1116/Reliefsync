import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, CalendarDays, CircleUserRound, LogOut, Mail, MapPin, PencilLine, Phone, ShieldCheck, Sparkles, User } from "lucide-react";

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

async function readJsonSafely(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { message: text || "Unexpected server response" };
  }
}

function ProfileCard({ icon: Icon, label, value, accent = "#93c5fd" }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "22px",
        padding: "18px 20px",
        boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: accent, marginBottom: "10px" }}>
        <Icon size={18} />
        <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</span>
      </div>
      <div style={{ fontSize: "18px", fontWeight: 600, color: "#ffffff", wordBreak: "break-word" }}>
        {value}
      </div>
    </div>
  );
}

function calculateProfileStrength(profileData) {
  const fields = [
    profileData?.name,
    profileData?.email,
    profileData?.phone,
    profileData?.location,
    profileData?.bio,
    profileData?.avatar,
  ];

  const filled = fields.filter((item) => typeof item === "string" && item.trim() !== "").length;
  return Math.round((filled / fields.length) * 100);
}

function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("relief_token");

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const normalizeErrorMessage = (message) => {
    const text = (message || "").toString();
    if (text.includes("<!DOCTYPE") || text.includes("<html")) {
      return "Profile API not reachable. Restart backend and try again.";
    }
    return text || "Something went wrong";
  };

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
        setFormData({
          name: data.user?.name || "",
          email: data.user?.email || "",
          phone: data.user?.phone || "",
          location: data.user?.location || "",
          bio: data.user?.bio || "",
          avatar: data.user?.avatar || "",
        });
      } catch (fetchError) {
        setError(normalizeErrorMessage(fetchError.message));
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result || "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/user/profile/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile");
      }

      setProfile(data.user);
      setSuccessMessage("Profile updated successfully.");
    } catch (saveError) {
      setError(normalizeErrorMessage(saveError.message));
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.name?.trim() || "User";
  const avatarSource = formData.avatar || profile?.avatar || "";
  const profileStrength = calculateProfileStrength(formData);

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
              overflow: "hidden",
            }}
          >
            {avatarSource ? (
              <img
                src={avatarSource}
                alt="Profile avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <CircleUserRound size={66} color="#fff" />
            )}
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

            <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ padding: "6px 10px", borderRadius: "999px", background: "rgba(196,181,253,0.15)", color: "#ddd6fe", fontSize: "12px", border: "1px solid rgba(196,181,253,0.22)" }}>
                Role: {profile?.role || "volunteer"}
              </span>
              <span style={{ padding: "6px 10px", borderRadius: "999px", background: "rgba(147,197,253,0.15)", color: "#bfdbfe", fontSize: "12px", border: "1px solid rgba(147,197,253,0.22)" }}>
                Profile Strength: {profileStrength}%
              </span>
            </div>

            <p style={{ marginTop: "12px", color: "#9ca3af", fontSize: "15px", maxWidth: "58ch", lineHeight: 1.7 }}>
              This is your secure account summary. Review your contact information, account creation date, and return to the dashboard with one click.
            </p>

            <div style={{ marginTop: "10px", maxWidth: "460px" }}>
              <div style={{ height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${profileStrength}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)",
                    transition: "width 300ms ease",
                  }}
                />
              </div>
            </div>
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
            <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <ProfileCard icon={User} label="User Name" value={profile?.name || "Not available"} accent="#c4b5fd" />
              <ProfileCard icon={Mail} label="Email Address" value={profile?.email || "Not available"} accent="#93c5fd" />
              <ProfileCard icon={Phone} label="Mobile Number" value={profile?.phone || "Not available"} accent="#f9a8d4" />
              <ProfileCard icon={MapPin} label="Location" value={profile?.location || "Not available"} accent="#fcd34d" />
              <ProfileCard icon={CalendarDays} label="Account Creation Date" value={formatDate(profile?.createdAt)} accent="#86efac" />
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "22px", padding: "20px" }}>
                <p style={{ margin: 0, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#93c5fd" }}>
                  Profile Photo
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ marginTop: "14px", width: "100%", color: "#cbd5e1" }}
                />
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "22px", padding: "20px" }}>
                <p style={{ margin: 0, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#93c5fd" }}>
                  Account Status
                </p>
                <div style={{ marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "999px", background: "rgba(16,185,129,0.12)", color: "#a7f3d0", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <Sparkles size={14} />
                  Active and secure
                </div>
                <div style={{ marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "999px", background: "rgba(147,197,253,0.12)", color: "#bfdbfe", border: "1px solid rgba(147,197,253,0.2)" }}>
                  <BadgeCheck size={14} />
                  Identity verified
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "22px", padding: "20px" }}>
                <label style={{ fontSize: "12px", color: "#93c5fd", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ marginTop: "8px", width: "100%", background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "11px" }}
                />
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "22px", padding: "20px" }}>
                <label style={{ fontSize: "12px", color: "#93c5fd", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ marginTop: "8px", width: "100%", background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "11px" }}
                />
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "22px", padding: "20px" }}>
                <label style={{ fontSize: "12px", color: "#93c5fd", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  style={{ marginTop: "8px", width: "100%", background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "11px" }}
                />
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "22px", padding: "20px" }}>
                <label style={{ fontSize: "12px", color: "#93c5fd", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  style={{ marginTop: "8px", width: "100%", background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "11px" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "22px", padding: "20px" }}>
                <label style={{ fontSize: "12px", color: "#93c5fd", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about yourself"
                  style={{ marginTop: "8px", width: "100%", background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "11px", resize: "vertical" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    border: "none",
                    borderRadius: "999px",
                    padding: "12px 18px",
                    color: "#fff",
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.7 : 1,
                    background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 10px 24px rgba(59,130,246,0.28)",
                  }}
                >
                  <PencilLine size={16} />
                  {saving ? "Saving..." : "Save Profile"}
                </button>

                {successMessage && <span style={{ color: "#86efac" }}>{successMessage}</span>}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;