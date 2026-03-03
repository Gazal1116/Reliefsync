import { useEffect, useState } from "react";
import { Trash2, LayoutDashboard, ClipboardList } from "lucide-react";

function ReliefRequests() {
  const [requests, setRequests] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/relief/all")
      .then(res => res.json())
      .then(data => setRequests(Array.isArray(data) ? data : []))
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRequest = {
      title,
      location,
      priority,
      status: "Pending",
      createdAt: new Date()
    };

    const res = await fetch("http://localhost:5000/api/reliefrequests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRequest),
    });

    const data = await res.json();
    setRequests([...requests, data]);
    setTitle("");
    setLocation("");
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/reliefrequests/${id}`, {
      method: "DELETE"
    });
    setRequests(requests.filter(req => req._id !== id));
  };

  const toggleStatus = (id, currentStatus) => {
    const updatedStatus = currentStatus === "Pending" ? "Completed" : "Pending";

    await fetch(`http://localhost:5000/api/reliefrequests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: updatedStatus })
    });

    setRequests(requests.map(req =>
      req._id === id ? { ...req, status: updatedStatus } : req
    ));
  };

  const filtered = requests.filter(req =>
    req.title.toLowerCase().includes(search.toLowerCase())
  );

  // 📊 Stats Calculation
  const total = requests.length;
  const pending = requests.filter(r => r.status === "Pending").length;
  const completed = requests.filter(r => r.status === "Completed").length;

  return (
    <div className="flex min-h-screen bg-[#0b0b14] text-white">

      {/* Sidebar */}
      <div className="w-64 bg-[#111120] border-r border-white/10 p-6">
        <h1 className="text-xl font-semibold mb-10 text-purple-400">
          ReliefSync
        </h1>

        <div className="space-y-6 text-gray-300">
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">
            <LayoutDashboard size={18} />
            Dashboard
          </div>

          <div className="flex items-center gap-3 text-white">
            <ClipboardList size={18} />
            Relief Requests
          </div>
        </div>
      </div>
      

      {/* Main Content */}
      <div className="flex-1 p-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">
            Manage Relief Requests
          </h2>
          <p className="text-gray-400">
            Track, prioritize and manage all emergency assistance requests.
          </p>
        </div>

        {/* 📊 Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-[#141423] rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-gray-400">Total Requests</h3>
            <p className="text-3xl font-bold mt-2">{total}</p>
          </div>

          <div className="p-6 bg-[#141423] rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-gray-400">Pending</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-400">{pending}</p>
          </div>

          <div className="p-6 bg-[#141423] rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-gray-400">Completed</h3>
            <p className="text-3xl font-bold mt-2 text-green-400">{completed}</p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-8 p-3 rounded-lg bg-[#1b1b2d] border border-gray-700"
        />

        <div className="grid md:grid-cols-3 gap-8">

          {/* Form */}
          <div className="bg-[#141423] p-6 rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Add New Request
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Request Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#1b1b2d] border border-gray-700"
              />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#1b1b2d] border border-gray-700"
              />

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#1b1b2d] border border-gray-700"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 
                           rounded-lg hover:opacity-90 transition"
              >
                Add Request
              </button>

            </form>
          </div>

          {/* Request List */}
          <div className="md:col-span-2 space-y-6">

            {filtered.length === 0 && (
              <div className="text-gray-500 text-center py-20 border border-dashed border-gray-700 rounded-xl">
                No relief requests found.
              </div>
            )}

            {filtered.map((req) => (
              <div
                key={req._id}
                className="p-6 bg-[#141423] rounded-2xl border border-white/10 
                           hover:-translate-y-1 hover:shadow-purple-500/20 
                           transition-all duration-300"
              >
                <div className="flex justify-between items-center">

                  <div>
                    <h3 className="text-lg font-semibold">{req.title}</h3>
                    <p className="text-gray-400">{req.location}</p>

                    <div className="flex gap-3 mt-3 text-sm">
                      <span className={`px-3 py-1 rounded-full ${
                        req.priority === "High"
                          ? "bg-red-500/20 text-red-400"
                          : req.priority === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}>
                        {req.priority} Priority
                      </span>

                      <button
                        onClick={() => toggleStatus(req._id, req.status)}
                        className={`px-3 py-1 rounded-full ${
                          req.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {req.status}
                      </button>
                    </div>
                  </div>

                  <Trash2
                    onClick={() => handleDelete(req._id)}
                    className="cursor-pointer text-red-400 hover:text-red-500"
                    size={18}
                  />

                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ReliefRequests;