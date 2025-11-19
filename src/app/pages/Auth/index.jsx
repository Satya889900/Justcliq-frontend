// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import JSTcliqBlue from "assets/TransparentJstCliq.png";
import { useAuthContext } from "app/contexts/auth/context";
import { DASHBOARD_HOME_PATH } from "constants/app.constant.js";
import { setSession } from "utils/jwt";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthContext();

  // Redirect after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: email, password }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success && data.data?.accessToken) {
        // Save token
        localStorage.setItem("authToken", data.data.accessToken);
        setSession(data.data.accessToken);


        // Update auth context
        await login({
          accessToken: data.data.accessToken,
          user: data.data.user,
        });

        console.log("hi");

        // Redirect immediately after login
        // Redirect after login
        // Determine the correct redirect path
        let redirectTo = DASHBOARD_HOME_PATH; // default fallback

        if (
          location?.state?.from &&
          typeof location.state.from === "string" &&
          location.state.from.trim() !== "" &&
          location.state.from.toLowerCase() !== "null" &&
          location.state.from.toLowerCase() !== "undefined"
        ) {
          redirectTo = location.state.from;
        }

        console.log("Redirecting to:", redirectTo);
        navigate(redirectTo, { replace: true });
      } else if (response.status === 401 || !data.success) {
        console.log("data " + JSON.stringify(data));
        setError(data.message || "Username or password is incorrect");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#e3f2fd] to-[#f0f4f8] p-6 md:flex-row">
      {/* Logo Section */}
      <div className="mb-10 text-center md:mr-20 md:mb-0">
        <img
          src={JSTcliqBlue}
          alt="JSTcliq Logo"
          className="mx-auto h-auto w-60 object-contain sm:w-48 md:w-90"
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl md:p-10">
        <h2 className="mb-2 text-center text-3xl font-bold text-[#233B9C]">
          Admin Login
        </h2>
        <p className="mb-6 text-center text-[#555]">Welcome Back 👋</p>

        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Input */}
          <div className="relative">
            <Mail
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition focus:ring-2 focus:ring-[#6590D0] focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition focus:ring-2 focus:ring-[#6590D0] focus:outline-none"
            />
          </div>

          {/* Form Options */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-[#233B9C]" />
              Remember Me
            </label>
            <a
              href="#"
              className="text-[#233B9C] transition hover:text-[#6590D0]"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center rounded-lg bg-[#233B9C] py-3 text-lg font-semibold text-white transition hover:bg-[#1a2e78] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
