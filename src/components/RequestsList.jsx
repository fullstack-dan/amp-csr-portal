import { useState, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import { Link, useLocation } from "react-router";

export default function RequestsList({
    requests,
    loading = false,
    title = "Requests",
    showTitle = true,
    className = "",
}) {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Automatically open if not on the home page ("/")
    useEffect(() => {
        if (location.pathname !== "/") {
            setIsOpen(true);
        }
    }, [location.pathname]);

    const fuse = useMemo(
        () =>
            new Fuse(requests, {
                keys: ["requestType", "customerEmail", "details"],
                threshold: 0.3,
            }),
        [requests]
    );

    const filteredRequests = useMemo(() => {
        if (!searchQuery.trim()) return requests;
        return fuse.search(searchQuery).map((res) => res.item);
    }, [searchQuery, requests, fuse]);

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
                <div className="flex justify-between items-center m-4 flex-shrink-0">
                    <h3 className="font-bold text-xl">
                        {title} ({filteredRequests.length})
                    </h3>
                    <button
                        className="btn btn-sm md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? "Hide" : "Show"}
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
                        placeholder="Search by type, email, or details"
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
                    <li className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                    </li>
                ) : filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
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
