/**
 * type of CSR request
 */
export enum CSRRequestType {
    ADDRESS_CHANGE = "address_change",
    ACCOUNT_ACCESS = "account_access",
    SUBSCRIPTION_MANAGEMENT = "subscription_management",
    BILLING_ISSUE = "billing_issue",
    SERVICE_CANCELLATION = "service_cancellation",
    OTHER = "other",
}

/**
 * status of a CSR request
 */
export enum CSRRequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    COMPLETED = "completed",
}

/**
 * Interface for the history of a CSR request
 */
export interface CSRRequestHistory {
    timestamp: string; // Timestamp of the history entry
    status: CSRRequestStatus; // Status of a CSR request
    updatedBy: string; // ID of the user who updated the status
    comment?: string; // Optional comment for this history entry
}

/**
 * CSRRequest interface representing a customer service request.
 */
export default interface CSRRequest {
    id: string; // Unique identifier for the CSR request
    customerId: string; // ID of the customer associated with the CSR request
    requestType: CSRRequestType; // Type of the CSR request
    status: CSRRequestStatus; // Status of the CSR request
    createdAt: string;
    updatedAt: string;
    details: string; // Additional details or comments from the customer
    history: CSRRequestHistory[];
}
