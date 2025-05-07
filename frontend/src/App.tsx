import './App.css'
import { AppProvider, useAppContext } from './context/AppContext';
import { JSX, useEffect } from "react";
import MoodForm from "./components/MoodForm";
import Header from './components/Header';
import LandingView from './components/LandingView';
import ResultView from './components/ResultView';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';


import "./index.css"; // contains light/dark theme vars

function AppContent(): JSX.Element {
  const { currentView, setCurrentView, suggestionResponse, setUuid } = useAppContext();
  const isMobile = window.innerWidth < 600;

  // Set UUID
  useEffect(() => {
    const existingUser = localStorage.getItem("uuid");
    console.log("Loaded UUID from localStorage:", existingUser);

    if (existingUser && validateUuid(existingUser)) {
      console.log("Valid UUID, reusing.");
      setUuid(existingUser);
      setCurrentView("mood"); //skip landing view for second visit
    } else {
      const newUser = uuidv4();
      console.log("Invalid or no UUID, generating new:", newUser);
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
        {currentView === 'mood' && <MoodForm />}
        {currentView === 'result' && suggestionResponse && (
          <ResultView
            reason={suggestionResponse.reason}
            suggestions={suggestionResponse.suggestions} />
        )}
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
