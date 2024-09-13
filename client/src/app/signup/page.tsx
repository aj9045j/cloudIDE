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

export default function SignupPage() {
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#ffffff");

    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        username: "",
        password: "",
    });

    const signup = async () => {
        try {
            setLoading(true);
            if (user.email.length < 2) {
                toast.error("Please enter a valid email address");
            } else if (user.username.length < 3) {
                toast.error("Username must be at least 3 characters long");
            } else if (user.password.length < 8) {
                toast.error("Password must be at least 8 characters long");
            } else {
                const response = await axios.post("/api/user/signup", user);
                toast.success("Signup successfull");
                router.push("/login");
            }
        } catch (error) {
            toast.error("error while signup");
            console.log("Failed to signup");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="background-radial-gradient">
            <div className="container">
                <div className="left-section">
                    <h2>Welcome to Our Platform</h2>
                    <p>
                        Join us to experience the best services and features tailored for
                        your needs. Sign up now and be part of our community!
                    </p>
                </div>
                <div className="right-section">
                    <h1>Sign Up</h1>

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="Email"
                        required
                        className="input-field"
                    />

                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        placeholder="Username"
                        required
                        className="input-field"
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder="Password"
                        required
                        className="input-field"
                    />

                    <button onClick={signup} className="signup-button">
                        Sign Up
                    </button>
                    <div className="login-link">
                        <p>
                            Already have an account? <Link href="/login">Login</Link>
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
