import { exampleCsrRequests } from "../db/csrrequests";
import { customers } from "../db/users";
import CSRRequest, { CSRRequestStatus } from "../models/CSRRequest";
import { User } from "../models/User";

// Simulate async API calls with a small delay
const simulateDelay = (ms: number = Math.random() * 1000) =>
    new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock API for CSR and User data
 */
export const mockApi = {
    // CSR Requests
    async getAllRequests(): Promise<CSRRequest[]> {
        await simulateDelay();
        return [...exampleCsrRequests];
    },

    async getRequestById(id: string): Promise<CSRRequest | null> {
        await simulateDelay();
        return exampleCsrRequests.find((req) => req.id === id) || null;
    },

    async getRequestsByStatus(status: CSRRequestStatus): Promise<CSRRequest[]> {
        await simulateDelay();
        return exampleCsrRequests.filter((req) => req.status === status);
    },

    async getRequestsByCustomerId(customerId: string): Promise<CSRRequest[]> {
        await simulateDelay();
        return exampleCsrRequests.filter(
            (req) => req.customerId === customerId
        );
    },

    async updateRequestStatus(
        requestId: string,
        status: CSRRequestStatus,
        comment?: string
    ): Promise<CSRRequest | null> {
        await simulateDelay();
        const request = exampleCsrRequests.find((req) => req.id === requestId);
        if (!request) return null;

        request.status = status;
        request.updatedAt = new Date().toISOString();
        request.history.unshift({
            timestamp: new Date().toISOString(),
            status,
            updatedBy: "csr-001", //TODO: replace with actual user ID
            comment,
        });

        return request;
    },

    // Customers
    async getAllCustomers(): Promise<User[]> {
        await simulateDelay();
        return [...customers];
    },

    async getCustomerById(id: string): Promise<User | null> {
        await simulateDelay();
        return customers.find((customer) => customer.id === id) || null;
    },

    async getCustomerByEmail(email: string): Promise<User | null> {
        await simulateDelay();
        return customers.find((customer) => customer.email === email) || null;
    },

    async getCustomersByPhone(phone: string): Promise<User[]> {
        await simulateDelay();
        return customers.filter((customer) => customer.phone === phone);
    },

    // Dashboard Statistics
    async getDashboardStats() {
        await simulateDelay();

        const totalRequests = exampleCsrRequests.length;
        const pendingRequests = exampleCsrRequests.filter(
            (req) => req.status === CSRRequestStatus.PENDING
        ).length;
        const completedRequests = exampleCsrRequests.filter(
            (req) => req.status === CSRRequestStatus.COMPLETED
        ).length;
        const totalCustomers = customers.length;

        return {
            totalRequests,
            pendingRequests,
            completedRequests,
            totalCustomers,
        };
    },
};
