/**
 * Purchase interface representing a user's purchase history.
 */
export interface Purchase {
    id: string;
    userId: string;
    vehicleId: string;
    purchaseDate: string;
    amount: number;
    paymentMethod: string;
    coveredBySubscription?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Address interface representing a customer's address.
 */
export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

/**
 * User interface
 */
export interface User {
    id: string; // Unique identifier for the user
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePicture?: string; // Optional profile picture URL
    createdAt: string;
    updatedAt: string;
    role: "admin" | "customer";
    password: string;
    purchaseHistory: Purchase[];
}

/**
 * Customer interface extending User with additional properties specific to customers.
 */
export interface Customer extends User {
    address: Address; // Address of the customer
    vehicleSubscriptions: string[]; // List of vehicle subscription IDs for the customer
    CSRRequests: string[]; // List of CSR request IDs associated with the customer
}
