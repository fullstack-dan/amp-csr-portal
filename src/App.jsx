// App.jsx
import { useState } from "react";
import Navbar from "./components/Navbar";
import { DashboardHome, DashboardUsers } from "./pages";
import { Route, Routes } from "react-router";
import "./App.css";

function App() {
    return (
        <main className="h-screen flex flex-col overflow-hidden">
            <div className="border-b border-gray-200 p-6 flex-shrink-0">
                <h1 className="text-3xl font-bold mb-4">AMP CSR Dashboard</h1>
                <h2 className="text-xl">Hello, User!</h2>
            </div>

            <div className="flex flex-1 flex-col-reverse md:flex-row overflow-hidden">
                <Navbar />
                {/* Routes container - Makes sure content can scroll */}
                <div className="flex-1 overflow-hidden">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="/users" element={<DashboardUsers />} />
                    </Routes>
                </div>
            </div>
        </main>
    );
}

export default App;
