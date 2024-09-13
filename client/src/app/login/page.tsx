"use client";

import React, { useState, CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function LoginPage() {
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#ffffff");

    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const login = async () => {
        try {
            setLoading(true);
            if (user.email.length < 2) {
                toast.error("Email must be at least 2 characters long");
            } else if (user.password.length < 2) {
                toast.error("Password must be at least 8 characters long");
            } else {
                const response = await axios.post("/api/user/login", user);
                toast.success("Login successful");

                router.push("/choose");
            }
        } catch (error) {
            toast.error("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="background-radial-gradient">
            <div className="container">
                <div className="left-section">
                    <h2>Welcome Back!</h2>
                    <p>
                        We&apos;re excited to have you back. Please enter your credentials
                        to access your account. If you don&apos;t have an account, you can
                        sign up for one.
                    </p>
                </div>
                <div className="right-section">
                    <h1>Login</h1>

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="email"
                        required
                        className="input-field"
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder="password"
                        required
                        className="input-field"
                    />

                    <button onClick={login} className="signup-button">
                        Log In
                    </button>
                    <div className="login-link">
                        <p>
                            Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
                        </p>
                    </div>

                    <HashLoader
                        color={color}
                        loading={loading}
                        cssOverride={override}
                        size={100}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            </div>
            <Toaster />
        </div>
    );
}
