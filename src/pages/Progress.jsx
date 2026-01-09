import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Progress = () => {
  const [weightHistory, setWeightHistory] = useState([]);
  const [currentWeight, setCurrentWeight] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;

      setLoading(true);

      try {
        // Завантажуємо історію ваги з підколекції weights
        const weightsRef = collection(db, "users", auth.currentUser.uid, "weights");
        const q = query(weightsRef, orderBy("date", "asc"));
        const querySnapshot = await getDocs(q);

        const history = [];
        querySnapshot.forEach((doc) => {
          history.push(doc.data());
        });
        setWeightHistory(history);

        // Завантажуємо профіль (для поточної ваги та цілі)
        const profileRef = doc(db, "users", auth.currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }
      } catch (err) {
        console.error("Помилка завантаження прогресу:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddWeight = async (e) => {
    e.preventDefault();
    if (!currentWeight || !auth.currentUser) return;

    try {
      const weightRef = collection(db, "users", auth.currentUser.uid, "weights");
      const weightData = {
        weight: parseFloat(currentWeight),
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date(),
      };

      await addDoc(weightRef, weightData);
      alert("Вагу додано!");

      // Оновлюємо локально без перезавантаження
      setWeightHistory((prev) => [...prev, weightData].sort((a, b) => a.date.localeCompare(b.date)));
      setCurrentWeight("");
    } catch (err) {
      alert("Помилка додавання ваги");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.5rem" }}>Завантаження прогресу...</div>;
  }

  const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
  const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : latestWeight;
  const lostWeight = initialWeight - latestWeight;

  const chartData = {
    labels: weightHistory.map((w) => w.date),
    datasets: [
      {
        label: "Вага (кг)",
        data: weightHistory.map((w) => w.weight),
        borderColor: "#5B7133",
        backgroundColor: "rgba(91, 113, 51, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "#5B7133",
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "#e8f0e0" },
        ticks: { color: "#5B7133" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#5B7133" },
      },
    },
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", color: "#5B7133", fontSize: "2.5rem", margin: "2rem 0" }}>
        Прогрес
      </h1>

      {/* Поточна вага та втрата */}
      <div className="card" style={{ textAlign: "center", background: "#C8D094" }}>
        <h2 style={{ color: "#5B7133", fontSize: "2rem", marginBottom: "0.5rem" }}>
          Поточна вага: {latestWeight.toFixed(1)} кг
        </h2>
        {lostWeight > 0 && (
          <p style={{ fontSize: "1.5rem", color: "#5B7133", fontWeight: "bold" }}>
            Ви скинули {lostWeight.toFixed(1)} кг!
          </p>
        )}
        {lostWeight < 0 && (
          <p style={{ fontSize: "1.5rem", color: "#d32f2f", fontWeight: "bold" }}>
            Ви набрали {Math.abs(lostWeight).toFixed(1)} кг
          </p>
        )}
        <p style={{ fontSize: "1.3rem", color: "#5B7133", marginTop: "1rem" }}>
          Ви наближаєтесь до своєї цілі!
        </p>
      </div>

      {/* Графік ваги */}
      <div className="card">
        <h3 style={{ textAlign: "center", color: "#5B7133", marginBottom: "1rem" }}>
          Зміна ваги
        </h3>
        {weightHistory.length > 1 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
            Додайте більше даних про вагу, щоб побачити графік
          </p>
        )}
      </div>

      {/* Додавання ваги сьогодні */}
      <div className="card">
        <h3 style={{ textAlign: "center", color: "#5B7133", marginBottom: "1rem" }}>
          Додати вагу сьогодні
        </h3>
        <form onSubmit={handleAddWeight} style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <input
            type="number"
            step="0.1"
            placeholder="Вага (кг)"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            required
            style={{ width: "200px", padding: "0.75rem", borderRadius: "12px", border: "1px solid #C8D094" }}
          />
          <button type="submit" className="btn btn-primary">
            Додати
          </button>
        </form>
      </div>

      {/* Серія днів */}
      <div className="card" style={{ textAlign: "center", background: "#C8D094" }}>
        <p style={{ fontSize: "1.3rem", color: "#5B7133" }}>
          Поточна серія: 0 днів
        </p>
        <p style={{ fontSize: "1.3rem", color: "#5B7133", fontWeight: "bold" }}>
          Найкраща серія: 32 дні
        </p>
      </div>
    </div>
  );
};

export default Progress;