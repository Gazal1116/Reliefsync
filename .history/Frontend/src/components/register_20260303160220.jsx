import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!formData.name || !formData.email || !formData.password) {
      setMessage('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'volunteer' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setMessage(data.message || 'Registered successfully');
      setFormData({ name: '', email: '', password: '' });
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setMessage(err.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900/80 to-indigo-950 py-12 px-4 font-sans text-slate-100">
      <div className="w-full max-w-5xl bg-transparent rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">

        {/* Left marketing panel */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-purple-700 via-indigo-700 to-violet-700 text-white gap-6">
          <div className="text-white">
            <h3 className="text-3xl font-bold mb-3">One platform for relief coordination</h3>
            <p className="mb-6 text-white/90">Coordinate volunteers, manage requests and deliver aid faster with an intuitive dashboard.</p>
            <ul className="space-y-2 text-white/90 leading-relaxed">
              <li>• Create & manage relief requests with ease</li>
              <li>• Assign volunteers & resources efficiently</li>
              <li>• Track deliveries, status and completion</li>
            </ul>
          </div>
        </div>

        {/* Right form panel */}
        <div className="p-10 bg-slate-800/60 backdrop-blur-sm">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-teal-400">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white/95">ReliefSync</h2>
                <p className="text-sm text-gray-300">Secure relief coordination</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Create your account</h3>
            <p className="text-sm text-gray-400 mb-6">Sign up to start requesting and managing relief operations.</p>

            {message && <div className="mb-4 text-sm text-center text-red-400">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-shadow hover:shadow-md"
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow hover:shadow-md"
              />

              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Create password"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-shadow hover:shadow-md"
              />

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transform transition shadow-lg disabled:opacity-60"
                >
                  {loading ? 'Creating...' : 'Create account'}
                </button>
                <button type="button" onClick={() => navigate('/login')} className="text-sm text-slate-300 hover:text-white/90">Login</button>
              </div>

              <p className="text-xs text-slate-400 text-center mt-3">By creating an account you agree to our <span className="text-emerald-300">Terms</span> and <span className="text-emerald-300">Privacy Policy</span>.</p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;