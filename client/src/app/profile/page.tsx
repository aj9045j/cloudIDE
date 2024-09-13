"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Profile() {
    const [user, setUser] = useState('');

    
    useEffect(() => {
        const getData = async () => {
            try {
                console.log("hry");
                const response = await axios.get('/api/user/userInfo');
                setUser(response.data.data.username);
                // console.log(response.data);
            } catch (error) {
                console.log("herrr");
                console.error("Error fetching user data:", error);
            }
        };

        getData();
    }, []);

    return (
        <div>
            Profile
            <h1>
                {user === '' ? "No user" : <Link href={`/profile/${user}`}>{user}</Link>}
            </h1>
        </div>
    );
}
