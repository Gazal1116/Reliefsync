import { useState } from "react";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "requester"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();

  const inputBase =
    "w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0d0d18] text-white border border-white/10 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400/50 hover:border-white/20 transition-all duration-300";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Login failed');
        return;
      }
      localStorage.setItem('relief_token', data.token || '');
      localStorage.setItem('relief_user', JSON.stringify(data.user || {}));
      if (data.user?.id) {
        localStorage.setItem('userId', data.user.id);
      }
      const roleToUse = data.user?.role || formData.role;
      navigate(roleToUse === "volunteer" ? "/dashboard" : "/user-dashboard", { replace: true });
    } catch (err) {
      alert(err.message || 'Network error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050511] relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-sky-900/20" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/25 blur-[100px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full translate-y-1/2" />

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
          ← Back to home
        </Link>

        <div className="rounded-3xl bg-[#0a0a14]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-purple-900/20 p-8 sm:p-10">

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 border border-white/20 shadow-lg shadow-purple-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-white tracking-wide">ReliefSync</span>
          </div>

          <h2 className="text-2xl font-semibold text-center text-white mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm text-center mb-8">Sign in with your role</p>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Select role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-[#0d0d18] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400/50"
              >
                <option value="requester">Request Help (User)</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="email" name="email" placeholder="Email address" required autoComplete="off" onChange={handleChange} className={inputBase} />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="password" name="password" placeholder="Password" required autoComplete="off" onChange={handleChange} className={inputBase} />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 shadow-lg shadow-purple-500/40 hover:shadow-purple-400/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0a0a14] text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.href = 'http://127.0.0.1:5000/api/auth/google'}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.25.81-.59z"
                  fill="#FBBC05"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

        <p className="text-gray-400 text-sm text-center mt-8">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Create account
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}

export default Login;