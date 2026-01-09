import { useNavigate } from "react-router-dom";

const Programs = () => {
  const navigate = useNavigate();

  const programs = [
    {
      id: "keto",
      icon: "🥑",
      title: "Кето дієта",
      description: "Низьковуглеводна дієта з високим вмістом жирів для швидкого схуднення.",
      duration: "30 днів",
    },
    {
      id: "intermittent",
      icon: "⏰",
      title: "16:8 Інтервальне голодування",
      description: " Їжа в 8-годинному вікні, голодування 16 годин.",
      duration: "30 днів",
    },
    {
      id: "pescetarian",
      icon: "🐟",
      title: "Пескетаріанство",
      description: "Рослинна дієта з рибою та морепродуктами.",
      duration: "30 днів",
    },
    {
      id: "vegan",
      icon: "🥦",
      title: "Веган меню",
      description: "Повністю рослинна дієта без продуктів тваринного походження.",
      duration: "30 днів",
    },
    {
      id: "highprotein",
      icon: "💪",
      title: "Високобілкове схуднення",
      description: "Збільшений білок для збереження м'язів при схудненні.",
      duration: "30 днів",
    },
    {
      id: "vegetarian",
      icon: "🥗",
      title: "Вегетаріанство",
      description: "Без м'яса, але з молочними продуктами та яйцями.",
      duration: "30 днів",
    },
  ];

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", color: "#5B7133", fontSize: "2.5rem", margin: "2rem 0" }}>
        Програми харчування
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        {programs.map((program) => (
          <div
            key={program.id}
            className="card"
            style={{ cursor: "pointer", transition: "transform 0.3s" }}
            onClick={() => navigate(`/programs/${program.id}`)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div style={{ fontSize: "3rem", textAlign: "center", marginBottom: "1rem" }}>
              {program.icon}
            </div>
            <h3 style={{ color: "#5B7133", textAlign: "center", marginBottom: "0.5rem" }}>
              {program.title}
            </h3>
            <p style={{ color: "#666", textAlign: "center", marginBottom: "1rem" }}>
              {program.description}
            </p>
            <p style={{ textAlign: "center", color: "#5B7133", fontWeight: "600" }}>
              Тривалість: {program.duration}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programs;