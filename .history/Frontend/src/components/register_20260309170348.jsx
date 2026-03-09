import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Register() {

const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: ""
});

const navigate = useNavigate();

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...formData,
        role: "volunteer"
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert(data.message || "Registered successfully");
    navigate("/request");

  } catch (error) {
    alert("Network error");
    console.log(error);
  }
};

return (
  <div className="min-h-screen flex items-center justify-center bg-[#0b0b14] relative overflow-hidden">

    <div className="absolute w-[400px] h-[400px] bg-purple-700 opacity-20 blur-3xl rounded-full top-[-120px] left-[-120px]"></div>
    <div className="absolute w-[400px] h-[400px] bg-blue-700 opacity-20 blur-3xl rounded-full bottom-[-120px] right-[-120px]"></div>

    <div className="relative z-10 w-full max-w-sm p-10 rounded-3xl 
                    bg-[#141423]/90 backdrop-blur-xl
                    border border-white/10 shadow-2xl">

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
          required
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-[#1b1b2d] text-white border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-[#1b1b2d] text-white border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-[#1b1b2d] text-white border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-medium text-white 
                     bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"
        >
          Register
        </button>

      </form>

      <p className="text-gray-400 text-sm text-center mt-8">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-purple-400 cursor-pointer"
        >
          Login
        </span>
      </p>

    </div>
  </div>
);
}

export default Register;