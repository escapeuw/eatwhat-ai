import { ChangeEvent, JSX, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import "./ThemeToggle.css";

function ThemeToggle(): JSX.Element {
    const [isEnabled, setIsEnabled] = useState<boolean>(false);

    const toggleState = (event: ChangeEvent<HTMLInputElement>): void => {
        setIsEnabled(event.target.checked); // == prevState) => !prevState
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
                {/* Sun icon on the left */}
                <Sun size="1.15rem" className={`icon sun ${isEnabled ? "show" : "hide"}`} />

                {/* Moon icon on the right */}
                <Moon size="1.15rem" className={`icon moon ${isEnabled ? "hide" : "show"}`} />

            </div>
        </label>
    );
}

export default ThemeToggle;
