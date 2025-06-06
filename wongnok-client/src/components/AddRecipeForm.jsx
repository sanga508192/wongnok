import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AddRecipeForm({ onRecipeAdded }) {
  const [form, setForm] = useState({
    name: "",
    ingredients: "",
    duration: "5 - 10 mins",
    difficulty: "ง่าย",
    imageFile: null, // ⬅️ เพิ่ม
  });

  const { token } = useAuth();

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("image", form.imageFile);

    const res = await fetch("http://localhost:5000/api/recipes/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const json = await res.json();
    return json.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";
    if (form.imageFile) {
      imageUrl = await handleImageUpload();
    }

    const newRecipe = {
      name: form.name,
      ingredients: form.ingredients.split(",").map((i) => i.trim()),
      duration: form.duration,
      difficulty: form.difficulty,
      imageUrl,
    };

    try {
      const res = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRecipe),
      });

      if (res.ok) {
        alert("✅ บันทึกสำเร็จ");
        setForm({
          name: "",
          ingredients: "",
          duration: "5 - 10 mins",
          difficulty: "ง่าย",
          imageFile: null,
        });
        onRecipeAdded();
      } else {
        alert("❌ บันทึกไม่สำเร็จ");
      }
    } catch (err) {
      console.error("❌ POST error:", err);
      alert("❌ บันทึกไม่สำเร็จ (catch)");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2 items-center">
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 rounded w-1/4"
        placeholder="ชื่อเมนู"
        required
      />
      <input
        value={form.ingredients}
        onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
        className="border p-2 rounded w-1/3"
        placeholder="วัตถุดิบ (คั่นด้วย ,)"
        required
      />
      <select
        value={form.duration}
        onChange={(e) => setForm({ ...form, duration: e.target.value })}
        className="border p-2 rounded"
      >
        <option>5 - 10 mins</option>
        <option>10 - 30 mins</option>
        <option>30 - 60 mins</option>
        <option>มากกว่า 60 mins</option>
      </select>
      <select
        value={form.difficulty}
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
        className="border p-2 rounded"
      >
        <option>ง่าย</option>
        <option>ปานกลาง</option>
        <option>ยาก</option>
      </select>

      {/* ✅ ปุ่มเลือกรูป */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
        className="border p-2 rounded"
      />

      <button className="bg-green-500 text-white px-4 py-2 rounded">
        ✅ บันทึกสูตรอาหาร
      </button>
    </form>
  );
}

export default AddRecipeForm;
