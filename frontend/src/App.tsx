import './App.css'
import { JSX, useEffect, useState } from "react";
import SuggestForm from "./components/SuggestForm";
import ThemeToggle from "./components/ThemeToggle";

import "./index.css"; // contains light/dark theme vars

function App(): JSX.Element {
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="logo">
          <span style={{ fontWeight: "bolder" }}>eatWhat</span>.ai</div>
        <ThemeToggle />
      </header>

      {/* Centered Input Area */}
      <main className="main-content">
        <SuggestForm />
      </main>
    </div>
  );
}

export default App;
