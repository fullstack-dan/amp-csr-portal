import { useEffect, useState } from "react";
import { supabaseAPI as API } from "../api/supabaseAPI";
import { UserList } from "../components";

/**
 * DashboardUsers component displays a list of users and a user search bar in the admin dashboard
 */
export default function DashboardUsers() {
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);

    useEffect(() => {
        setUsersLoading(true);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const users = await API.getAllCustomers();
            setUsers(users);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setUsersLoading(false);
        }
    };

    const handleSearch = async (searchQuery) => {
        setUsersLoading(true);
        if (!searchQuery.trim()) {
            setUsers(await API.getAllCustomers());
            setUsersLoading(false);
            return;
        }

        if (searchQuery.includes("@")) {
            const foundUser = await API.getCustomerByEmail(searchQuery);
            setUsers([foundUser].filter(Boolean));
        } else {
            const foundUsers = await API.getCustomersByName(searchQuery);
            setUsers(foundUsers);
        }
        setUsersLoading(false);
    };

    return (
        <div className="flex justify-center p-6  ">
            <UserList
                users={users}
                loading={usersLoading}
                onSearch={handleSearch}
                className="flex-1 bg-white rounded-lg shadow-sm p-6 "
            />
        </div>
    );
}
