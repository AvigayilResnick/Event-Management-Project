import React, { useState, useContext } from "react";
import { signup, login } from "../api/auth";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // ✅ נוסיף את זה אם נרצה להשתמש ב-navigate

const AuthModal = ({ isOpen, onClose }) => {
  const { login: doLogin } = useContext(AuthContext);
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ מאפשר לנו להשתמש בניווט פנימי

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ פונקציה מסודרת לשימוש חוזר
  const handleRedirectAfterLogin = (role) => {
    const redirect = localStorage.getItem("redirectAfterLogin");
    if (redirect) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirect); // ✅ משתמשים ב-react-router navigate
    } else if (role === "admin") {
      navigate("/admin/requests");
    } else if (role === "supplier") {
      navigate("/supplier-dashboard");
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data =
        mode === "signup"
          ? await signup(form)
          : await login({ email: form.email, password: form.password });

      doLogin(data.user, data.token);
      setForm({
        full_name: "",
        email: "",
        password: "",
        phone: "",
      });
      if (error) setError("");
      onClose();

      // ✅ ניתוב אחרי התחברות
      handleRedirectAfterLogin(data.user.role);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative">
        <button
          onClick={() => {
            onClose();
            setForm({
              full_name: "",
              email: "",
              password: "",
              phone: "",
            });
          }}
          className="absolute top-4 right-4 text-xl font-bold text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-2xl mb-4 text-center font-bold text-pink-600">
          {mode === "signup" ? "Create Account" : "Log In"}
        </h2>

        {error && (
          <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border rounded px-4 py-2"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="border rounded px-4 py-2"
          />

          {mode === "signup" && (
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2"
            />
          )}

          <button
            type="submit"
            className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
          >
            {mode === "signup" ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {mode === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setError("");
            }}
          >
            {mode === "signup" ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
