import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ShieldCheck, MapPin, Plus, Activity } from "lucide-react";

const ReliefRequests = () => {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    priority: "Medium",
  });

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/relief/all"
      );
      setRequests(res.data);
    } catch (err) {
      console.log(err);
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
      await axios.post(
        "http://localhost:5000/api/relief/create",
        formData
      );

      setFormData({
        title: "",
        location: "",
        description: "",
        priority: "Medium",
      });

      fetchRequests();
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const total = requests.length;
  const pending = requests.filter(
    (r) => r.status === "Pending"
  ).length;
  const completed = requests.filter(
    (r) => r.status === "Completed"
  ).length;

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

        <ul className="space-y-4">
          <li className="text-gray-400 hover:text-purple-400 cursor-pointer transition-colors">Dashboard</li>
          <li className="text-purple-400 font-semibold">Relief Requests</li>

          <li className="pt-6">
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Create Request
            </button>
          </li>
        </ul>
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
                  <div
                    key={req._id}
                    className="p-4 rounded-xl bg-[#0d0d18] border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <h4 className="font-semibold">{req.title}</h4>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {req.location}
                    </p>
                    <p className="text-sm mt-2">
                      Priority: <span className="text-purple-400">{req.priority}</span>
                    </p>
                    <p className="text-sm">
                      Status: <span className={req.status === "Completed" ? "text-emerald-400" : "text-amber-400"}>{req.status}</span>
                    </p>
                  </div>
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