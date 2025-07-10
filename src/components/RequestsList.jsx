// components/RequestsList.jsx
import React, { useState } from "react";
import { Link } from "react-router";

export default function RequestsList({
    requests,
    loading,
    onSearch,
    title = "Requests",
    showTitle = true,
    className = "",
}) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "badge-warning";
            case "rejected":
                return "badge-error";
            case "completed":
                return "badge-success";
            default:
                return "badge-ghost";
        }
    };

    return (
        <div className={`flex flex-col w-full max-w-5xl ${className}`}>
            {showTitle && (
                <h3 className="font-bold text-xl m-4 flex-shrink-0">{title}</h3>
            )}

            {onSearch && (
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
                            placeholder="Search by type, customer email, or details"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                        />
                    </label>
                    <button className="btn btn-md" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            )}

            <ul className="flex-1 overflow-y-auto pb-4">
                {loading ? (
                    <li className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                    </li>
                ) : requests.length > 0 ? (
                    requests.map((request) => (
                        <li
                            key={request.id}
                            className="flex justify-between items-start border-b border-gray-200 p-4 last:border-b-0 hover:bg-base-300 transition duration-200 ease-in-out"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold">
                                        {request.requestType}
                                    </h4>
                                    <span
                                        className={`badge badge-sm ${getStatusColor(
                                            request.status
                                        )}`}
                                    >
                                        {request.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {request.customerEmail}
                                </p>
                                <p className="text-sm mt-1">
                                    "{request.details}"
                                </p>
                                <p className="text-sm text-gray-500 mt-2 italic">
                                    Last Updated:{" "}
                                    {new Date(
                                        request.updatedAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <Link
                                to={`/requests/${request.id}`}
                                className="ml-4"
                            >
                                <button className="btn">View</button>
                            </Link>
                        </li>
                    ))
                ) : (
                    <li className="py-4 text-center text-gray-500">
                        No requests found.
                    </li>
                )}
            </ul>
        </div>
    );
}
