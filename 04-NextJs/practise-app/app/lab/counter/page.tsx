"use client"

import { useState } from "react";

export default function CounterPage(){

    const [count, setCount] = useState(0);

    return (
        <main>
            <p>Count : {count}</p>
            <button onClick={() => setCount(count + 1)}>Click Here</button>
        </main>
    );
}