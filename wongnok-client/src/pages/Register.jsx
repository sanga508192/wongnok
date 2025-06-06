import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "สมัครไม่สำเร็จ");
    } else {
      alert("✅ สมัครสำเร็จ กรุณาเข้าสู่ระบบ");
      navigate("/login");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">📝 สมัครสมาชิก</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="ชื่อผู้ใช้"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="รหัสผ่าน"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          ✅ สมัครสมาชิก
        </button>
      </form>
    </div>
  );
}

export default Register;
