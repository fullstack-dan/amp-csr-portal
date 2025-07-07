import { useState } from "react";
import Navbar from "./components/Navbar";
import DashboardHome from "./pages/DashboardHome";
import { Route, Routes } from "react-router";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div className="flex min-h-screen">
                <Navbar />
                <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    {/* <Route path="/requests" element={<DashboardRequests />} />
                <Route path="/users" element={<DashboardUsers />} /> */}
                </Routes>
            </div>
        </>
    );
}

export default App;
