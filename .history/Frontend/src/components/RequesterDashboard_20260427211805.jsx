import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Loader2, MapPin, Send } from "lucide-react";

function formatDate(dateValue) {
  if (!dateValue) return "Not available";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusTone(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "completed") {
    return "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";
  }
  return "bg-amber-500/15 text-amber-300 border-amber-400/30";
}

function getUserIdFromToken(token) {
  try {
    if (!token) return "";
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return "";

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(normalized));
    return decodedPayload?.userId || "";
  } catch {
    return "";
  }
}

function getUserId() {
  const token = localStorage.getItem("relief_token");
  const tokenUserId = getUserIdFromToken(token);
  if (tokenUserId) return tokenUserId;

  const fromStorage = localStorage.getItem("userId");
  if (fromStorage && fromStorage !== "null" && fromStorage !== "undefined") return fromStorage;

  try {
    const rawUser = localStorage.getItem("relief_user");
    const parsed = rawUser ? JSON.parse(rawUser) : null;
    const fromUserObject = parsed?.id || parsed?._id;
    if (fromUserObject) return fromUserObject;
  } catch {
    // fallback below
  }

  return "";
}

function isValidObjectId(value) {
  return /^[a-f\d]{24}$/i.test(String(value || ""));
}

function RequesterDashboard() {
  const token = localStorage.getItem("relief_token");
  const userId = getUserId();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [toast, setToast] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    priority: "Medium",
  });

  const fetchUserRequests = async () => {
    if (!token || !userId || !isValidObjectId(userId)) {
      setLoading(false);
      setRequests([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/relief/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data || []);
    } catch (fetchError) {
      // Fallback for environments where /user/:id may fail due stale session/server mismatch.
      try {
        const allResponse = await axios.get("http://localhost:5000/api/relief/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filtered = (allResponse.data || []).filter((item) => {
          const createdBy = item?.createdBy;
          if (!createdBy) return false;
          if (typeof createdBy === "string") return createdBy === userId;
          if (typeof createdBy === "object") {
            if (createdBy._id) return String(createdBy._id) === userId;
            if (createdBy.id) return String(createdBy.id) === userId;
          }
          return false;
        });

        setRequests(filtered);
      } catch {
        setRequests([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRequests();

    const timer = setInterval(fetchUserRequests, 5000);
    return () => clearInterval(timer);
  }, [token, userId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const pendingCount = useMemo(
    () => requests.filter((item) => String(item.status).toLowerCase() === "pending").length,
    [requests]
  );

  const completedCount = useMemo(
    () => requests.filter((item) => String(item.status).toLowerCase() === "completed").length,
    [requests]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token || !userId || !isValidObjectId(userId)) {
      setSubmitError("Session issue detected. Please log in again.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const response = await axios.post(
        "http://localhost:5000/api/relief/create",
        {
          ...formData,
          createdBy: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const created = response.data?.relief;
      if (created) {
        setRequests((prev) => [created, ...prev]);
      }

      setFormData({
        title: "",
        description: "",
        location: "",
        priority: "Medium",
      });
      setToast("Emergency request sent successfully");
      await fetchUserRequests();
    } catch (submitError) {
      setSubmitError(submitError.response?.data?.message || "Unable to create request");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#050511] text-white p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sky-300 text-sm uppercase tracking-[0.18em]">Requester Emergency Page</p>
            <h1 className="text-3xl font-semibold">Your Emergency Requests</h1>
          </div>
          <Link
            to="/profile"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-gray-200 transition-colors hover:border-sky-400/50 hover:text-white"
          >
            Profile
          </Link>
        </div>

        {toast && (
          <div className="mb-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {toast}
          </div>
        )}

        {submitError && (
          <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {submitError}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-[#0a0a14] p-6">
            <h2 className="mb-4 text-xl font-semibold">Create Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="w-full rounded-xl border border-white/10 bg-[#0d0d18] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-[#0d0d18] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
              />

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                required
                className="w-full rounded-xl border border-white/10 bg-[#0d0d18] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
              />

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0d0d18] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/60"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 px-5 py-3 font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Emergency Request
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0a0a14] p-6">
            <h2 className="mb-4 text-xl font-semibold">Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-gray-400">Pending</p>
                <p className="mt-1 text-2xl font-semibold text-amber-300">{pendingCount}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-gray-400">Completed</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-300">{completedCount}</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
              <p className="mb-1 inline-flex items-center gap-2 text-sky-300">
                <AlertTriangle className="h-4 w-4" />
                Live Sync Active
              </p>
              <p>Request status auto-refreshes every 5 seconds.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0a0a14] p-6">
          <h2 className="mb-4 text-xl font-semibold">Your Requests</h2>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-gray-300">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading your requests...
            </div>
          ) : requests.length === 0 ? (
            <p className="py-6 text-sm text-gray-400">No requests found yet.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="rounded-xl border border-white/10 bg-[#0d0d18] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{request.title}</h3>
                      <p className="mt-1 inline-flex items-center gap-1 text-sm text-gray-400">
                        <MapPin className="h-3.5 w-3.5" />
                        {request.location}
                      </p>
                    </div>

                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(request.status)}`}>
                      {String(request.status || "pending").toLowerCase() === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-300">{request.description || "No description provided."}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Priority: {request.priority}</span>
                    <span>Created: {formatDate(request.createdAt)}</span>
                    {String(request.status || "").toLowerCase() === "completed" && (
                      <span className="inline-flex items-center gap-1 text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Completed by volunteer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequesterDashboard;
