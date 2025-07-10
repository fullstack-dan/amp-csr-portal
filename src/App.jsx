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
import "./App.css";

import ampLogo from "./assets/amp-logo.png";

function App() {
    return (
        <main className="h-screen flex flex-col bg-gray-100">
            {/* <div className="border-b flex justify-between items-center border-gray-200 p-6 flex-shrink-0 bg-blue-800 text-white">
                <Link to="/" className="flex items-center gap-4">
                    <img src={ampLogo} alt="AMP Logo" className="h-8" />
                    <span className="text-xl hidden md:block font-bold ">
                        Customer Service Representative Portal
                    </span>
                </Link>
                <h2 className="">Hello, User!</h2>
            </div> */}

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
