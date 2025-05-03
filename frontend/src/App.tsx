import './App.css'
import { AppProvider, useAppContext } from './context/AppContext';
import { JSX } from "react";
import MoodForm from "./components/MoodForm";
import Header from './components/Header';
import LandingView from './components/LandingView';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

import "./index.css"; // contains light/dark theme vars

function AppContent(): JSX.Element {
  const { currentView } = useAppContext();
  const isMobile = window.innerWidth < 600;

  return (
    <div className="app-container">
      <Toaster position={isMobile ? 'top-center' : 'bottom-right'} />
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
