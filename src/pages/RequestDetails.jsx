import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { mockApi as API } from "../api/mockAPI";
import { CSRRequestStatus } from "../models/CSRRequest";
import { Mail, Phone } from "lucide-react";

export default function RequestDetails() {
    const { requestId } = useParams();
    const [request, setRequest] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!requestId) {
            console.error("No request ID provided");
            return;
        }
        setLoading(true);
        fetchRequest();
    }, [requestId]);

    const fetchRequest = async () => {
        const data = await API.getRequestById(requestId);
        const customer = await API.getCustomerById(data.customerId);
        setRequest(data);
        setCustomer(customer);
        setLoading(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "badge-warning";
            case "approved":
                return "badge-success";
            case "rejected":
                return "badge-error";
            case "completed":
                return "badge-info";
            default:
                return "badge-ghost";
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 ">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold">
                        {request.requestType}
                        <span
                            className={`ml-2 badge badge-sm ${getStatusColor(
                                request.status
                            )}`}
                        >
                            {request.status}
                        </span>
                    </h2>
                    <p>ID: {request.id}</p>
                    <p className="text-sm text-gray-500">
                        Last Updated:{" "}
                        {new Date(request.updatedAt).toLocaleDateString()}{" "}
                        {new Date(request.updatedAt).toLocaleTimeString()}
                    </p>
                </div>
                <button className="btn btn-primary">Take Action</button>
            </div>
            <div className="mb-4">
                <h3 className="font-bold text-md">Customer Information</h3>
                <div className="flex justify-between">
                    <div>
                        <p>
                            {customer.firstName} {customer.lastName}
                        </p>
                        <p>
                            {customer.address.city}, {customer.address.state}{" "}
                            {customer.address.zipCode}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href={`mailto:${customer.email}`}
                            className="p-2 hover:bg-base-300 rounded-lg transition-colors"
                            title="Send email"
                        >
                            <Mail className="w-5 h-5" />
                        </a>
                        <a
                            href={`tel:${customer.phone}`}
                            className="p-2 hover:bg-base-300 rounded-lg transition-colors"
                            title="Call customer"
                        >
                            <Phone className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <h3 className="font-bold text-md">Request Details</h3>
                <p>{request.details}</p>
            </div>
            <div className="mb-4">
                <h3 className="font-bold text-md">Request History</h3>
                <ul className="list-disc pl-5">
                    {request.history.map((entry, index) => (
                        <li key={index} className="mb-2">
                            <span className="font-semibold">
                                {new Date(entry.timestamp).toLocaleString()}:
                            </span>{" "}
                            {entry.comment}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
