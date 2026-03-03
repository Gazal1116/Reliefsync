{showModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm 
                  flex justify-center items-center z-50">

    <div className="bg-[#141423] w-[450px] p-8 rounded-2xl 
                    border border-white/10 shadow-2xl">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Create Relief Request</h2>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      <form onSubmit={(e) => {
        handleSubmit(e);
        setShowModal(false);
      }} className="space-y-4">

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