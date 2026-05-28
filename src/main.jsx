import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function App() {
  const items = [
    "早餐完成",
    "乳清",
    "午饭",
    "鸡胸肉",
    "喝水 ≥ 2.5L",
    "椭圆机",
    "力量训练"
  ];

  const today = new Date().toISOString().slice(0, 10);

  const [shift, setShift] = useState("白班");
  const [checks, setChecks] = useState({});
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [sleep, setSleep] = useState("");
  const [bp, setBp] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [snack, setSnack] = useState("不加餐");
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("health-checkin-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "health-checkin-history",
      JSON.stringify(history)
    );
  }, [history]);

  const saveToday = () => {
    const entry = {
      date: today,
      shift,
      checks,
      weight,
      steps,
      sleep,
      bp,
      heartRate,
      snack,
      note
    };

    const filtered = history.filter(
      (h) => h.date !== today
    );

    setHistory(
      [...filtered, entry].sort((a, b) =>
        a.date.localeCompare(b.date)
      )
    );
  };

  const chartData = useMemo(
    () =>
      history
        .filter((h) => h.weight)
        .map((h) => ({
          date: h.date.slice(5),
          体重: Number(h.weight)
        })),
    [history]
  );

  const completionRate = useMemo(() => {
    const done =
      Object.values(checks).filter(Boolean).length;

    return Math.round(
      (done / items.length) * 100
    ) || 0;
  }, [checks]);

  const snackReminder =
    history.length % 4 === 3;

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 20,
        fontFamily: "sans-serif"
      }}
    >
      <h1>健康打卡</h1>

      <p>今日完成率：{completionRate}%</p>

      {snackReminder && (
        <div
          style={{
            background: "#fff3cd",
            padding: 10,
            borderRadius: 8
          }}
        >
          明天可安排一次加餐 🥭
        </div>
      )}

      <h3>班次</h3>

      <select
        value={shift}
        onChange={(e) =>
          setShift(e.target.value)
        }
      >
        <option>白班</option>
        <option>夜班</option>
        <option>休息</option>
      </select>

      <h3>打卡</h3>

      {items.map((item) => (
        <div key={item}>
          <label>
            <input
              type="checkbox"
              checked={!!checks[item]}
              onChange={() =>
                setChecks({
                  ...checks,
                  [item]: !checks[item]
                })
              }
            />
            {item}
          </label>
        </div>
      ))}

      <h3>今日数据</h3>

      <input
        placeholder="体重"
        value={weight}
        onChange={(e) =>
          setWeight(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="步数"
        value={steps}
        onChange={(e) =>
          setSteps(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="睡眠"
        value={sleep}
        onChange={(e) =>
          setSleep(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="血压"
        value={bp}
        onChange={(e) =>
          setBp(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="心率"
        value={heartRate}
        onChange={(e) =>
          setHeartRate(e.target.value)
        }
      />

      <h3>加餐</h3>

      <select
        value={snack}
        onChange={(e) =>
          setSnack(e.target.value)
        }
      >
        <option>不加餐</option>
        <option>芒果</option>
        <option>荔枝</option>
        <option>酸奶+芒果</option>
      </select>

      <h3>体重趋势</h3>

      <div
        style={{
          width: "100%",
          height: 250
        }}
      >
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              dataKey="体重"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <textarea
        placeholder="备注"
        value={note}
        onChange={(e) =>
          setNote(e.target.value)
        }
        rows={4}
        style={{
          width: "100%"
        }}
      />

      <br />
      <br />

      <button
        onClick={saveToday}
        style={{
          width: "100%",
          padding: 12
        }}
      >
        保存今天
      </button>
    </div>
  );
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(<App />);
