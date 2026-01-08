import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const CircularProgress = ({ consumed = 0, target = 2000 }) => {
  const remaining = Math.max(target - consumed, 0);

  const data = {
    datasets: [
      {
        data: [consumed, remaining],
        backgroundColor: ["#4f46e5", "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "75%",
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  return (
    <div className="circular-progress-container">
      <Doughnut data={data} options={options} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2.25rem", fontWeight: "bold" }}>{consumed}</div>
        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>з {target} ккал</div>
      </div>
    </div>
  );
};

export default CircularProgress;