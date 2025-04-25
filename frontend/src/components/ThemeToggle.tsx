import { useEffect, useState } from "react";
import "./ThemeToggle.css";

function ThemeToggle() {
    const [isEnabled, setIsEnabled] = useState(false);

    const toggleState = () => {
        setIsEnabled((prevState) => !prevState);
    };

    useEffect(() => {
        document.body.classList.toggle("dark", isEnabled);
    }, [isEnabled]);

    return (
        <label className="toggle-wrapper" htmlFor="toggle">
            <div className={`toggle ${isEnabled ? "enabled" : "disabled"}`}>
                <span className="hidden">
                    {isEnabled ? "Enable Light Mode" : "Enable Dark Mode"}
                </span>
                <input
                    id="toggle"
                    name="toggle"
                    type="checkbox"
                    checked={isEnabled}
                    onChange={toggleState}
                />
            </div>
        </label>
    );
}

export default ThemeToggle;
