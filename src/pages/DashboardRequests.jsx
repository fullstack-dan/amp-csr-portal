import { useEffect, useState } from "react";
import { supabaseAPI as API } from "../api/supabaseAPI";
import RequestsList from "../components/RequestsList";
import { CSRRequestStatus } from "../models/CSRRequest";

/**
 * DashboardRequests component displays a list of CSR requests with filtering and search functionality
 */
export default function DashboardRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            let fetchedRequests;

            if (statusFilter === "all") {
                fetchedRequests = await API.getAllRequests();
            } else {
                fetchedRequests = await API.getRequestsByStatus(statusFilter);
            }

            // Hydrate requests with customer emails
            const hydratedRequests = await Promise.all(
                fetchedRequests.map(async (request) => {
                    const user = await API.getCustomerById(request.customerId);
                    return {
                        ...request,
                        customerEmail: user ? user.email : "Unknown Email",
                    };
                })
            );

            setRequests(hydratedRequests);
        } catch (error) {
            console.error("Failed to fetch requests:", error);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (searchQuery) => {
        setLoading(true);
        try {
            if (!searchQuery.trim()) {
                await fetchRequests();
                return;
            }

            // Get all requests first
            const allRequests = await API.getAllRequests();

            // Hydrate with customer info
            const hydratedRequests = await Promise.all(
                allRequests.map(async (request) => {
                    const user = await API.getCustomerById(request.customerId);
                    return {
                        ...request,
                        customerEmail: user ? user.email : "Unknown Email",
                    };
                })
            );

            // Filter based on search query. Doing this in component for flexibility
            const query = searchQuery.toLowerCase();
            const filtered = hydratedRequests.filter(
                (request) =>
                    request.requestType.toLowerCase().includes(query) ||
                    request.customerEmail.toLowerCase().includes(query) ||
                    request.details.toLowerCase().includes(query) ||
                    request.id.toLowerCase().includes(query)
            );

            // Apply status filter if not "all"
            const finalFiltered =
                statusFilter === "all"
                    ? filtered
                    : filtered.filter((req) => req.status === statusFilter);

            setRequests(finalFiltered);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center overflow-hidden h-full  ">
            {/* Filter bar */}
            <div className="border-b w-full bg-white border-gray-200 p-6 flex flex-col md:flex-row gap-2 md:items-center shadow-xs">
                <span className="font-medium">Filter by status:</span>
                <div className="flex gap-2">
                    <button
                        className={`btn btn-sm ${
                            statusFilter === "all" ? "btn-primary" : "btn-ghost"
                        }`}
                        onClick={() => setStatusFilter("all")}
                        disabled={loading}
                    >
                        All
                    </button>
                    <button
                        className={`btn btn-sm ${
                            statusFilter === CSRRequestStatus.PENDING
                                ? "btn-warning"
                                : "btn-ghost"
                        }`}
                        onClick={() =>
                            setStatusFilter(CSRRequestStatus.PENDING)
                        }
                        disabled={loading}
                    >
                        Pending
                    </button>
                    <button
                        className={`btn btn-sm ${
                            statusFilter === CSRRequestStatus.REJECTED
                                ? "btn-error"
                                : "btn-ghost"
                        }`}
                        onClick={() =>
                            setStatusFilter(CSRRequestStatus.REJECTED)
                        }
                        disabled={loading}
                    >
                        Rejected
                    </button>
                    <button
                        className={`btn btn-sm ${
                            statusFilter === CSRRequestStatus.COMPLETED
                                ? "btn-success"
                                : "btn-ghost"
                        }`}
                        onClick={() =>
                            setStatusFilter(CSRRequestStatus.COMPLETED)
                        }
                        disabled={loading}
                    >
                        Completed
                    </button>
                </div>
                <div className=" md:ml-auto text-sm text-gray-600">
                    {!loading &&
                        `${requests.length} request${
                            requests.length !== 1 ? "s" : ""
                        } found`}
                </div>
            </div>

            <div className="flex justify-center overflow-y-auto w-full p-6 ">
                <RequestsList
                    requests={requests}
                    loading={loading}
                    onSearch={handleSearch}
                    title="All Requests"
                    className="flex-1 bg-white rounded-lg shadow-sm p-6"
                />
            </div>
        </div>
    );
}
