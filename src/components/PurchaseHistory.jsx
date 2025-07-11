import { useState, useEffect } from "react";
import { supabaseAPI as API } from "../api/supabaseAPI";
export default function PurchaseHistory({ purchases }) {
    const [sortField, setSortField] = useState("purchaseDate");
    const [sortDirection, setSortDirection] = useState("desc");
    const [filterType, setFilterType] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [vehiclesById, setVehiclesById] = useState({});

    const itemsPerPage = 10;

    useEffect(() => {
        const fetchVehicles = async () => {
            const uniqueVehicleIds = Array.from(
                new Set(purchases.map((p) => p.vehicleId).filter(Boolean))
            );

            if (uniqueVehicleIds.length === 0) return;

            try {
                const vehicles = await API.getVehiclesByIds(uniqueVehicleIds);
                const map = {};
                vehicles.forEach((v) => {
                    map[v.id] = v;
                });
                setVehiclesById(map);
            } catch (err) {
                console.error("Failed to load vehicle info", err);
            }
        };

        fetchVehicles();
    }, [purchases]);

    const getVehicleDisplay = (purchase) => {
        const vehicle = vehiclesById[purchase.vehicleId];
        return vehicle
            ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
            : purchase.vehicleId || "Unknown Vehicle";
    };

    if (!purchases || purchases.length === 0) {
        return (
            <div className="text-center text-gray-500">
                No purchase history found.
            </div>
        );
    }

    const sortedPurchases = [...purchases].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        if (sortField === "purchaseDate") {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        }
        if (sortField === "amount") {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        }
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

    const filteredPurchases = sortedPurchases.filter((purchase) => {
        if (filterType === "subscription")
            return purchase.coveredBySubscription;
        if (filterType === "paid") return !purchase.coveredBySubscription;
        return true;
    });

    const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPurchases = filteredPurchases.slice(startIndex, endIndex);

    const totalPurchases = purchases.length;
    const subscriptionPurchases = purchases.filter(
        (p) => p.coveredBySubscription
    ).length;
    const paidPurchases = purchases.filter(
        (p) => !p.coveredBySubscription
    ).length;
    const totalSpent = purchases.reduce(
        (sum, p) => sum + parseFloat(p.amount),
        0
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return "↕️";
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const getPaymentMethodDisplay = (purchase) => {
        return purchase.coveredBySubscription
            ? "Subscription"
            : purchase.paymentMethod.charAt(0).toUpperCase() +
                  purchase.paymentMethod.slice(1);
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-4">
            {/* Summary statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Total Purchases</div>
                    <div className="text-2xl font-bold">{totalPurchases}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600">
                        Subscription Washes
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                        {subscriptionPurchases}
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600">Paid Services</div>
                    <div className="text-2xl font-bold text-green-700">
                        {paidPurchases}
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-purple-600">Total Spent</div>
                    <div className="text-2xl font-bold text-purple-700">
                        {formatCurrency(totalSpent)}
                    </div>
                </div>
            </div>

            {/* Filter options */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                    <button
                        className={`px-4 py-2 rounded-md cursor-pointer ${
                            filterType === "all"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        onClick={() => setFilterType("all")}
                    >
                        All ({totalPurchases})
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md cursor-pointer ${
                            filterType === "subscription"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        onClick={() => setFilterType("subscription")}
                    >
                        Subscription ({subscriptionPurchases})
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md cursor-pointer ${
                            filterType === "paid"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        onClick={() => setFilterType("paid")}
                    >
                        Paid ({paidPurchases})
                    </button>
                </div>
            </div>

            {/* Purchase history yable */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("purchaseDate")}
                            >
                                Date {getSortIcon("purchaseDate")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vehicle
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Service Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Payment Method
                            </th>
                            <th
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("amount")}
                            >
                                Amount {getSortIcon("amount")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedPurchases.map((purchase) => (
                            <tr key={purchase.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(purchase.purchaseDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {getVehicleDisplay(purchase)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {purchase.serviceType || "Standard Wash"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                            purchase.coveredBySubscription
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {getPaymentMethodDisplay(purchase)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                    {purchase.coveredBySubscription ? (
                                        <span className="text-green-600 font-medium">
                                            {formatCurrency(0)}
                                        </span>
                                    ) : (
                                        <span className="text-gray-900 font-medium">
                                            {formatCurrency(purchase.amount)}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
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

            {/* Footer info */}
            {filteredPurchases.length > 0 && (
                <div className="mt-2 text-sm text-gray-600 text-center">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredPurchases.length)} of{" "}
                    {filteredPurchases.length} purchases
                </div>
            )}
        </div>
    );
}
