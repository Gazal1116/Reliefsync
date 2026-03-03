import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b14] relative overflow-hidden">

      {/* Soft Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-purple-700 opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-700 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm p-10 rounded-3xl bg-[#141423] border border-white/10 shadow-2xl">

        <h2 className="text-3xl font-semibold text-center mb-2 text-white">
          Create Account
        </h2>

        <p className="text-gray-400 text-sm text-center mb-8">
          Join ReliefSync and manage relief efforts efficiently
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-[#1b1b2d] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-[#1b1b2d] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-[#1b1b2d] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 transition shadow-lg"
          >
            Register
          </button>

        </form>

        <p className="text-gray-400 text-sm text-center mt-8">
          Already have an account?{" "}
          <span className="text-purple-400 hover:text-purple-300 cursor-pointer transition">
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;