import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import BASE_URL from "../config";

const socket = io(BASE_URL); // backend URL

export default function UserView() {
  const [name, setName] = useState("");
  const [token, setToken] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [patients, setPatients] = useState([]);
  const avgTime = 10; // minutes

  const fetchStatus = async () => {
    const res = await axios.get(`${BASE_URL}/api/status`);
    setCurrentNumber(res.data.currentNumber);
    setPatients(res.data.patients);
  };

  useEffect(() => {
    fetchStatus();
    socket.on("queueUpdate", fetchStatus);
    return () => socket.off("queueUpdate");
  }, []);

  const handleRegister = async () => {
    if (!name) return alert("Enter your name");
    const res = await axios.post(`${BASE_URL}/api/register`, { name });
    setToken(res.data.tokenNumber);
    setName("");
  };

  return (
    <div className="bg-gray-50 flex flex-col items-center px-4">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🏥 Clinic Queue System
      </h2>

      {/* Current Status Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 mb-6 text-center">
        <p className="text-lg text-gray-600">Current Number</p>
        <p className="text-5xl font-extrabold text-blue-600 mt-2">
          {currentNumber}
        </p>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Register for Appointment
        </h3>
        <div className="flex">
          <input
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white px-5 py-2 rounded-r-lg hover:bg-blue-700 transition"
          >
            Get Token
          </button>
        </div>

        {token && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-lg text-gray-700">
              Your Token Number:{" "}
              <span className="font-bold text-green-700">{token}</span>
            </p>
            <p className="text-gray-600 mt-2">
              Approx Wait Time:{" "}
              <span className="font-medium">
                {(token - currentNumber) * avgTime} mins
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
