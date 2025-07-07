/**
 * Interface representing the history of a CSR request.
 */
export interface CSRRequestHistory {
    timestamp: string; // Timestamp of the history entry
    status: "pending" | "approved" | "rejected" | "completed";
    updatedBy: string; // ID of the user who updated the status
    comment?: string; // Optional comment for this history entry
}

/**
 * CSRRequest interface representing a customer service request.
 */
export default interface CSRRequest {
    id: string; // Unique identifier for the CSR request
    customerId: string; // ID of the customer associated with the CSR request
    vehicleId: string; // ID of the vehicle associated with the CSR request
    requestType: "new" | "update" | "cancel"; // Type of CSR request
    status: "pending" | "approved" | "rejected" | "completed"; // Status of the CSR request
    createdAt: string;
    updatedAt: string;
    details: string; // Additional details or comments about the CSR request
    history: CSRRequestHistory[];
}
