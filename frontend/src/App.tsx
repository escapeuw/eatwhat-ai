import './App.css'
import { AppProvider, useAppContext } from './context/AppContext';
import { JSX } from "react";
import MoodForm from "./components/MoodForm";
import Header from './components/Header';
import LandingView from './components/LandingView';
import Footer from './components/Footer';

import "./index.css"; // contains light/dark theme vars

function AppContent(): JSX.Element {
  const { currentView } = useAppContext();

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        {currentView === 'landing' && <LandingView />}
        {currentView === 'mood' && <MoodForm />}
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
