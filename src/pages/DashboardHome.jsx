import { useEffect, useState } from "react";
import { mockApi as API } from "../api/mockAPI";
import { CSRRequestStatus, CSRRequestType } from "../models/CSRRequest";

export default function DashboardHome() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [reqsLoading, setReqsLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setReqsLoading(true);
        setUsersLoading(true);
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
        } finally {
            setReqsLoading(false);
            setUsersLoading(false);
        }
    };

    const handleSearch = async () => {
        setUsersLoading(true);
        if (!searchQuery.trim()) {
            setUsers(await API.getAllCustomers());
            setUsersLoading(false);
            return;
        }

        if (searchQuery.includes("@")) {
            const foundUsers = await API.getCustomerByEmail(searchQuery);
            setUsers([foundUsers].filter(Boolean));
        } else {
            const foundUsers = await API.getCustomersByName(searchQuery);
            setUsers(foundUsers);
        }
        setUsersLoading(false);
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
                        {reqsLoading ? (
                            <li className="p-4 text-gray-500">
                                Loading requests...
                            </li>
                        ) : (
                            pendingRequests.map((request) => (
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

                                    <p className="text-sm ">
                                        "{request.details}"
                                    </p>
                                    <p className="text-sm mt-4 italic">
                                        Last Updated:{" "}
                                        {new Date(
                                            request.updatedAt
                                        ).toLocaleString()}
                                    </p>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Users Section */}
                <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-xl m-4">Users</h3>
                    <div className="p-4 flex w-full gap-4">
                        <label className="input flex-1">
                            <svg
                                className="h-[1em] opacity-50"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input
                                type="search"
                                className="grow"
                                placeholder="Search users by name or email"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </label>
                        <button className="btn btn-md" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                    <ul className="mt-2">
                        {usersLoading ? (
                            <li className="p-4 text-gray-500">
                                Loading users...
                            </li>
                        ) : users.length !== 0 ? (
                            users.map((user) => (
                                <li
                                    key={user.id}
                                    className="border-b border-gray-200 p-4"
                                >
                                    <h4 className="font-semibold">
                                        {user.firstName + " " + user.lastName}
                                    </h4>
                                    <p className="text-sm ">{user.email}</p>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-gray-500">
                                No users found.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
