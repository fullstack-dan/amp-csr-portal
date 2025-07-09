import { exampleCsrRequests } from "../db/csrrequests";
import { customers } from "../db/users";
import { exampleVehicleSubscriptions } from "../db/subscriptions";
import CSRRequest, { CSRRequestStatus } from "../models/CSRRequest";
import { User, Customer } from "../models/User";
import VehicleSubscription, {
    Vehicle,
    SubscriptionStatus,
    SubscriptionPlanType,
} from "../models/VehicleSubscription";

// Simulate async API calls with a small delay
const simulateDelay = (ms: number = Math.random() * 1500) =>
    new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock API for CSR, User, and Vehicle Subscription data
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
    async getAllCustomers(): Promise<Customer[]> {
        await simulateDelay();
        return [...customers];
    },

    async getCustomerById(id: string): Promise<Customer | null> {
        await simulateDelay();
        return customers.find((customer) => customer.id === id) || null;
    },

    async getCustomerByEmail(email: string): Promise<Customer | null> {
        await simulateDelay();
        return customers.find((customer) => customer.email === email) || null;
    },

    async getCustomersByPhone(phone: string): Promise<Customer[]> {
        await simulateDelay();
        return customers.filter((customer) => customer.phone === phone);
    },

    async getCustomersByName(name: string): Promise<Customer[]> {
        await simulateDelay();
        const lowerName = name.toLowerCase();
        return customers.filter(
            (customer) =>
                customer.firstName.toLowerCase().includes(lowerName) ||
                customer.lastName.toLowerCase().includes(lowerName)
        );
    },

    // Vehicle Subscriptions
    async getAllSubscriptions(): Promise<VehicleSubscription[]> {
        await simulateDelay();
        return [...exampleVehicleSubscriptions];
    },

    async getSubscriptionById(id: string): Promise<VehicleSubscription | null> {
        await simulateDelay();
        return exampleVehicleSubscriptions.find((sub) => sub.id === id) || null;
    },

    async getSubscriptionsByCustomerId(
        customerId: string
    ): Promise<VehicleSubscription[]> {
        await simulateDelay();
        return exampleVehicleSubscriptions.filter(
            (sub) => sub.customerId === customerId
        );
    },

    async getActiveSubscriptionsByCustomerId(
        customerId: string
    ): Promise<VehicleSubscription[]> {
        await simulateDelay();
        return exampleVehicleSubscriptions.filter(
            (sub) =>
                sub.customerId === customerId &&
                sub.status === SubscriptionStatus.ACTIVE
        );
    },

    async getSubscriptionsByStatus(
        status: SubscriptionStatus
    ): Promise<VehicleSubscription[]> {
        await simulateDelay();
        return exampleVehicleSubscriptions.filter(
            (sub) => sub.status === status
        );
    },

    async getSubscriptionsByPlanType(
        planType: SubscriptionPlanType
    ): Promise<VehicleSubscription[]> {
        await simulateDelay();
        return exampleVehicleSubscriptions.filter(
            (sub) => sub.planType === planType
        );
    },

    async getSubscriptionsByVehicleVin(
        vin: string
    ): Promise<VehicleSubscription | null> {
        await simulateDelay();
        return (
            exampleVehicleSubscriptions.find((sub) =>
                sub.vehicles.some((vehicle) => vehicle.vin === vin)
            ) || null
        );
    },

    async addVehicleToSubscription(
        subscriptionId: string,
        vehicle: Vehicle
    ): Promise<VehicleSubscription | null> {
        await simulateDelay();
        const subscription = exampleVehicleSubscriptions.find(
            (sub) => sub.id === subscriptionId
        );
        if (!subscription) return null;

        // Check if max vehicles reached
        if (
            subscription.vehicles.length >=
            subscription.planFeatures.maxVehicles
        ) {
            throw new Error(
                `Maximum vehicles (${subscription.planFeatures.maxVehicles}) reached for this plan`
            );
        }

        // Check if vehicle already exists
        if (subscription.vehicles.some((v) => v.vin === vehicle.vin)) {
            throw new Error("Vehicle already exists in subscription");
        }

        subscription.vehicles.push({
            ...vehicle,
            addedAt: new Date().toISOString(),
        });
        subscription.updatedAt = new Date().toISOString();

        return subscription;
    },

    async removeVehicleFromSubscription(
        subscriptionId: string,
        vehicleId: string
    ): Promise<VehicleSubscription | null> {
        await simulateDelay();
        const subscription = exampleVehicleSubscriptions.find(
            (sub) => sub.id === subscriptionId
        );
        if (!subscription) return null;

        subscription.vehicles = subscription.vehicles.filter(
            (v) => v.id !== vehicleId
        );
        subscription.updatedAt = new Date().toISOString();

        return subscription;
    },

    async updateSubscriptionStatus(
        subscriptionId: string,
        status: SubscriptionStatus
    ): Promise<VehicleSubscription | null> {
        await simulateDelay();
        const subscription = exampleVehicleSubscriptions.find(
            (sub) => sub.id === subscriptionId
        );
        if (!subscription) return null;

        subscription.status = status;
        subscription.updatedAt = new Date().toISOString();

        // Update status-specific timestamps
        switch (status) {
            case SubscriptionStatus.PAUSED:
                subscription.pausedAt = new Date().toISOString();
                break;
            case SubscriptionStatus.CANCELLED:
                subscription.cancelledAt = new Date().toISOString();
                subscription.endDate = new Date().toISOString();
                break;
            case SubscriptionStatus.ACTIVE:
                subscription.pausedAt = undefined;
                break;
        }

        return subscription;
    },

    async getSubscriptionUsageStats(subscriptionId: string) {
        await simulateDelay();
        const subscription = exampleVehicleSubscriptions.find(
            (sub) => sub.id === subscriptionId
        );
        if (!subscription) return null;

        // Mock usage data
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        return {
            subscriptionId,
            month: currentMonth + 1,
            year: currentYear,
            washesUsed: Math.floor(
                Math.random() * subscription.planFeatures.maxWashesPerMonth
            ),
            washesRemaining:
                subscription.planFeatures.maxWashesPerMonth -
                Math.floor(
                    Math.random() * subscription.planFeatures.maxWashesPerMonth
                ),
            detailingUsed: subscription.planFeatures.detailingIncluded
                ? Math.floor(Math.random() * 2)
                : 0,
            vehiclesActive: subscription.vehicles.length,
            lastWashDate: new Date(
                Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
        };
    },

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

        // Subscription stats
        const totalSubscriptions = exampleVehicleSubscriptions.length;
        const activeSubscriptions = exampleVehicleSubscriptions.filter(
            (sub) => sub.status === SubscriptionStatus.ACTIVE
        ).length;
        const pausedSubscriptions = exampleVehicleSubscriptions.filter(
            (sub) => sub.status === SubscriptionStatus.PAUSED
        ).length;
        const totalVehicles = exampleVehicleSubscriptions.reduce(
            (count, sub) => count + sub.vehicles.length,
            0
        );

        // Revenue calculations
        const monthlyRecurringRevenue = exampleVehicleSubscriptions
            .filter((sub) => sub.status === SubscriptionStatus.ACTIVE)
            .reduce((total, sub) => {
                const amount = sub.billingInfo.amount;
                // Normalize to monthly
                switch (sub.billingInfo.frequency) {
                    case "quarterly":
                        return total + amount / 3;
                    case "semi_annual":
                        return total + amount / 6;
                    case "annual":
                        return total + amount / 12;
                    default:
                        return total + amount;
                }
            }, 0);

        return {
            totalRequests,
            pendingRequests,
            completedRequests,
            totalCustomers,
            totalSubscriptions,
            activeSubscriptions,
            pausedSubscriptions,
            totalVehicles,
            monthlyRecurringRevenue:
                Math.round(monthlyRecurringRevenue * 100) / 100,
            subscriptionsByPlan: {
                basic: exampleVehicleSubscriptions.filter(
                    (s) => s.planType === SubscriptionPlanType.BASIC
                ).length,
                standard: exampleVehicleSubscriptions.filter(
                    (s) => s.planType === SubscriptionPlanType.STANDARD
                ).length,
                premium: exampleVehicleSubscriptions.filter(
                    (s) => s.planType === SubscriptionPlanType.PREMIUM
                ).length,
                enterprise: exampleVehicleSubscriptions.filter(
                    (s) => s.planType === SubscriptionPlanType.ENTERPRISE
                ).length,
            },
        };
    },

    // Combined customer data with subscriptions
    async getCustomerWithSubscriptions(customerId: string) {
        await simulateDelay();
        const customer = await this.getCustomerById(customerId);
        if (!customer) return null;

        const subscriptions = await this.getSubscriptionsByCustomerId(
            customerId
        );

        return {
            customer: { ...customer },
            subscriptions: subscriptions,
            hasActiveSubscription: subscriptions.some(
                (s) => s.status === SubscriptionStatus.ACTIVE
            ),
            totalVehicles: subscriptions.reduce(
                (count, sub) => count + sub.vehicles.length,
                0
            ),
        };
    },
};
