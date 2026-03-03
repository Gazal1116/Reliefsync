import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

function ReliefRequests() {
  const [requests, setRequests] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");

  // Fetch Data
  useEffect(() => {
    fetch("http://localhost:5000/api/reliefrequests")
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.log(err));
  }, []);

  // Add Request
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRequest = {
      title,
      location,
      status: "Pending"
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

  // Delete Request
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/reliefrequests/${id}`, {
      method: "DELETE"
    });

    setRequests(requests.filter(req => req._id !== id));
  };

  // Filtered
  const filtered = requests.filter(req =>
    req.title.toLowerCase().includes(search.toLowerCase())
  );

  const total = requests.length;
  const pending = requests.filter(r => r.status === "Pending").length;
  const completed = requests.filter(r => r.status === "Completed").length;

  return (
    <div className="min-h-screen bg-[#0b0b14] text-white p-8">

      <h1 className="text-3xl font-semibold mb-8">Relief Requests</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-[#141423] rounded-2xl border border-white/10">
          <h3>Total Requests</h3>
          <p className="text-3xl font-bold mt-2">{total}</p>
        </div>
        <div className="p-6 bg-[#141423] rounded-2xl border border-white/10">
          <h3>Pending</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-400">{pending}</p>
        </div>
        <div className="p-6 bg-[#141423] rounded-2xl border border-white/10">
          <h3>Completed</h3>
          <p className="text-3xl font-bold mt-2 text-green-400">{completed}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {/* Form Section */}
        <div className="bg-[#141423] p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Add New Request</h2>

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

            <button
              type="submit"
              className="w-full py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
            >
              Add Request
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="md:col-span-2">

          {/* Search */}
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 p-3 rounded-lg bg-[#1b1b2d] border border-gray-700"
          />

          <div className="grid gap-6">
            {filtered.map((req) => (
              <div
                key={req._id}
                className="p-6 bg-[#141423] rounded-2xl border border-white/10 
                           hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{req.title}</h2>
                    <p className="text-gray-400">{req.location}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        req.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {req.status}
                    </span>

                    <Trash2
                      onClick={() => handleDelete(req._id)}
                      className="cursor-pointer text-red-400 hover:text-red-500"
                      size={18}
                    />
                  </div>
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