import { useState } from "react";
import { ShieldCheck, User, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "volunteer" })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }
      localStorage.setItem('relief_token', data.token || '');
      localStorage.setItem('relief_user', JSON.stringify(data.user || {}));
      alert(data.message || "Registered successfully");
      navigate("/dashboard");
    } catch (error) {
      alert("Network error");
      console.log(error);
    }
  };

  const inputBase =
    "w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0d0d18] text-white border border-white/10 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400/50 hover:border-white/20 transition-all duration-300";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050511] relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-sky-900/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/25 blur-[100px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full translate-y-1/2" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          ← Back to home
        </Link>

        <div className="rounded-3xl bg-[#0a0a14]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-purple-900/20 p-8 sm:p-10">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 border border-white/20 shadow-lg shadow-purple-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-white tracking-wide">ReliefSync</span>
          </div>

          <h2 className="text-2xl font-semibold text-white text-center mb-1">
            Create account
          </h2>
          <p className="text-gray-400 text-sm text-center mb-8">
            Join as a volunteer and start helping
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="name"
                placeholder="Full name"
                required
                onChange={handleChange}
                className={inputBase}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                onChange={handleChange}
                className={inputBase}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 shadow-lg shadow-purple-500/40 hover:shadow-purple-400/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Create account
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;