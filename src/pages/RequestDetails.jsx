import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabaseAPI as API } from "../api/supabaseAPI";
import { CSRRequestStatus } from "../models/CSRRequest";
import CSRRequestActionModal from "../components/CSRRequestActionModal";
import { User, Clock, Info } from "lucide-react";
import { Link } from "react-router";

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
            case "rejected":
                return "badge-error";
            case "completed":
                return "badge-success";
            default:
                return "badge-ghost";
        }
    };

    const onModalClose = async (modifiedReq = null) => {
        document.getElementById("csrreqaction_modal").close();
        setLoading(true);
        if (modifiedReq) {
            await API.updateRequest(modifiedReq);
            const newRequest = await API.getRequestById(requestId);
            setRequest(newRequest);
            const customer = await API.getCustomerById(newRequest.customerId);
            setCustomer(customer);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <>
            <CSRRequestActionModal request={request} onClose={onModalClose} />
            <div className="">
                <div className="bg-white border-b p-6 border-gray-200 shadow-xs flex items-center justify-between ">
                    <div>
                        <h2 className="text-2xl font-bold  flex items-center gap-2">
                            {request.requestType}
                            <span
                                className={`ml-2 badge badge-sm ${getStatusColor(
                                    request.status
                                )}`}
                            >
                                {request.status}
                            </span>
                        </h2>
                        <p className="text-sm text-gray-500">
                            Request ID: {request.id}
                        </p>
                        <p className="text-sm mt-1 ">
                            Last updated:{" "}
                            {new Date(request.updatedAt).toLocaleDateString()}{" "}
                            {new Date(request.updatedAt).toLocaleTimeString()}
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        disabled={request.status !== CSRRequestStatus.PENDING}
                        onClick={() =>
                            document
                                .getElementById("csrreqaction_modal")
                                .showModal()
                        }
                        title="Take Action on Request"
                    >
                        Take Action
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {/* Customer details */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Customer Information
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="font-medium">
                                    {customer.firstName} {customer.lastName}
                                </p>
                                <p className="">
                                    {customer.address.state},{" "}
                                    {customer.address.city},{" "}
                                    {customer.address.zipCode}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium">{customer.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-medium">{customer.phone}</p>
                            </div>
                            <Link to={`/users/${customer.id}`}>
                                <button className="btn">View Customer</button>
                            </Link>
                        </div>
                    </div>
                    {/* Request details */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Request Details
                        </h3>
                        <div className="space-y-3">
                            <p className="">{request.details}</p>
                        </div>
                    </div>
                    {/* Request history */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Request History
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">
                            {request.history.map((entry, index) => (
                                <li key={index} className="text-sm">
                                    <span className="font-medium">
                                        {new Date(
                                            entry.timestamp
                                        ).toLocaleString()}
                                        :
                                    </span>{" "}
                                    <span className="italic">
                                        {entry.comment}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
