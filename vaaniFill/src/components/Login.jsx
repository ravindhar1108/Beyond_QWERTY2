import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { startRecording, stopRecording } from "../utils/speechToText";
import { FaMicrophone, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ setStatus }) => {
    const [user, setUser] = useState({ email: "", password: "" });
    const [listening, setListening] = useState({ email: false, password: false });
    const [recorders, setRecorders] = useState({ email: null, password: null });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (fieldName, value) => {
        setUser((prev) => ({ ...prev, [fieldName]: value }));
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard");
        }
    }, []);

    const handleVoiceInput = async (fieldName) => {
        if (!listening[fieldName]) {
            const recorder = await startRecording((text) => {
                setUser((prev) => ({ ...prev, [fieldName]: text }));
            }, (isListening) => {
                setListening((prev) => ({ ...prev, [fieldName]: isListening }));
            },fieldName);

            setRecorders(recorder);
        } else {
            stopRecording(recorders);
            setListening((prev) => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/login`, user);
            localStorage.setItem("token", response.data.token);
            setStatus(true);
            alert("Login successful");
            navigate("/dashboard");
        } catch (error) {
            alert(error.response.data.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[90vh] bg-gray-100">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded shadow-lg">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input with Voice */}
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="relative flex items-center">
                        <input
                            type="email"
                            value={user.email}
                            name="email"
                            id="email"
                            placeholder="Email"
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => handleVoiceInput("email")}
                            className="ml-2 text-gray-600"
                        >
                            {listening.email ? <FaMicrophone className="text-red-500" /> : <FaMicrophone />}
                        </button>
                    </div>

                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative flex items-center">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={user.password}
                            name="password"
                            id="password"
                            placeholder="Password"
                            onChange={(e) => handleChange("password", e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => handleVoiceInput("password")}
                            className="ml-2 text-gray-600"
                        >
                            {listening.password ? <FaMicrophone className="text-red-500" /> : <FaMicrophone />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="ml-2 absolute ml-99 text-gray-600"
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
