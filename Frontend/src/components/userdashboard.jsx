import { Link } from "react-router-dom";
import { HeartHandshake, MapPin, BellRing } from "lucide-react";

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("relief_user") || "{}");

  return (
    <div className="min-h-screen bg-[#050511] text-white p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-purple-300 text-sm">Requester dashboard</p>
            <h1 className="text-3xl font-semibold">
              Welcome, {user?.name || "User"}
            </h1>
          </div>
          <Link
            to="/profile"
            className="px-4 py-2 rounded-full border border-white/20 text-sm text-gray-200 hover:text-white hover:border-purple-400/50 transition-colors"
          >
            Profile
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#0a0a14] border border-white/10 rounded-2xl p-5">
            <BellRing className="w-5 h-5 text-sky-300 mb-2" />
            <p className="text-sm text-gray-400">Open requests</p>
            <p className="text-2xl font-semibold mt-1">2</p>
          </div>
          <div className="bg-[#0a0a14] border border-white/10 rounded-2xl p-5">
            <HeartHandshake className="w-5 h-5 text-emerald-300 mb-2" />
            <p className="text-sm text-gray-400">Help offers</p>
            <p className="text-2xl font-semibold mt-1">4</p>
          </div>
          <div className="bg-[#0a0a14] border border-white/10 rounded-2xl p-5">
            <MapPin className="w-5 h-5 text-purple-300 mb-2" />
            <p className="text-sm text-gray-400">Nearest support center</p>
            <p className="text-2xl font-semibold mt-1">3.2 km</p>
          </div>
        </div>

        <div className="bg-[#0a0a14] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Need urgent help?</h2>
          <p className="text-gray-400 mb-5">
            Share your need with exact location and priority. Nearby volunteers will get notified quickly.
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 text-sm font-medium"
          >
            Update Contact Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;

