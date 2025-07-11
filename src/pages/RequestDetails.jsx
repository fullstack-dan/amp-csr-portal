import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { supabaseAPI as API } from "../api/supabaseAPI";
import { CSRRequestStatus } from "../models/CSRRequest";
import CSRRequestActionModal from "../components/CSRRequestActionModal";
import { User, Clock, Info } from "lucide-react";
import {
    DetailsViewLayout,
    DetailsHeader,
    HeaderContent,
    DetailsContent,
    DetailsGrid,
    DetailsCard,
    InfoRow,
} from "../components/DetailsViewLayout";
import { formatPhoneNumber } from "../utils/formatting";

/**
 * RequestDetails component displays detailed information about a CSR request.
 * Uses the details view layout
 */
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
        try {
            const data = await API.getRequestById(requestId);
            const customerData = await API.getCustomerById(data.customerId);
            setRequest(data);
            setCustomer(customerData);
        } catch (error) {
            console.error("Failed to fetch request:", error);
        } finally {
            setLoading(false);
        }
    };

    const onModalClose = async (modifiedReq = null) => {
        document.getElementById("csrreqaction_modal").close();
        setLoading(true);
        if (modifiedReq !== null) {
            await API.updateRequest(modifiedReq);
            const newRequest = await API.getRequestById(requestId);
            setRequest(newRequest);
            const customerData = await API.getCustomerById(
                newRequest.customerId
            );
            setCustomer(customerData);
        }
        setLoading(false);
    };

    const handleTakeAction = () => {
        document.getElementById("csrreqaction_modal").showModal();
    };

    return (
        <DetailsViewLayout
            loading={loading}
            notFound={!request}
            notFoundMessage="Request not found"
            backLink="/requests"
        >
            <CSRRequestActionModal request={request} onClose={onModalClose} />

            <DetailsHeader>
                <HeaderContent
                    title={request?.requestType}
                    subtitle={`Request ID: ${request?.id}`}
                    badge={request?.status}
                    badgeColor={`badge-${
                        request?.status === "pending"
                            ? "warning"
                            : request?.status === "completed"
                            ? "success"
                            : "error"
                    }`}
                    actions={
                        <button
                            className="btn btn-primary bg-blue-600"
                            disabled={
                                request?.status !== CSRRequestStatus.PENDING
                            }
                            onClick={handleTakeAction}
                            title="Take Action on Request"
                        >
                            Take Action
                        </button>
                    }
                >
                    <p className="text-sm mt-1">
                        Last updated:{" "}
                        {new Date(request?.updatedAt).toLocaleDateString()}{" "}
                        {new Date(request?.updatedAt).toLocaleTimeString()}
                    </p>
                </HeaderContent>
            </DetailsHeader>

            <DetailsContent>
                <DetailsGrid cols={3}>
                    {/* Customer information */}
                    <DetailsCard title="Customer Information" icon={User}>
                        <div className="space-y-3">
                            <div>
                                <p className="font-medium">
                                    {customer?.firstName} {customer?.lastName}
                                </p>
                                <p className="text-gray-600">
                                    {customer?.address.city},{" "}
                                    {customer?.address.state}{" "}
                                    {customer?.address.zipCode}
                                </p>
                            </div>
                            <InfoRow label="Email" value={customer?.email} />
                            <InfoRow
                                label="Phone"
                                value={formatPhoneNumber(customer?.phone)}
                            />
                            <Link to={`/users/${customer?.id}`}>
                                <button className="btn mt-2">
                                    View Customer
                                </button>
                            </Link>
                        </div>
                    </DetailsCard>

                    {/* Request details */}
                    <DetailsCard title="Request Details" icon={Info}>
                        <p className="text-gray-700">{request?.details}</p>
                    </DetailsCard>

                    {/* Request history */}
                    <DetailsCard title="Request History" icon={Clock}>
                        <ul className="space-y-2 list-disc">
                            {request?.history.map((entry, index) => (
                                <li key={index} className="text-sm">
                                    <span className="font-medium">
                                        {new Date(
                                            entry.timestamp
                                        ).toLocaleString()}
                                        :
                                    </span>{" "}
                                    <span className="italic text-gray-600">
                                        {entry.comment}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </DetailsCard>
                </DetailsGrid>
            </DetailsContent>
        </DetailsViewLayout>
    );
}
