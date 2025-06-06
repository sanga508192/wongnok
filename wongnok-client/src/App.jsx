import { useEffect, useState } from "react";
import AddRecipeForm from "./components/AddRecipeForm";
import { useAuth, decodeJWT } from "./context/AuthContext";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [editForm, setEditForm] = useState(null);
  const { token, logout } = useAuth();
  const user = decodeJWT(token);

  const fetchRecipes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/recipes");
      const data = await res.json();
      setRecipes(data);
    } catch (error) {
      console.error("❌ ดึงข้อมูลไม่สำเร็จ:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchRecipes();
  }, [token]);

  const deleteRecipe = async (id) => {
    if (!window.confirm("คุณต้องการลบเมนูนี้หรือไม่?")) return;

    const res = await fetch(`http://localhost:5000/api/recipes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("✅ ลบสำเร็จ");
      fetchRecipes();
    } else {
      alert("❌ ลบไม่สำเร็จ");
    }
  };

  const updateRecipe = async () => {
    const updated = {
      ...editForm,
      ingredients: editForm.ingredients.split(",").map((i) => i.trim()),
    };

    const res = await fetch(`http://localhost:5000/api/recipes/${editForm._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      alert("✅ แก้ไขสำเร็จ");
      setEditForm(null);
      fetchRecipes();
    } else {
      alert("❌ แก้ไขไม่สำเร็จ");
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/api/recipes/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      return data.imageUrl;
    } catch (err) {
      console.error("❌ upload error:", err);
      return null;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setEditForm({ ...editForm, imageUrl });
    } else {
      alert("❌ อัปโหลดรูปไม่สำเร็จ");
    }
  };

  const filteredRecipes = recipes.filter((r) => {
    const keyword = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(keyword) ||
      r.ingredients.some((ing) => ing.toLowerCase().includes(keyword)) ||
      r.duration.toLowerCase().includes(keyword) ||
      r.difficulty.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">🍳 Wongnok Recipes</h1>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-gray-600">👤 สวัสดี, {user.username}</span>}
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            🚪 ออกจากระบบ
          </button>
        </div>
      </div>

      <AddRecipeForm onRecipeAdded={fetchRecipes} />

      <input
        type="text"
        placeholder="🔍 ค้นหาเมนู เช่น ต้ม, ผัด, แกง"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-6"
      />

      {filteredRecipes.length === 0 ? (
        <p className="text-center text-gray-500">ยังไม่มีสูตรอาหาร</p>
      ) : (
        filteredRecipes.map((r) => (
          <div key={r._id} className="bg-white p-4 rounded shadow mb-4">
            {r.imageUrl && (
              <img
                src={`http://localhost:5000/${r.imageUrl}`}
                alt={r.name}
                className="w-full h-64 object-cover rounded mb-2"
              />
            )}

            {editForm?._id === r._id ? (
              <>
                <input
                  className="w-full p-2 mb-2 border rounded"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
                <input
                  className="w-full p-2 mb-2 border rounded"
                  value={editForm.ingredients}
                  onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })}
                />
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={editForm.duration}
                  onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                >
                  <option>5 - 10 mins</option>
                  <option>10 - 30 mins</option>
                  <option>30 - 60 mins</option>
                  <option>มากกว่า 60 mins</option>
                </select>
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={editForm.difficulty}
                  onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                >
                  <option>ง่าย</option>
                  <option>ปานกลาง</option>
                  <option>ยาก</option>
                </select>

                {editForm.imageUrl && (
                  <img
                    src={`http://localhost:5000/${editForm.imageUrl}`}
                    alt="preview"
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full mb-2"
                />

                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  onClick={updateRecipe}
                >
                  💾 บันทึก
                </button>
                <button
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => setEditForm(null)}
                >
                  ❌ ยกเลิก
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">{r.name}</h2>
                <p className="text-sm text-gray-600">วัตถุดิบ: {r.ingredients.join(", ")}</p>
                <p className="text-sm">⏱️ ระยะเวลา: {r.duration}</p>
                <p className="text-sm">🎯 ความยาก: {r.difficulty}</p>
                <div className="mt-2 space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() =>
                      setEditForm({ ...r, ingredients: r.ingredients.join(", ") })
                    }
                  >
                    📝 แก้ไข
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => deleteRecipe(r._id)}
                  >
                    🗑️ ลบ
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
