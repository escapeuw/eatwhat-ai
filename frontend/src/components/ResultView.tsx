import React from 'react';
import { useAppContext } from '../context/AppContext';
import "./View.css"
import "../App.css"

type Suggestion = {
    name: string;
    description: string;
};
type ResultViewProps = {
    reason: string;
    suggestions: Suggestion[];
};


const ResultView: React.FC<ResultViewProps> = ({ reason, suggestions }) => {
    const { setCurrentView } = useAppContext();

    return (
        <div className="result-container">
            <div>
                {reason}
                <h2>Top 3 Meal Suggestions 🍽️ • Select the best one</h2>
                <div className="suggestion-container">
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
        </div>
    );
};

export default ResultView