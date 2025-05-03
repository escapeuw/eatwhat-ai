import '/src/App.css'
import "./View.css";
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { toast } from "../hooks/use-toast";


const MoodForm: React.FC = () => {
    const { mood, setMood } = useAppContext();
    const [isTyping, setIsTyping] = useState(false);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mood.trim()) {
            toast({
                title: "Tell us how you feel",
                description: "Please enter your current mood so we can find the perfect meal.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Perfect meal chosen!",
            description: `Based on your mood: "${mood}", we've selected a meal for you.`,
        });


        // In a real app, this would trigger an API call to get recommendation
        // For this demo, we just show the toast notification
    };

    return (
        <div className="mood-container">
            <div className="glass mood-card">
                <div className="mood-icon">
                    <span style={{ fontSize: "2.25rem", lineHeight: "2.5rem" }}>😋</span>
                </div>

                <h2 className="mood-title">
                    What is your <span className="text-gradient">mood</span> today?
                </h2>

                <form onSubmit={handleSubmit} className="mood-form">
                    <div className="input-container">
                        <input
                            value={mood}
                            onChange={(e) => {
                                setMood(e.target.value);
                                setIsTyping(e.target.value.length > 0);
                            }}
                            placeholder="I'm feeling..."
                            className="mood-input"
                            autoFocus
                        />
                        {isTyping && (
                            <div className="typing-indicator">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        )}
                    </div>

                    <div className="button-container">
                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Find My Perfect Meal
                        </button>
                    </div>

                    <p className="mood-hint">
                        Try: "energetic", "stressed", "celebratory", "melancholic"...
                    </p>
                </form>
            </div>

            <div className="glass info-card">
                <h3 className="info-title">How it works</h3>
                <p className="info-text">
                    Our AI analyzes your mood, time, and location to recommend the perfect meal for
                    your situation. It learns from your past feedback to deliver increasingly personalized
                    suggestions.
                </p>
            </div>
        </div>
    );
};

export default MoodForm;