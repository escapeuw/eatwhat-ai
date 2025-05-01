
import React from 'react';
import "./LandingView.css"

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p className="footer-text"
                    style={{ fontSize: "0.75rem" }}>
                    © 2025 EatWhat.ai — AI-powered meal recommendations
                </p>
            </div>
        </footer>
    );
};

export default Footer;