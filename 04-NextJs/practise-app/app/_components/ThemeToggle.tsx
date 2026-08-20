"use client";

import { useEffect, useState } from "react";

export default function ThemeToggleButton() {

    const [theme, setTheme] = useState<string | null>(null);

    useEffect(() => {
        setTheme(localStorage.getItem("theme") ?? "light");
    }, []);

    if (theme == null) {
        return <button disabled>...</button>
    }

    return (
        <div>
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme}</button>
        </div>
    )
}