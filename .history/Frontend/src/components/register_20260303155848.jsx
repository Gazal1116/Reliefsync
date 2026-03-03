import { useState } from "react";
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
    <div className="min-h-screen flex items-center justify-center bg-[#070712] py-12 px-4">
      <div className="w-full max-w-5xl bg-transparent rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">

        {/* Left marketing panel */}
        <div className="hidden md:flex flex-col justify-center panel-left p-10">
          <div className="text-white">
            <h3 className="text-3xl font-bold mb-3">One platform for relief coordination</h3>
            <p className="mb-6 text-white/90">Coordinate volunteers, manage requests and deliver aid faster with an intuitive dashboard.</p>
            <ul className="space-y-2">
              <li>• Create & manage relief requests</li>
              <li>• Assign volunteers & resources</li>
              <li>• Track deliveries & status</li>
            </ul>
          </div>
        </div>

        {/* Right form panel */}
        <div className="panel-right bg-[#0f1116] p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-teal-400">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">ReliefSync</h2>
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
                className="w-full px-4 py-3 rounded-lg bg-[#0b0b12] border border-white/6 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-lg bg-[#0b0b12] border border-white/6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Create password"
                className="w-full px-4 py-3 rounded-lg bg-[#0b0b12] border border-white/6 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:scale-[1.02] transition-transform disabled:opacity-60"
                >
                  {loading ? 'Creating...' : 'Create account'}
                </button>
                <button type="button" onClick={() => navigate('/login')} className="text-sm text-gray-300 hover:underline">Login</button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">By creating an account you agree to our <span className="text-teal-300">Terms</span> and <span className="text-teal-300">Privacy Policy</span>.</p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
}

export default Register;