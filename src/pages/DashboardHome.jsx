import { useEffect } from "react";
import { mockApi as API } from "../api/mockAPI";

export default function DashboardHome() {
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const requests = await API.getAllRequests();
            const users = await API.getAllCustomers();

            console.log("CSR Requests:", requests);
            console.log("Users:", users);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex flex-col max-w-md p-4">
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                <p className="text-lg">Welcome to the CSR Portal Dashboard!</p>
                <p className="text-sm mt-2">
                    Here you can view all active CSR requests, search for users,
                    and see CSR information.
                </p>
            </div>
        </div>
    );
}
