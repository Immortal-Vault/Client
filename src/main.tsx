import { useState } from "react";

export default function Main() {
    const [state, setState] = useState('OFF');

    setInterval(async () => {
        try {
            const response = await fetch('http://localhost:3001/ping', {
                method: 'GET'
            })

            setState(response.statusText);
        } catch {
            setState('OFF')
        }
    }, 50);

    return (
        <>
            <h2>Server response is: {state}</h2>
        </>
    )
}
