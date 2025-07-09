/**
 * type of CSR request
 */
export enum CSRRequestType {
    ADDRESS_CHANGE = "Address Change",
    ACCOUNT_ACCESS = "Account Access",
    SUBSCRIPTION_MANAGEMENT = "Subscription Management",
    BILLING_ISSUE = "Billing Issue",
    SERVICE_CANCELLATION = "Service Cancellation",
    OTHER = "Other",
}

/**
 * status of a CSR request
 */
export enum CSRRequestStatus {
    PENDING = "pending",
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
