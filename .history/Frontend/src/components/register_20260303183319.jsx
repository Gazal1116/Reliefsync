import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Register() {
const [formData, setFormData] = useState({
  title: "",
  description: "",   
  location: "",
  priority: "Medium",
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'volunteer' })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Registration failed');
        return;
      }
      alert(data.message || 'Registered successfully');
      navigate('/login');
    } catch (err) {
      alert(err.message || 'Network error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b14] relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-purple-700 opacity-20 blur-3xl rounded-full top-[-120px] left-[-120px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-700 opacity-20 blur-3xl rounded-full bottom-[-120px] right-[-120px]"></div>

      {/* Card */}
<div className="relative z-10 w-full max-w-sm p-10 rounded-3xl 
                bg-[#141423]/90 backdrop-blur-xl
                border border-white/10 shadow-2xl 
                transition-all duration-500 
                hover:-translate-y-2 
                hover:shadow-purple-500/30 
                hover:border-purple-500/50">

        {/* Branding */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <ShieldCheck className="text-purple-400 w-7 h-7" />
          <h1 className="text-xl font-semibold text-white tracking-wide">
            ReliefSync
          </h1>
        </div>

        <h2 className="text-2xl font-semibold text-center text-white mb-2">
          Create Account
        </h2>

        <p className="text-gray-400 text-sm text-center mb-8">
          Manage and coordinate relief efforts efficiently
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-[#1b1b2d] text-white border border-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       hover:border-purple-500 transition-all duration-300"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-[#1b1b2d] text-white border border-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       hover:border-blue-500 transition-all duration-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-[#1b1b2d] text-white border border-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       hover:border-purple-500 transition-all duration-300"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-medium text-white 
                       bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 
                       hover:scale-[1.02] hover:shadow-purple-500/40 
                       transition-all duration-300 shadow-lg"
          >
            Register
          </button>

        </form>

          <p className="text-gray-400 text-sm text-center mt-8">
          Already have an account?{" "}
          <span onClick={() => navigate('/relief')} className="text-purple-400 hover:text-purple-300 cursor-pointer transition">
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;