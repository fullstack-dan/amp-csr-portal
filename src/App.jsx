import { useState } from "react";
import Navbar from "./components/Navbar";
import {
    DashboardHome,
    DashboardRequests,
    DashboardUsers,
    UserDetails,
    RequestDetails,
    SubscriptionDetails,
} from "./pages";
import { Route, Routes, Link } from "react-router";
import { User } from "lucide-react";
import "./App.css";

import ampLogo from "./assets/amp-logo.png";

function App() {
    return (
        <main className="h-dvh flex flex-col bg-gray-100">
            <div className="border-b flex justify-between items-center border-gray-200 p-6 flex-shrink-0 bg-blue-800 text-white">
                <Link to="/" className="flex items-center gap-4">
                    <img src={ampLogo} alt="AMP Logo" className="h-8" />
                </Link>
                <Link
                    to="/"
                    className="flex items-center gap-2 text-white hover:text-blue-200"
                >
                    <User className="h-5 w-5" />
                    <span className="hidden md:block">Hello, User</span>
                </Link>
            </div>
            <div className="flex flex-1 flex-col-reverse md:flex-row overflow-hidden">
                <Navbar />
                <div className="flex-1 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="/users" element={<DashboardUsers />} />
                        <Route path="/users/:id" element={<UserDetails />} />
                        <Route
                            path="/requests"
                            element={<DashboardRequests />}
                        />
                        <Route
                            path="/requests/:requestId"
                            element={<RequestDetails />}
                        />
                        <Route
                            path="/subscriptions/:subscriptionId"
                            element={<SubscriptionDetails />}
                        />
                    </Routes>
                </div>
            </div>
        </main>
    );
}

export default App;
