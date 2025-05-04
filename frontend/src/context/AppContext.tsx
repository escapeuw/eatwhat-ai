import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppState = 'landing' | 'mood' | 'result';
type Suggestion = {
    name: string;
    description: string;
}
interface AppContextProps {
    currentView: AppState;
    setCurrentView: (view: AppState) => void;
    mood: string;
    setMood: (mood: string) => void;
    suggestions: Suggestion[] | null;
    setSuggestions: (s: Suggestion[] | null) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Check if user prefers dark mode by default

    const [currentView, setCurrentView] = useState<AppState>('landing');
    const [mood, setMood] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);


    return (
        <AppContext.Provider
            value={{
                currentView,
                setCurrentView,
                mood,
                setMood,
                suggestions,
                setSuggestions,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
