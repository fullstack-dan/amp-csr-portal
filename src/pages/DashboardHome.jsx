// DashboardHome.jsx
import { useEffect, useState } from "react";
import { supabaseAPI as API } from "../api/supabaseAPI";
import { CSRRequestStatus, CSRRequestType } from "../models/CSRRequest";
import UserList from "../components/UserList";
import RequestsList from "../components/RequestsList";

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
        <div className="grid grid-cols-1 h-full w-full md:grid-cols-2 p-6 ">
            {/* Requests section */}
            <div className="p-6">
                <RequestsList
                    requests={pendingRequests}
                    loading={reqsLoading}
                    title="Pending Requests"
                    className="bg-white rounded-lg shadow-sm p-6"
                    onSearch={null} // No search in dashboard view
                />
            </div>

            {/* Users section */}
            <div className="p-6">
                <UserList
                    users={users}
                    loading={usersLoading}
                    onSearch={handleUserSearch}
                    className="bg-white rounded-lg shadow-sm p-6"
                />
            </div>
        </div>
    );
}
