"use client";

import { useState } from "react";

export default function ContactForm() {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [message, setMessage] = useState();

    const functiion onSubmitHandler = {

    }

    return (
        <form onSubmit={onSubmitHandler}>
            <input 
                type="text" 
                placeholder="Enter name."
                value={name}
                onChange={(e) => {setName(e.target.value)}}
            />

            <input 
                type="email" 
                placeholder="Enter Email."
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
            />

            <input 
                type="text" 
                placeholder="Enter Message."
                value={message}
                onChange={(e) => {setMessage(e.target.value)}}
            />

            <button type="submit">Submit</button>
        </form>
    )
}