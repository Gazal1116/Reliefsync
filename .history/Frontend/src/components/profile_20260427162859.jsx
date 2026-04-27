import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ShieldCheck, User, Mail, BadgeCheck, CalendarClock, ArrowRight } from "lucide-react";

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleString();
}

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("relief_token");
  const storedUser = JSON.parse(localStorage.getItem("relief_user") || "{}");

  const [profile, setProfile] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    role: storedUser.role || "",
    createdAt: "",
    updatedAt: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Unable to load profile");
        }

        const data = await res.json();
        const user = data.user || {};

        setProfile({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "",
          createdAt: user.createdAt || "",
          updatedAt: user.updatedAt || "",
        });

        localStorage.setItem(
          "relief_user",
          JSON.stringify({
            name: user.name || "",
            email: user.email || "",
            role: user.role || "",
          })
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("relief_token");
    localStorage.removeItem("relief_user");
    navigate("/login");
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#050511] text-white p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-sky-900/20 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
          <Link to="/request" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
             Back to requests
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-white/15 text-gray-200 hover:text-white hover:border-purple-400/40 hover:bg-white/5 transition-all"
          >
            Logout
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-3xl bg-[#0a0a14]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-purple-900/20 p-6 sm:p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 border border-white/20 shadow-lg shadow-purple-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold">My Profile</h1>
              <p className="text-sm text-gray-400">Authenticated account details</p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-white/10 bg-[#0d0d18] p-5 text-gray-300">
              Loading profile...
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-white/10 bg-[#0d0d18] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Basic Info</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 mt-1 text-purple-300" />
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-white font-medium">{profile.name || "Not available"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-1 text-sky-300" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-white font-medium">{profile.email || "Not available"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="w-4 h-4 mt-1 text-emerald-300" />
                    <div>
                      <p className="text-xs text-gray-500">Role</p>
                      <p className="text-white font-medium capitalize">{profile.role || "Not available"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0d0d18] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Account Timeline</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarClock className="w-4 h-4 mt-1 text-indigo-300" />
                    <div>
                      <p className="text-xs text-gray-500">Created At</p>
                      <p className="text-white font-medium">{formatDate(profile.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarClock className="w-4 h-4 mt-1 text-indigo-300" />
                    <div>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="text-white font-medium">{formatDate(profile.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
