
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
    const { setCurrentView } = useAppContext();
    return (
        <div className="header">
            <div className="header-container">
                <div className="logo-container"
                    onClick={() => setCurrentView("landing")}>
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