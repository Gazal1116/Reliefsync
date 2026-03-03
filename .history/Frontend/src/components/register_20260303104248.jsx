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
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-purple-600 opacity-30 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-600 opacity-30 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">

        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#1a1a2e] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#1a1a2e] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#1a1a2e] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <button
            type="submit"
            className="w-full p-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Register
          </button>

        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?
          <span className="text-purple-400 hover:underline cursor-pointer ml-1">
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;