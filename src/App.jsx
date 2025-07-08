import { useState } from "react";
import { FocusProvider } from "./contexts/FocusContext";
import Navbar from "./components/Navbar";
import {
    DashboardHome,
    DashboardRequests,
    DashboardUsers,
    UserDetails,
    RequestDetails,
} from "./pages";
import { Route, Routes, Link } from "react-router";
import "./App.css";

import ampLogo from "./assets/amp-logo.png";

function App() {
    return (
        <main className="h-screen flex flex-col overflow-hidden">
            <div className="border-b flex justify-between items-center border-gray-200 p-6 flex-shrink-0">
                <Link to="/" className="flex items-center gap-4">
                    <img src={ampLogo} alt="AMP Logo" className="h-8" />
                    <span className="text-xl hidden md:block font-bold">
                        Customer Service Representative Portal
                    </span>
                </Link>
                <h2 className="">Hello, User!</h2>
            </div>

            <FocusProvider>
                <div className="flex flex-1 flex-col-reverse md:flex-row overflow-hidden">
                    <Navbar />
                    <div className="flex-1 overflow-hidden">
                        <Routes>
                            <Route path="/" element={<DashboardHome />} />
                            <Route path="/users" element={<DashboardUsers />} />
                            <Route
                                path="/users/:id"
                                element={<UserDetails />}
                            />
                            <Route
                                path="/requests"
                                element={<DashboardRequests />}
                            />
                            <Route
                                path="/requests/:requestId"
                                element={<RequestDetails />}
                            />
                        </Routes>
                    </div>
                </div>
            </FocusProvider>
        </main>
    );
}

export default App;
