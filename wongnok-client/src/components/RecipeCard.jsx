// src/components/RecipeCard.jsx
function RecipeCard({ recipe }) {
  return (
    <div style={{ border: '1px solid gray', marginBottom: '1rem', padding: '1rem' }}>
      <h2>{recipe.name}</h2>
      <img src={recipe.image} alt={recipe.name} width="200" />
      <p><b>เวลาทำ:</b> {recipe.duration}</p>
      <p><b>ความยาก:</b> {recipe.difficulty}</p>
    </div>
  );
}

export default RecipeCard;
