import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import "./View.css"
import "../App.css"

const LandingView: React.FC = () => {
    const { setCurrentView } = useAppContext();

    return (
        <div className="landing-container">
            <div className="glass hero-card">
                <div className="hero-icon">
                    <span style={{ fontSize: "2.25rem", lineHeight: "2.5rem" }}>🍽️</span>
                </div>

                <h2 className="hero-title">
                    Don't know what to <span className="text-gradient">Eat?</span>
                </h2>

                <p className="hero-description">
                    Let our AI recommend the perfect meal based on how you're feeling today. No more decision fatigue when it comes to food choices.
                </p>

                <button
                    onClick={() => setCurrentView('mood')}
                    className="primary-button"
                >
                    <span>Get Started</span>
                    <ArrowRight />
                </button>
            </div>

            <div className="features-grid">
                <div className="glass feature-card">
                    <div className="feature-icon-container">
                        <span className="text-xl">🤖</span>
                    </div>
                    <h3 className="feature-title">AI-Powered</h3>
                    <p className="feature-description">Meal suggestions powered by OpenAI, using your mood, time,
                        location, and past choices.</p>
                </div>

                <div className="glass feature-card">
                    <div className="feature-icon-container">
                        <span className="text-xl">⚡</span>
                    </div>
                    <h3 className="feature-title">Instant Results</h3>
                    <p className="feature-description">	One click. Zero signup. Personalized results in seconds.</p>
                </div>

                <div className="glass feature-card">
                    <div className="feature-icon-container">
                        <span className="text-xl">🍜</span>
                    </div>
                    <h3 className="feature-title">Taste Memory</h3>
                    <p className="feature-description">The more you use it, the more it learns about you.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingView;
