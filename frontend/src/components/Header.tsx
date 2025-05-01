
import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
    return (
        <div className="header">
            <div className="header-container">
                <div className="logo-container">
                    <div className="logo"></div>
                    <h1 className="site-title">
                        EatWhat<span className="text-gradient">.ai</span>
                    </h1>
                </div>
                <ThemeToggle />
            </div>
        </div>
    );
};

export default Header;