import React from 'react';
import { useAppContext } from '../context/AppContext';
import "./View.css"
import "../App.css"

type Suggestion = {
    name: string;
    description: string;
};
type ResultViewProps = {
    suggestions: Suggestion[];
};


const ResultView: React.FC<ResultViewProps> = ({ suggestions }) => {
    const { setCurrentView } = useAppContext();

    return (
        <div>
            <h2>Your Top 3 Meal Suggestions 🍽️</h2>
            <div>
                {suggestions.map((item, idx) => (
                    <div key={idx} className="glass suggestion-card">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
            <button
                className="primary-button"
                onClick={() => setCurrentView('mood')}>
                Try Again
            </button>
        </div>
    )
}
export default ResultView