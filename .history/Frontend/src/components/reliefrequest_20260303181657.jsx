import React, { useState, useEffect } from "react";
import axios from "axios";

const ReliefRequests = () => {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
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
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#1b1b2f] to-[#16213e] text-white">

      {/* Sidebar */}
      <div className="w-64 bg-[#0d0d1a] p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-purple-400 mb-10">
          ReliefSync
        </h1>

        <ul className="space-y-4">
          <li className="hover:text-purple-400 cursor-pointer">
            Dashboard
          </li>

          <li className="text-purple-400 font-semibold">
            Relief Requests
          </li>

          <li className="mt-8">
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-all duration-300"
            >
              + Create Request
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
          <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-lg">
            <p className="text-gray-400">Total</p>
            <h3 className="text-3xl font-bold">{total}</h3>
          </div>

          <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-lg">
            <p className="text-yellow-400">Pending</p>
            <h3 className="text-3xl font-bold text-yellow-400">
              {pending}
            </h3>
          </div>

          <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-lg">
            <p className="text-green-400">Completed</p>
            <h3 className="text-3xl font-bold text-green-400">
              {completed}
            </h3>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-8">

          {/* LEFT - Requests */}
          <div className="col-span-2 bg-[#1a1a2e] p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">
              All Requests
            </h3>

            {requests.length === 0 ? (
              <p className="text-gray-400">
                No relief requests found.
              </p>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req._id}
                    className="p-4 bg-[#0f3460] rounded-lg hover:scale-105 transition"
                  >
                    <h4 className="font-semibold">
                      {req.title}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {req.location}
                    </p>
                    <p className="text-sm mt-2">
                      Priority:{" "}
                      <span className="text-purple-400">
                        {req.priority}
                      </span>
                    </p>
                    <p className="text-sm">
                      Status:{" "}
                      <span className="text-yellow-400">
                        {req.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">

            {/* Recent Activity */}
            <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-xl">
              <h3 className="text-lg font-semibold mb-4">
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

            {/* System Overview (No Duplicate Stats) */}
            <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-xl">
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
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-xl shadow-xl">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-[#1a1a2e] p-8 rounded-xl w-96 relative shadow-2xl">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">
              Add New Request
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Request Title"
                className="w-full p-3 rounded-lg bg-[#0f3460] focus:outline-none"
                required
              />
                <input
                     type="text"
  name="title"
  value={formData.title}
  onChange={handleChange}
  placeholder="Request Title"
  className="w-full p-3 rounded-lg bg-[#0f3460]"
  required
/>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full p-3 rounded-lg bg-[#0f3460] focus:outline-none"
                required
              />

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#0f3460]"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-all"
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