import { useState, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import { Link, useLocation } from "react-router";
import { Plus, Minus } from "lucide-react";

export default function UserList({
    users,
    loading = false,
    title = "Users",
    showTitle = true,
    className = "",
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fuse = useMemo(
        () =>
            new Fuse(users, {
                keys: ["firstName", "lastName", "email"],
                threshold: 0.3,
                includeScore: true,
            }),
        [users]
    );

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;
        return fuse.search(searchQuery).map((res) => res.item);
    }, [searchQuery, users, fuse]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className={`flex flex-col w-full max-w-5xl ${className}`}>
            {showTitle && (
                <div className="flex justify-between items-center m-4 flex-shrink-0">
                    <h3 className="font-bold text-xl">{title}</h3>
                    <button
                        className="btn btn-sm md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <Minus className="h-4 w-4" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                    </button>
                </div>
            )}

            <div
                className={`px-4 pb-4 gap-4 flex-shrink-0 flex-col md:flex md:flex-row md:items-center ${
                    isOpen ? "flex" : "hidden"
                } md:flex`}
            >
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
            </div>

            <ul
                className={`flex-1 overflow-y-auto pb-4 ${
                    isOpen ? "block" : "hidden"
                } md:block`}
            >
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                    </div>
                ) : filteredUsers.length !== 0 ? (
                    paginatedUsers.map((user) => (
                        <li
                            key={user.id}
                            className="flex flex-wrap gap-4 items-center justify-between border-b border-gray-200 p-4 hover:bg-base-300 last:border-b-0 hover:cursor-pointer transition duration-200 ease-in-out"
                        >
                            <div>
                                <h4 className="font-semibold">
                                    {user.firstName + " " + user.lastName}
                                </h4>
                                <p className="text-sm">{user.email}</p>
                                <p className="text-sm">
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
                    <li className="py-4 px-4 text-center text-gray-500">
                        No users found.
                    </li>
                )}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => goToPage(i + 1)}
                                className={`px-3 py-1 rounded cursor-pointer ${
                                    currentPage === i + 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 hover:bg-gray-200"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </ul>
        </div>
    );
}
