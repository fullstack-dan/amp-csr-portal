import { useEffect, useState } from "react";
import { mockApi as API } from "../api/mockAPI";
import { CSRRequestStatus, CSRRequestType } from "../models/CSRRequest";

export default function DashboardHome() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const requests = await API.getRequestsByStatus(
                CSRRequestStatus.PENDING
            );
            const users = await API.getAllCustomers();

            const hydratedRequests = requests.map(async (request) => {
                const user = await API.getCustomerById(request.customerId);
                return {
                    ...request,
                    customerEmail: user ? user.email : "Unknown Email",
                };
            });

            console.log("CSR Requests:", requests);
            console.log("Users:", users);

            setPendingRequests(await Promise.all(hydratedRequests));
            setUsers(users);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen">
            <div className="border-b border-gray-200 p-6">
                <h1 className="text-4xl font-bold mb-4">AMP CSR Dashboard</h1>
                <h2 className="text-2xl">Hello, User!</h2>
            </div>

            <div className="w-full md:flex">
                {/* Requests Section */}
                <div className="flex flex-col flex-1 border-r border-gray-200">
                    <h3 className="font-bold text-xl m-4">Pending Requests</h3>
                    <ul className="mt-2">
                        {pendingRequests.map((request) => (
                            <li
                                key={request.id}
                                className="border-b border-gray-200 p-4"
                            >
                                <h4 className="font-semibold">
                                    {request.requestType}
                                </h4>
                                <p className="text-sm">
                                    {request.customerEmail}
                                </p>

                                <p className="text-sm ">"{request.details}"</p>
                                <p className="text-sm mt-4 italic">
                                    Last Updated:{" "}
                                    {new Date(
                                        request.updatedAt
                                    ).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Users Section */}
                <div className="flex-1 flex flex-col ">
                    <h3 className="font-bold text-xl m-4">Users</h3>
                    <ul className="mt-2">
                        {users.map((user) => (
                            <li
                                key={user.id}
                                className="border-b border-gray-200 p-4"
                            >
                                <h4 className="font-semibold">{user.name}</h4>
                                <p className="text-sm ">{user.email}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
