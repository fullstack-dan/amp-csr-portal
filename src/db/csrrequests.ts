import CSRRequest, {
    CSRRequestType,
    CSRRequestStatus,
} from "../models/CSRRequest";

export const exampleCsrRequests: CSRRequest[] = [
    {
        id: "req-001",
        customerId: "cust-1001",
        requestType: CSRRequestType.ADDRESS_CHANGE,
        status: CSRRequestStatus.PENDING,
        createdAt: new Date("2025-06-01T10:00:00Z").toISOString(),
        updatedAt: new Date("2025-06-01T10:00:00Z").toISOString(),
        details: "Changing address from 123 Old St to 456 New Ave",
        history: [
            {
                timestamp: new Date("2025-06-01T10:00:00Z").toISOString(),
                status: CSRRequestStatus.PENDING,
                updatedBy: "csr-001",
                comment: "Initial request received",
            },
        ],
    },
    {
        id: "req-002",
        customerId: "cust-1002",
        requestType: CSRRequestType.ACCOUNT_ACCESS,
        status: CSRRequestStatus.APPROVED,
        createdAt: new Date("2025-06-02T09:30:00Z").toISOString(),
        updatedAt: new Date("2025-06-02T11:00:00Z").toISOString(),
        details: "Forgot my password and need access to my account",
        history: [
            {
                timestamp: new Date("2025-06-02T09:30:00Z").toISOString(),
                status: CSRRequestStatus.APPROVED,
                updatedBy: "csr-001",
                comment: "Access granted after verification",
            },
            {
                timestamp: new Date("2025-06-02T10:00:00Z").toISOString(),
                status: CSRRequestStatus.PENDING,
                updatedBy: "csr-001",
                comment: "Customer verified identity via security questions",
            },
            {
                timestamp: new Date("2025-06-02T09:30:00Z").toISOString(),
                status: CSRRequestStatus.PENDING,
                updatedBy: "csr-001",
                comment: "Initial request received",
            },
        ],
    },
    {
        id: "req-003",
        customerId: "cust-1003",
        requestType: CSRRequestType.SUBSCRIPTION_MANAGEMENT,
        status: CSRRequestStatus.REJECTED,
        createdAt: new Date("2025-06-03T14:15:00Z").toISOString(),
        updatedAt: new Date("2025-06-03T16:00:00Z").toISOString(),
        details: "I'd like to change my subscription to the Basic plan",
        history: [
            {
                timestamp: new Date("2025-06-03T16:00:00Z").toISOString(),
                status: CSRRequestStatus.REJECTED,
                updatedBy: "csr-001",
                comment:
                    "Subscription change rejected due to plan restrictions",
            },
            {
                timestamp: new Date("2025-06-03T14:30:00Z").toISOString(),
                status: CSRRequestStatus.PENDING,
                updatedBy: "csr-001",
                comment:
                    "Explained to customer that primary location does not support Basic plan",
            },
            {
                timestamp: new Date("2025-06-03T14:15:00Z").toISOString(),
                status: CSRRequestStatus.PENDING,
                updatedBy: "csr-001",
                comment: "Initial request received",
            },
        ],
    },
    {
        id: "req-004",
        customerId: "cust-1004",
        requestType: CSRRequestType.BILLING_ISSUE,
        status: CSRRequestStatus.PENDING,
        createdAt: new Date("2025-06-04T08:45:00Z").toISOString(),
        updatedAt: new Date("2025-06-04T08:45:00Z").toISOString(),
        details: "I was charged twice for my last bill",
        history: [
            {
                timestamp: new Date("2025-06-04T08:45:00Z").toISOString(),
                status: CSRRequestStatus.PENDING,
                updatedBy: "csr-001",
                comment: "Billing issue reported by customer",
            },
        ],
    },
    {
        id: "req-005",
        customerId: "cust-1004",
        requestType: CSRRequestType.SERVICE_CANCELLATION,
        status: CSRRequestStatus.COMPLETED,
        createdAt: new Date("2025-06-05T12:00:00Z").toISOString(),
        updatedAt: new Date("2025-06-05T13:30:00Z").toISOString(),
        details: "I'm relocating and need to cancel my service",
        history: [
            {
                timestamp: new Date("2025-06-05T12:00:00Z").toISOString(),
                status: CSRRequestStatus.COMPLETED,
                updatedBy: "csr-001",
                comment: "Service cancellation processed successfully",
            },
            {
                timestamp: new Date("2025-06-05T12:30:00Z").toISOString(),
                status: CSRRequestStatus.PENDING,
                updatedBy: "csr-001",
                comment:
                    "Customer confirmed relocation and requested cancellation",
            },
            {
                timestamp: new Date("2025-06-05T12:00:00Z").toISOString(),
                status: CSRRequestStatus.PENDING,
                updatedBy: "csr-001",
                comment: "Initial request received",
            },
        ],
    },
    {
        id: "req-006",
        customerId: "cust-1001",
        requestType: CSRRequestType.OTHER,
        status: CSRRequestStatus.PENDING,
        createdAt: new Date("2025-06-06T15:00:00Z").toISOString(),
        updatedAt: new Date("2025-06-06T15:00:00Z").toISOString(),
        details: "I'd like to learn more about your services!",
        history: [
            {
                timestamp: new Date("2025-06-06T15:00:00Z").toISOString(),
                status: CSRRequestStatus.PENDING,
                updatedBy: "csr-001",
                comment: "Initial request received",
            },
        ],
    },
];
