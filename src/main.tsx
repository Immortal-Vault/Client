import { useState } from "react";
import {Title} from "@mantine/core";

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
            <Title order={1}>Server response is: {state}</Title>
        </>
    )
}
