import { useState } from "react";
import "./App.css";
import Beaker from "./components/beaker";

function App() {
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);

  const handleSimulate = () => {
    setLoading(true);
    setRunning(true);

    // Simulation duration (fixed 5 sec)
    setTimeout(() => {
      setRunning(false);
      setLoading(false);
    }, 5000);
  };

  return (
    <div className="app dark-theme">
      <div className="split-container">
        {/* LEFT PANEL - THEORY */}
        <section className="text-panel">
          <h1 className="main-heading">⚡ Electric Plating </h1>
          <h2>About the Experiment</h2>
          <p>
            Electroplating is a technique of depositing a thin film of another metal on the surface of a metal.
          </p>
          <p>
            (-) Cathode: The electrode is connected to the object to be plated. <br />
            (+) Anode: The electrode is connected to plating material such as gold, silver, nickel. <br />
            Two metals are soaked in an ion solution that has the same metal to be plated.
          </p>
          <div className="reaction-box font-bold">
            <b>(+)</b> Ag(s) → Ag⁺(aq) + e⁻ <br />
            <b>(-)</b> Ag⁺(aq) + e⁻ → Ag(s)
          </div>
        </section>

        {/* RIGHT PANEL - SIMULATOR */}
        <section className="sim-panel">
          <Beaker running={running} />
          <button onClick={handleSimulate} disabled={loading}>
            {loading ? "Simulating..." : "Start Simulation"}
          </button>
        </section>
      </div>
    </div>
  );
}

export default App;
