import { useEffect, useState } from "react";

function ReliefRequests() {
  const [requests, setRequests] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  // Fetch All Requests
  useEffect(() => {
    fetch("http://localhost:5000/api/reliefrequests")
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.log(err));
  }, []);

  // Add New Request
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRequest = { title, location };

    const res = await fetch("http://localhost:5000/api/reliefrequests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRequest),
    });

    const data = await res.json();
    setRequests([...requests, data]);
    setTitle("");
    setLocation("");
  };

  return (
    <div className="min-h-screen bg-[#0b0b14] text-white p-8">

      <h1 className="text-3xl font-semibold mb-6">Relief Requests</h1>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-md">
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
          className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          Add Request
        </button>
      </form>

      {/* List */}
      <div className="grid md:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div
            key={req._id}
            className="p-6 rounded-2xl bg-[#141423] border border-white/10 shadow-lg"
          >
            <h2 className="text-lg font-semibold">{req.title}</h2>
            <p className="text-gray-400">{req.location}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ReliefRequests;