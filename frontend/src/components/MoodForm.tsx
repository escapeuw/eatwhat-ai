import '/src/App.css'
import "./View.css";
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { toast } from "../hooks/use-toast";


type MoodFormProps = {
    uuid: string;
}

const MoodForm: React.FC<MoodFormProps> = (props) => {
    const { uuid } = props;
    const { mood, setMood } = useAppContext();

    const [moodTyping, setMoodTyping] = useState(false);
    const [locationTyping, setLocationTyping] = useState(false);
    const [location, setLocation] = useState<string>("");
    const [locationError, setLocationError] = useState(false);
    const [timeDescription, setTimeDescription] = useState("");
    const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

    const getTimeDescription = () => {
        const now = new Date();
        const hour = now.getHours();
        let timeOfDay = "other";
        if (hour >= 6 && hour < 10) timeOfDay = "breakfast";
        else if (hour >= 10 && hour < 12) timeOfDay = "brunch";
        else if (hour >= 12 && hour < 14) timeOfDay = "lunch";
        else if (hour >= 14 && hour < 17) timeOfDay = "latelunch";
        else if (hour >= 17 && hour < 21) timeOfDay = "dinner";
        else if (hour >= 21 && hour < 23) timeOfDay = "latedinner";
        else timeOfDay = "latenight";

        const day = now.toLocaleDateString("en-US", { weekday: "long" });
        return `${timeOfDay} on ${day}`;
    };
    // coordinates to readable location
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}&language=en`
            );
            const data = await response.json();
            const humanReadable = data.results[0]?.formatted;
            return humanReadable || `${lat},${lng}`;
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            return `${lat},${lng}`;
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const input = mood.trim();
        if (!input) {
            toast({
                title: "Tell us how you feel",
                description: "Please enter your current mood so we can find the perfect meal.",
                variant: "destructive",
            });
            return;
        }
        if (/[^ㄱ-ㅎ가-힣a-zA-Z\s]/.test(input)) {
            toast({
                title: "Invalid characters",
                description: "Only Korean and English letters are allowed.",
                variant: "destructive",
            });
            setMood("");
            return;
        }

        toast({
            title: "Perfect meal chosen!",
            description: `Based on your mood: "${mood}", we've selected a meal for you.`,
        });


        // In a real app, this would trigger an API call to get recommendation
        // For this demo, we just show the toast notification
    };

    // Collect location and time of user

    useEffect(() => {
        setTimeDescription(getTimeDescription());

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                const readableLocation = await reverseGeocode(latitude, longitude);
                setLocation(readableLocation);
            },
            (err) => {
                console.warn("Geolocation failed:", err.message);
                setLocationError(true);
            },
            { timeout: 10000 }
        );

    }, []);

    return (
        <div className="mood-container">
            <div className="glass mood-card">
                <div className="mood-icon">
                    <span style={{ fontSize: "2.25rem", lineHeight: "2.5rem" }}>🍽️</span>
                </div>

                <h2 className="mood-title">
                    What is your <span className="text-gradient">mood</span> today? 😋
                </h2>
                <div>{location}{timeDescription}{uuid}</div>

                <form onSubmit={handleSubmit} className="mood-form">
                    <div className="input-container">
                        <input
                            value={mood}
                            onChange={(e) => {
                                setMood(e.target.value);
                                setMoodTyping(e.target.value.length > 0);
                            }}
                            placeholder="I'm feeling..."
                            className="mood-input"
                            maxLength={30}
                            autoFocus
                        />
                        {moodTyping && (
                            <div className="typing-indicator">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        )}
                    </div>
                    {locationError && (
                        <div className="input-container">
                            <input
                                value={location}
                                onChange={(e) => {
                                    setLocation(e.target.value);
                                    setLocationTyping(e.target.value.length > 0);
                                }}
                                placeholder="My location is... (up to 30 letters)"
                                className="mood-input"
                                maxLength={30} />
                            {locationTyping && (
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            )}
                        </div>)}

                    <div className="button-container">
                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Find Meal
                        </button>
                    </div>

                    <p className="mood-hint">
                        Try: "energetic", "stressed and lazy", "celebratory", "melancholic"...
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