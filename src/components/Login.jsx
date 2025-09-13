import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../config";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/admin/login`, { email, password });
      onLogin(email, password);
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="border px-3 py-1 mb-2 block"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="border px-3 py-1 mb-2 block"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded">Login</button>
      </form>
    </div>
  );
}
