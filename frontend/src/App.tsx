import './App.css'
import { AppProvider, useAppContext } from './context/AppContext';
import { JSX, useState, useEffect } from "react";
import MoodForm from "./components/MoodForm";
import Header from './components/Header';
import LandingView from './components/LandingView';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import "./index.css"; // contains light/dark theme vars

function AppContent(): JSX.Element {
  const { currentView, setCurrentView } = useAppContext();
  const isMobile = window.innerWidth < 600;
  const [uuid, setUuid] = useState("");

  // Set UUID
  useEffect(() => {
    const existingUser = localStorage.getItem("uuid");
    if (existingUser) {
      setUuid(existingUser);
      setCurrentView("mood"); //skip landing view for second visit
    } else {
      const newUser = uuidv4();
      localStorage.setItem("uuid", newUser);
      setUuid(newUser);
      setCurrentView("landing");
    }
  }, []);

  return (
    <div className="app-container">
      <Toaster position={isMobile ? 'top-center' : 'bottom-right'} />
      <Header />

      <main className="main-content">
        {currentView === 'landing' && <LandingView />}
        {currentView === 'mood' && <MoodForm uuid={uuid} />}
      </main>
      <Footer />
    </div>

  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
