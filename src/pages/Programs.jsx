import { useNavigate } from "react-router-dom";

const Programs = () => {
  const navigate = useNavigate();

  const programs = [
    {
      id: "keto",
      title: "Кето дієта",
      description: "Низьковуглеводна дієта з високим вмістом жирів для швидкого схуднення",
      duration: "14-денний план",
      icon: "🥑",
    },
    {
      id: "intermittent",
      title: "16:8 Інтервальне голодування",
      description: "Їжа в 8-годинному вікні, голодування 16 годин",
      duration: "21-денний план",
      icon: "⏰",
    },
    {
      id: "pescetarian",
      title: "Пескетаріанство",
      description: "Рослинна їжа + риба та морепродукти",
      duration: "21-денний план",
      icon: "🐟",
    },
    {
      id: "vegan",
      title: "Веган меню",
      description: "Повністю рослинна дієта без продуктів тваринного походження",
      duration: "7-денний план",
      icon: "🥦",
    },
    {
      id: "highprotein",
      title: "Високобілкове схуднення",
      description: "Збільшений білок для збереження м'язів при схудненні",
      duration: "Запис у формі",
      icon: "💪",
    },
    {
      id: "vegetarian",
      title: "Вегетаріанство",
      description: "Без м'яса, але з молочними продуктами та яйцями",
      duration: "21-денний план",
      icon: "🥚",
    },
  ];

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", color: "#5B7133", fontSize: "2.5rem", margin: "2rem 0" }}>
        Програми харчування
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "2rem",
        }}
      >
        {programs.map((program) => (
          <div
            key={program.id}
            className="card"
            style={{ cursor: "pointer", background: "#C8D094" }}
            onClick={() => navigate(`/programs/${program.id}`)}
          >
            <div style={{ textAlign: "center", fontSize: "4rem", marginBottom: "1rem" }}>
              {program.icon}
            </div>
            <h3 style={{ textAlign: "center", color: "#5B7133", marginBottom: "1rem" }}>
              {program.title}
            </h3>
            <p style={{ textAlign: "center", color: "#5B7133", marginBottom: "1rem" }}>
              {program.description}
            </p>
            <p style={{ textAlign: "center", fontWeight: "bold", color: "#5B7133" }}>
              {program.duration}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programs;