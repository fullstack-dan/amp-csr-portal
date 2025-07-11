import { useState } from "react";
import { Link } from "react-router";

/**
 * Table showing a user's vehicle subscriptions
 */
export default function VehicleSubscriptionsList({ subscriptions, onDelete }) {
    const [deletingSub, setDeletingSub] = useState(null);

    if (!subscriptions || subscriptions.length === 0) {
        return (
            <div className="text-center text-gray-500">
                No vehicle subscriptions found.
            </div>
        );
    }

    return (
        <>
            {deletingSub ? (
                <div className="text-center text-gray-500">
                    <h2 className="text-lg text-center font-bold">
                        Remove Subscription from Account
                    </h2>
                    <p className="text-sm text-center text-gray-600">
                        Are you sure you want to remove this{" "}
                        {deletingSub.billingInfo.frequency
                            .charAt(0)
                            .toUpperCase() +
                            deletingSub.billingInfo.frequency.slice(1)}{" "}
                        {deletingSub.planType} subscription with{" "}
                        {deletingSub.vehicles.length} vehicle(s)? This action
                        cannot be undone.
                    </p>
                    <div className="flex justify-center mt-4">
                        <button
                            className="btn btn-error  px-4 py-2 rounded-md"
                            onClick={() => {
                                onDelete(deletingSub.id);
                                setDeletingSub(null);
                            }}
                        >
                            Remove
                        </button>
                        <button
                            className="btn bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2"
                            onClick={() => setDeletingSub(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="">
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
                                <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
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
                                        {subscription.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            subscription.status.slice(1)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap flex justify-end space-x-2">
                                        <Link
                                            to={`/subscriptions/${subscription.id}`}
                                        >
                                            <button className="btn">
                                                View Details
                                            </button>
                                        </Link>
                                        <button
                                            className="btn btn-error"
                                            onClick={() => {
                                                setDeletingSub(subscription);
                                            }}
                                            disabled={deletingSub}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
