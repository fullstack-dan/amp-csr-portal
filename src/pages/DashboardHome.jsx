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
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Requests section */}
                <RequestsList
                    requests={pendingRequests}
                    loading={reqsLoading}
                    title="Pending Requests"
                    className="flex-1 border-b md:border-b-0 md:border-r border-gray-200"
                    onSearch={null} // No search in dashboard view
                />

                {/* Users section */}
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
