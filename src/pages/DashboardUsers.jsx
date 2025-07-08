// DashboardUsers.jsx
import React, { useEffect, useState } from "react";
import { mockApi as API } from "../api/mockAPI";
import UserList from "../components/UserList";

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
        <UserList
            users={users}
            loading={usersLoading}
            onSearch={handleSearch}
        />
    );
}
