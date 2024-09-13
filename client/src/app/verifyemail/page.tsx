"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

import React from "react";

export default function VerifyEmail() {
    const [token, setToken] = useState("");
    const [verified, setverify] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken);
    }, []);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.post("/api/user/verifyemail", { token });
                setverify(true);
            } catch (error) {
                setError(true);
            }
        };
        if (token.length > 0) {
            verifyEmail();
        }
    }, [token]);

    return (
        <div>
            <h1>verify Email</h1>
            <br />
            {token} <br />
            {verified ? (
                <div>
                    <p>Email verified</p>
                    <p>
                        Click here to <Link href="/login">login</Link>
                    </p>
                </div>
            ) : (
                <p>Email not verified</p>
            )}
        </div>
    );
}
