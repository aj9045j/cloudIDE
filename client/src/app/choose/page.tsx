"use client";
import React from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Choose() {
    const router = useRouter();

    const handlesubmit = async () => {

        const response = await axios.get('http://localhost:9000/api/react-container');
        const containerId = response.data.containerId;
        console.log(response);
        router.push(`/${containerId}`);
    }

    return (
        <div>
            <button onClick={handlesubmit}>React</button>
            <button>CPP</button>
            <button>Python</button>
        </div>
    )
}
