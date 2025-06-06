// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/recipes')
      .then(res => setRecipes(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>🍳 Wongnok Recipes</h1>
      {recipes.map(recipe => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}

export default Home;
