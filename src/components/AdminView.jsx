import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import BASE_URL from "../config"; // ✅ use your Render backend URL

const socket = io(BASE_URL); // use BASE_URL instead of localhost

export default function AdminView() {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [patients, setPatients] = useState([]);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/status`); // ✅ use BASE_URL
      setCurrentNumber(res.data.currentNumber);
      setPatients(res.data.patients);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
    socket.on("queueUpdate", fetchStatus);
    return () => socket.off("queueUpdate");
  }, []);

  const handleDone = async () => {
    if (patients.length === 0) {
      alert("⚠️ Waiting list is empty. No patient to mark as done.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/api/admin/done`);
    } catch (error) {
      console.error("Error marking done:", error);
    }
  };

  const handleReset = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the queue? This will delete all patients and start fresh."
    );
    if (confirmReset) {
      try {
        await axios.post(`${BASE_URL}/api/admin/reset`);
      } catch (error) {
        console.error("Error resetting queue:", error);
      }
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🛠 Admin Dashboard
      </h2>

      {/* Current Patient Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 mb-6 text-center">
        <p className="text-lg text-gray-600">Now Serving</p>
        <p className="text-5xl font-extrabold text-green-600 mt-2">
          {currentNumber === 0 ? "Waiting for patients" : currentNumber}
        </p>
        <button
          onClick={handleDone}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          ✅ Mark Done
        </button>
        <button
          onClick={handleReset}
          className="mt-4 w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          ♻️ Reset Queue
        </button>
      </div>

      {/* Waiting Patients */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Waiting Patients
        </h3>
        {patients.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {patients.map((p) => (
              <li
                key={p.tokenNumber}
                className="py-2 flex justify-between text-gray-700"
              >
                <span>{p.name}</span>
                <span className="text-sm text-gray-500">
                  Token: {p.tokenNumber}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No patients in queue</p>
        )}
      </div>
    </div>
  );
}
