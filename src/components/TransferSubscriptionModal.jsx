import { useState, useMemo, useEffect } from "react";
import { supabaseAPI as API } from "../api/supabaseAPI";
import Fuse from "fuse.js";

/**
 * Allows CSRs to transfer subscriptions
 */
export default function TransferSubscriptionModal({ subscription, onClose }) {
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await API.getAllCustomers();
            setCustomers(response);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const fuse = useMemo(() => {
        return new Fuse(customers, {
            keys: ["firstName", "lastName", "phone", "email"],
            threshold: 0.3,
        });
    }, [customers]);

    const results = searchQuery
        ? fuse.search(searchQuery).map((res) => res.item)
        : [];

    const handleSave = (event) => {
        event.preventDefault();
        if (!selectedCustomer) return;

        const updated = {
            ...subscription,
            customerId: selectedCustomer.id,
        };

        onClose(updated);

        document.getElementById("transfersub_modal")?.close();
    };

    if (loading) {
        return (
            <dialog id="transfersub_modal" className="modal">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                </div>
            </dialog>
        );
    }

    return (
        <dialog id="transfersub_modal" className="modal">
            <div className="modal-box w-full max-w-3xl">
                <h3 className="font-bold text-xl mb-4">
                    Transfer Subscription
                </h3>

                <div className="mb-4 flex flex-col gap-4">
                    <label className="label">
                        <span className="label-text">
                            Search for a customer
                        </span>
                    </label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Search by name or email"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setSelectedCustomer(null); // Clear selection on new query
                        }}
                    />

                    {results.length > 0 && (
                        <ul className="menu w-full bg-base-200 mt-2 rounded-box shadow max-h-48 overflow-y-auto">
                            {results.map((user) => (
                                <li key={user.id}>
                                    <button
                                        type="button"
                                        className={`justify-start text-left ${
                                            selectedCustomer?.id === user.id
                                                ? "bg-primary text-white"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setSelectedCustomer(user);
                                            setSearchQuery(
                                                `${user.firstName} ${user.lastName} (${user.email})`
                                            );
                                        }}
                                    >
                                        {user.firstName} {user.lastName} (
                                        {user.email})
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {selectedCustomer && (
                    <div className="mb-4">
                        <p className="text-sm">
                            Selected user:{" "}
                            <strong>
                                {selectedCustomer.firstName}{" "}
                                {selectedCustomer.lastName}
                            </strong>{" "}
                            ({selectedCustomer.email})
                        </p>
                    </div>
                )}

                <div className="modal-action">
                    <form method="dialog" className="flex gap-4">
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={!selectedCustomer}
                        >
                            Save Changes
                        </button>
                        <button
                            className="btn"
                            onClick={() => {
                                onClose(null);
                                document
                                    .getElementById("modifysub_modal")
                                    ?.close();
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}
