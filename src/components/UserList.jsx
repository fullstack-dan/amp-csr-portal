import React, { useState } from "react";
import { Link } from "react-router";

export default function UserList({
    users,
    loading,
    onSearch,
    title = "Users",
    showTitle = true,
    className = "",
}) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    return (
        <div className={`flex flex-col h-full overflow-hidden ${className}`}>
            {showTitle && (
                <h3 className="font-bold text-xl m-4 flex-shrink-0">{title}</h3>
            )}

            <div className="px-4 pb-4 flex w-full gap-4 flex-shrink-0">
                <label className="input flex-1 flex items-center gap-2 border rounded-lg px-3 py-2">
                    <svg
                        className="h-4 w-4 opacity-50 flex-shrink-0"
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
                        className="grow outline-none"
                        placeholder="Search by name or email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </label>
                <button className="btn btn-md" onClick={handleSearch}>
                    Search
                </button>
            </div>

            <ul className="flex-1 overflow-y-auto pb-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                    </div>
                ) : users.length !== 0 ? (
                    users.map((user) => (
                        <li
                            key={user.id}
                            className="flex items-center justify-between border-b border-gray-200 p-4 hover:bg-base-300 last:border-b-0 hover:cursor-pointer transition duration-200 ease-in-out"
                        >
                            <div>
                                <h4 className="font-semibold">
                                    {user.firstName + " " + user.lastName}
                                </h4>
                                <p className="text-sm ">{user.email}</p>
                                <p className="text-sm ">
                                    {user.address.city +
                                        ", " +
                                        user.address.state}
                                </p>
                            </div>
                            <Link to={`/users/${user.id}`}>
                                <button className="btn">View</button>
                            </Link>
                        </li>
                    ))
                ) : (
                    <li className="py-4 ">No users found.</li>
                )}
            </ul>
        </div>
    );
}
