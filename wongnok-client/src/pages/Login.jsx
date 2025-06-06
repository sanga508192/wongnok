import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "เข้าสู่ระบบไม่สำเร็จ");
    } else {
      login(data.token);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-white">
      {/* ✅ Vision Section */}
      <div className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-8">
        <img
          src="/vision.png"
          alt="vision"
          className="rounded-xl shadow-xl mb-6 w-full h-auto max-h-[400px] object-cover border-4 border-white"
        />
        <h2 className="text-4xl font-extrabold mb-4">🌟 Vision</h2>
        <p className="leading-relaxed text-lg text-white/90">
          บริษัท วงนอก จำกัด (มหาชน) เชื่อว่าอาหารให้ความสำคัญกับชีวิต...
          <br /><br />
          เชฟโต้้ง ในฐานะ CTO ของบริษัท มีไอเดียในการสร้างเว็บแอปพลิเคชันรวมสูตรอาหาร...
          <br /><br />
          ซึ่งเชฟโต้้งเชื่อว่าเว็บแอป “Wongnok Recipes” นี้ จะช่วยให้สังคมน่าอยู่ขึ้น...
        </p>
      </div>

      {/* ✅ Login Form Section */}
      <div className="w-full md:w-1/3 bg-white p-8 shadow-xl rounded-xl text-gray-800">
        <h2 className="text-3xl font-bold mb-4 text-center">🔐 เข้าสู่ระบบ</h2>
        {error && <p className="text-red-600 mb-2 text-center font-medium">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="ชื่อผู้ใช้"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            name="password"
            placeholder="รหัสผ่าน"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded font-semibold hover:bg-purple-700 transition"
          >
            ✅ เข้าสู่ระบบ
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          ยังไม่มีบัญชี? {" "}
          <a href="/register" className="text-purple-600 font-medium underline">
            สมัครสมาชิก
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
