// src/pages/AddRecipe.jsx
import { useState } from 'react';
import axios from 'axios';

function AddRecipe() {
  const [form, setForm] = useState({
    name: '',
    image: '',
    ingredients: '',
    steps: '',
    duration: '',
    difficulty: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newRecipe = {
      ...form,
      ingredients: form.ingredients.split(','),
      steps: form.steps.split(',')
    };
    await axios.post('http://localhost:5000/api/recipes', newRecipe);
    alert('เพิ่มสูตรสำเร็จ!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>เพิ่มสูตรอาหาร</h2>
      <input name="name" placeholder="ชื่อเมนู" onChange={handleChange} required /><br />
      <input name="image" placeholder="URL รูปอาหาร" onChange={handleChange} /><br />
      <input name="ingredients" placeholder="วัตถุดิบ (คั่นด้วย ,)" onChange={handleChange} required /><br />
      <input name="steps" placeholder="ขั้นตอน (คั่นด้วย ,)" onChange={handleChange} required /><br />
      <select name="duration" onChange={handleChange} required>
        <option value="">-- เลือกเวลาทำ --</option>
        <option>5 - 10 mins</option>
        <option>1 - 30 mins</option>
        <option>31 - 60 mins</option>
        <option>60+ mins</option>
      </select><br />
      <select name="difficulty" onChange={handleChange} required>
        <option value="">-- เลือกระดับความยาก --</option>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
        <option>Extreme hard</option>
      </select><br />
      <button type="submit">บันทึก</button>
    </form>
  );
}

export default AddRecipe;
