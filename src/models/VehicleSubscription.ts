/**
 * Vehicle details within a subscription
 */
export interface Vehicle {
    id: string;
    vin: string;
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
    addedAt: string; // When this vehicle was added to the subscription
}

/**
 * Subscription plan types
 */
export enum SubscriptionPlanType {
    BASIC = "Basic",
    STANDARD = "Standard",
    PREMIUM = "Premium",
    ENTERPRISE = "Enterprise",
}

/**
 * Subscription status
 */
export enum SubscriptionStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    CANCELLED = "cancelled",
    EXPIRED = "expired",
}

/**
 * Billing frequency
 */
export enum BillingFrequency {
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    SEMI_ANNUAL = "semi_annual",
    ANNUAL = "annual",
}

/**
 * Object representing a car wash location
 */
export interface CarWashLocation {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    website?: string;
}

/**
 * Plan features/limits
 */
export interface PlanFeatures {
    maxVehicles: number; // Maximum number of vehicles allowed
    maxWashesPerMonth: number; // How many washes are included per month
    detailingIncluded: boolean;
}

/**
 * Payment method object
 */
export interface PaymentMethod {
    id: string;
    type: "card" | "paypal" | "bank_transfer";
    details: {
        cardBrand?: string;
        cardLast4?: string;
        paypalEmail?: string;
        bankAccountLast4?: string;
    };
}

/**
 * Billing information
 */
export interface BillingInfo {
    amount: number; // Current subscription amount
    currency: string;
    frequency: BillingFrequency;
    nextBillingDate: string;
    lastBillingDate?: string;
    paymentMethod: PaymentMethod;
    discount?: {
        percentage?: number;
        amount?: number;
        reason: string;
        validUntil?: string;
    };
}

/**
 * VehicleSubscription interface representing a customer's vehicle subscription
 */
export default interface VehicleSubscription {
    id: string;
    customerId: string; // ID of the customer who owns the subscription
    planType: SubscriptionPlanType;
    planFeatures: PlanFeatures;
    status: SubscriptionStatus;
    locations: CarWashLocation[];

    vehicles: Vehicle[]; // Array of vehicles covered by this subscription

    // Dates
    startDate: string;
    endDate?: string;
    pausedAt?: string;
    cancelledAt?: string;

    // Billing
    billingInfo: BillingInfo;

    // Metadata
    createdAt: string;
    updatedAt: string;
}
