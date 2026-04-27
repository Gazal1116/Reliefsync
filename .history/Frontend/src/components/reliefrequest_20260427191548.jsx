import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { ShieldCheck, MapPin, Plus, Activity } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReliefRequests = () => {
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const token = localStorage.getItem("relief_token");
  const userId = localStorage.getItem("userId");

  let userData = {};
  try {
    userData = JSON.parse(localStorage.getItem("relief_user") || "{}");
  } catch {
    userData = {};
  }

  const userRole = (userData.role || "").toLowerCase();
  const isVolunteer = userRole === "volunteer";
  const activeUserId = userId || userData.id || "";

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    priority: "Medium",
  });

  const fetchRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/relief/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreateError("");
      setCreateSuccess("");
      await axios.post(
        "http://localhost:5000/api/relief/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        title: "",
        location: "",
        description: "",
        priority: "Medium",
      });

      fetchRequests();
      setCreateSuccess("Request created successfully.");
      setShowModal(false);
    } catch (err) {
      setCreateError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create request"
      );
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const total = requests.length;
  const pending = requests.filter(
    (r) => String(r.status).toLowerCase() === "pending"
  ).length;
  const completed = requests.filter(
    (r) => String(r.status).toLowerCase() === "completed"
  ).length;

  const isOwnedByVolunteer = (item) => {
    if (!activeUserId) return false;

    const createdBy = item?.createdBy;
    const assignedTo = item?.assignedTo;

    const matchesId = (value) => {
      if (!value) return false;
      if (typeof value === "string") return value === activeUserId;
      if (typeof value === "object") {
        if (value._id) return String(value._id) === activeUserId;
        if (value.id) return String(value.id) === activeUserId;
      }
      return false;
    };

    return matchesId(createdBy) || matchesId(assignedTo);
  };

  const volunteerRequests = requests.filter(isOwnedByVolunteer);
  const volunteerTotal = volunteerRequests.length;
  const volunteerCompleted = volunteerRequests.filter(
    (r) => String(r.status).toLowerCase() === "completed"
  ).length;
  const volunteerPending = volunteerRequests.filter(
    (r) => String(r.status).toLowerCase() === "pending"
  ).length;
  const volunteerEfficiency =
    volunteerTotal === 0 ? 0 : Math.round((volunteerCompleted / volunteerTotal) * 100);

  const chartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Requests",
        data: [volunteerCompleted, volunteerPending],
        backgroundColor: ["rgba(16, 185, 129, 0.75)", "rgba(245, 158, 11, 0.75)"],
        borderColor: ["rgba(16, 185, 129, 1)", "rgba(245, 158, 11, 1)"],
        borderWidth: 1,
        borderRadius: 8,
        maxBarThickness: 64,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Volunteer Request Insights",
        color: "#cbd5e1",
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.08)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#cbd5e1", precision: 0 },
        grid: { color: "rgba(255,255,255,0.08)" },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-[#050511] text-white">

      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a14] border-r border-white/5 p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          ← Back to home
        </Link>

        <div className="flex items-center gap-2 mb-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 border border-white/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">ReliefSync</span>
        </div>

        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white hover:border-purple-400/40 hover:bg-white/10 transition-all"
          >
            Dashboard
          </Link>

          <div className="rounded-xl border border-purple-400/30 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-300">
            Relief Requests
          </div>

          <Link
            to="/profile"
            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white hover:border-purple-400/40 hover:bg-white/10 transition-all"
          >
            Profile
          </Link>

          {isVolunteer ? (
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-emerald-300">Volunteer Analytics</h4>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-1 text-xs text-emerald-200">
                  Efficiency: {volunteerEfficiency}%
                </span>
              </div>
              <div className="space-y-2 text-xs text-gray-200">
                <p>Total Requests Handled: <span className="text-white font-semibold">{volunteerTotal}</span></p>
                <p>Completed Requests: <span className="text-emerald-300 font-semibold">{volunteerCompleted}</span></p>
                <p>Pending Requests: <span className="text-amber-300 font-semibold">{volunteerPending}</span></p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Create Request
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">

        <h2 className="text-4xl font-bold mb-2">
          Manage Relief Requests
        </h2>

        <p className="text-gray-400 mb-8">
          Track and manage emergency assistance.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-[#0a0a14] border border-white/10 p-6 rounded-2xl hover:border-purple-500/30 transition-colors">
            <p className="text-gray-400 text-sm">Total</p>
            <h3 className="text-3xl font-bold mt-1">{total}</h3>
          </div>

          <div className="bg-[#0a0a14] border border-white/10 p-6 rounded-2xl hover:border-amber-500/30 transition-colors">
            <p className="text-amber-400 text-sm">Pending</p>
            <h3 className="text-3xl font-bold text-amber-400 mt-1">{pending}</h3>
          </div>

          <div className="bg-[#0a0a14] border border-white/10 p-6 rounded-2xl hover:border-emerald-500/30 transition-colors">
            <p className="text-emerald-400 text-sm">Completed</p>
            <h3 className="text-3xl font-bold text-emerald-400 mt-1">{completed}</h3>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-8">

          {/* LEFT - Requests */}
          <div className="col-span-2 bg-[#0a0a14] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4">All Requests</h3>

            {requests.length === 0 ? (
              <p className="text-gray-400">No relief requests found.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <Link
                    key={req._id}
                    to={`/request/${req._id}`}
                    className="block p-4 rounded-xl bg-[#0d0d18] border border-white/10 hover:border-purple-500/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-white">{req.title}</h4>
                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {req.location}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${req.status === "Completed" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-sm mt-3 text-gray-300">
                      Priority: <span className="text-purple-300">{req.priority}</span>
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">

            {/* Recent Activity */}
            <div className="bg-[#0a0a14] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Recent Activity
              </h3>
              {requests.slice(0, 3).map((req) => (
                <div key={req._id} className="text-sm mb-3 text-gray-300">
                  • {req.title}
                </div>
              ))}
              {requests.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No recent activity.
                </p>
              )}
            </div>

            {/* System Overview */}
            <div className="bg-[#0a0a14] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">
                System Overview
              </h3>

              <p className="text-sm text-gray-300 mb-2">
                Active Emergencies: {pending}
              </p>

              <p className="text-sm text-gray-300 mb-2">
                Response Efficiency:{" "}
                {total === 0
                  ? "0%"
                  : Math.round((completed / total) * 100) + "%"}
              </p>

              <p className="text-sm text-gray-300">
                Database Status: Online
              </p>
            </div>

            {/* Emergency Tip */}
            <div className="bg-gradient-to-r from-purple-600/90 via-indigo-600/90 to-sky-600/90 border border-white/20 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-2">
                Emergency Tip
              </h3>
              <p className="text-sm">
                Always verify urgency and exact location before dispatching aid teams.
              </p>
            </div>

            {isVolunteer && (
              <div className="bg-[#0a0a14] border border-white/10 p-6 rounded-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Volunteer Analytics</h3>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                    Efficiency: {volunteerEfficiency}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-gray-400 text-xs">Handled</p>
                    <p className="text-xl font-semibold">{volunteerTotal}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-gray-400 text-xs">Completed</p>
                    <p className="text-xl font-semibold text-emerald-300">{volunteerCompleted}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 col-span-2">
                    <p className="text-gray-400 text-xs">Pending</p>
                    <p className="text-xl font-semibold text-amber-300">{volunteerPending}</p>
                  </div>
                </div>

                {requestsLoading ? (
                  <div className="h-56 rounded-xl border border-white/10 bg-white/5 animate-pulse" />
                ) : (
                  <div className="h-56 rounded-xl border border-white/10 bg-white/5 p-3">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-[#0a0a14] border border-white/10 p-8 rounded-2xl w-full max-w-md relative shadow-2xl shadow-purple-900/20">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-6">Add New Request</h3>

            {createError && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {createError}
              </div>
            )}

            {createSuccess && (
              <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {createSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Request Title"
                className="w-full p-3.5 rounded-xl bg-[#0d0d18] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400/50"
                required
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full p-3.5 rounded-xl bg-[#0d0d18] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400/50"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description (optional)"
                rows={3}
                className="w-full p-3.5 rounded-xl bg-[#0d0d18] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400/50 resize-none"
              />

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-[#0d0d18] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Add Request
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReliefRequests;