import React, { useState, useEffect } from "react";
import axios from "axios";

function ReliefRequest() {

  // ===== STATES =====
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("High");

  // ===== FETCH REQUESTS =====
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/relief");
      setRequests(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ===== CREATE REQUEST =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/relief", {
        title,
        location,
        priority,
        status: "Pending"
      });

      setTitle("");
      setLocation("");
      setPriority("High");
      setShowModal(false);

      fetchRequests();
    } catch (error) {
      console.log(error);
    }
  };

  const pendingCount = requests.filter(
    (req) => req.status === "Pending"
  ).length;

  return (
    <div className="flex min-h-screen bg-[#0b0b14] text-white">

      {/* ===== SIDEBAR ===== */}
      <div className="w-64 bg-[#111122] p-6 border-r border-white/10">
        <h1 className="text-2xl font-bold mb-10 text-purple-400">
          ReliefSync
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="w-full py-2 bg-gradient-to-r 
                     from-purple-600 to-blue-600 
                     rounded-lg hover:opacity-90 transition"
        >
          + Create Request
        </button>

        <div className="mt-10 space-y-4 text-gray-400">
          <p>Total Requests: {requests.length}</p>
          <p>Pending Requests: {pendingCount}</p>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-semibold mb-6">
          Relief Requests
        </h2>

        <div className="grid gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-[#141423] p-6 rounded-xl 
                         border border-white/10 
                         hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold">
                {req.title}
              </h3>

              <p className="text-gray-400 mt-2">
                📍 {req.location}
              </p>

              <p className="mt-2">
                Priority:
                <span className="ml-2 text-purple-400">
                  {req.priority}
                </span>
              </p>

              <p className="mt-1">
                Status:
                <span className="ml-2 text-yellow-400">
                  {req.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm 
                        flex justify-center items-center z-50">

          <div className="bg-[#141423] w-[450px] p-8 rounded-2xl 
                          border border-white/10 shadow-2xl">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Create Relief Request
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Request Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 rounded-lg 
                           bg-[#1b1b2d] border border-gray-700"
              />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full p-3 rounded-lg 
                           bg-[#1b1b2d] border border-gray-700"
              />

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 rounded-lg 
                           bg-[#1b1b2d] border border-gray-700"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r 
                           from-purple-600 to-blue-600 
                           rounded-lg hover:opacity-90 transition"
              >
                Submit Request
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default ReliefRequest;