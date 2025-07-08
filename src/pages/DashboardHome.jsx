// DashboardHome.jsx
import { useEffect, useState } from "react";
import { mockApi as API } from "../api/mockAPI";
import { CSRRequestStatus, CSRRequestType } from "../models/CSRRequest";
import UserList from "../components/UserList";

export default function DashboardHome() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [reqsLoading, setReqsLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);

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

            setPendingRequests(await Promise.all(hydratedRequests));
            setUsers(users);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        } finally {
            setReqsLoading(false);
            setUsersLoading(false);
        }
    };

    const handleUserSearch = async (searchQuery) => {
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
        <div className="flex flex-col h-full overflow-hidden">
            {/* Mobile: Stacked layout, Desktop: Side-by-side */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Requests Section */}
                <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-gray-200 overflow-hidden">
                    <h3 className="font-bold text-xl m-4 flex-shrink-0">
                        Pending Requests
                    </h3>
                    <ul className="flex-1 overflow-y-auto px-4 pb-4">
                        {reqsLoading ? (
                            <li className="py-4 text-gray-500">
                                Loading requests...
                            </li>
                        ) : pendingRequests.length > 0 ? (
                            pendingRequests.map((request) => (
                                <li
                                    key={request.id}
                                    className="border-b border-gray-200 py-4 last:border-b-0"
                                >
                                    <h4 className="font-semibold">
                                        {request.requestType
                                            .replace(/_/g, " ")
                                            .replace(/\b\w/g, (l) =>
                                                l.toUpperCase()
                                            )}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {request.customerEmail}
                                    </p>
                                    <p className="text-sm text-gray-700 mt-1">
                                        "{request.details}"
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2 italic">
                                        Last Updated:{" "}
                                        {new Date(
                                            request.updatedAt
                                        ).toLocaleString()}
                                    </p>
                                </li>
                            ))
                        ) : (
                            <li className="py-4 text-gray-500">
                                No pending requests.
                            </li>
                        )}
                    </ul>
                </div>

                {/* Users Section */}
                <UserList
                    users={users}
                    loading={usersLoading}
                    onSearch={handleUserSearch}
                    className="flex-1"
                />
            </div>
        </div>
    );
}
