const RecipeCard = ({ recipe }) => {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <img
        src={recipe.image}
        alt={recipe.title}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x200?text=Фото+рецепту";
        }}
      />
      <div style={{ padding: "1rem" }}>
        <h3 style={{ marginBottom: "0.5rem" }}>{recipe.title}</h3>
        <p style={{ color: "#4f46e5", fontWeight: "600" }}>{recipe.calories} ккал</p>
        <details style={{ marginTop: "0.75rem" }}>
          <summary style={{ cursor: "pointer", color: "#4f46e5" }}>Показати рецепт</summary>
          <div style={{ marginTop: "0.75rem" }}>
            <strong>Інгредієнти:</strong>
            <ul style={{ paddingLeft: "1.25rem", marginTop: "0.25rem" }}>
              {recipe.ingredients?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p style={{ marginTop: "1rem" }}>
              <strong>Приготування:</strong> {recipe.instructions}
            </p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default RecipeCard;