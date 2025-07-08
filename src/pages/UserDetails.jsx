import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { mockApi as API } from "../api/mockAPI";
import { Mail, Phone } from "lucide-react";

export default function UserDetails({ editingMode = false }) {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(editingMode);

    useEffect(() => {
        if (!id) {
            setCustomer(null);
            setLoading(false);
            return;
        }
        fetchCustomer(id);
    }, [id]);

    const fetchCustomer = async (customerId) => {
        setLoading(true);
        try {
            const customerData = await API.getCustomerById(customerId);
            setCustomer(customerData);
        } catch (error) {
            console.error("Failed to fetch customer details:", error);
            setCustomer(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-4 text-gray-500">Loading...</div>;
    }

    if (!customer) {
        return <div className="p-4 text-gray-500">No customer selected</div>;
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 p-4">
                    {customer.profilePicture && (
                        <img
                            src={customer.profilePicture}
                            alt={`${customer.firstName} ${customer.lastName}`}
                            className="w-16 h-16 rounded-full"
                        />
                    )}
                    <div>
                        <h2 className="text-xl font-bold">
                            {customer.firstName} {customer.lastName}
                        </h2>
                        <p className="text-gray-600">{customer.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4">
                    <a
                        href={`mailto:${customer.email}`}
                        className="hover:text-blue-500"
                    >
                        <Mail />
                    </a>
                    <a
                        href={`tel:${customer.phone}`}
                        className="hover:text-blue-500"
                    >
                        <Phone />
                    </a>
                </div>
            </div>
            {/* Customer profile details */}
            <div className="p-4 flex-1 overflow-y-auto">
                <h3 className="font-bold mb-2">Customer Details</h3>
                <p className="mb-2">
                    <span className="font-semibold">Phone</span> <br />
                    {customer.phone.replace(
                        /(\d{3})(\d{3})(\d{4})/,
                        "($1) $2-$3"
                    )}
                </p>
                <p className="mb-2">
                    <span className="font-semibold">Address</span> <br />
                    {customer.address.street}
                    <br />
                    {customer.address.city}, {customer.address.state}{" "}
                    {customer.address.zipCode}
                </p>
                <p className="mb-2">
                    <span className="font-semibold">Member since</span> <br />
                    {new Date(customer.createdAt).toLocaleDateString()}
                </p>

                <div className="flex mt-8 gap-4">
                    <button className="btn" onClick={() => setEditing(true)}>
                        Edit details
                    </button>
                    <button className="btn">Reset password</button>
                </div>
            </div>
        </div>
    );
}
