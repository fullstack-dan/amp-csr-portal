export default function VehicleSubscriptionsList({ subscriptions }) {
    if (!subscriptions || subscriptions.length === 0) {
        return (
            <div className="text-center text-gray-500">
                No vehicle subscriptions found.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subscription Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vehicles
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {subscriptions.map((subscription) => (
                        <tr key={subscription.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {subscription.billingInfo.frequency
                                    .charAt(0)
                                    .toUpperCase() +
                                    subscription.billingInfo.frequency.slice(
                                        1
                                    )}{" "}
                                {subscription.planType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {subscription.vehicles.length}
                            </td>
                            <td
                                className={`px-6 py-4 whitespace-nowrap ${
                                    subscription.status === "active"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {subscription.status.charAt(0).toUpperCase() +
                                    subscription.status.slice(1)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
