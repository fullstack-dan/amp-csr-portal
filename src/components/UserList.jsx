import React, { useState } from "react";

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

            <ul className="flex-1 overflow-y-auto px-4 pb-4">
                {loading ? (
                    <li className="py-4 text-gray-500">Loading users...</li>
                ) : users.length !== 0 ? (
                    users.map((user) => (
                        <li
                            key={user.id}
                            className="border-b border-gray-200 py-4 hover:bg-gray-50 last:border-b-0 hover:cursor-pointer"
                        >
                            <h4 className="font-semibold">
                                {user.firstName + " " + user.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {user.email}
                            </p>
                            <p className="text-sm text-gray-600">
                                {user.address.city + ", " + user.address.state}
                            </p>
                        </li>
                    ))
                ) : (
                    <li className="py-4 text-gray-500">No users found.</li>
                )}
            </ul>
        </div>
    );
}
