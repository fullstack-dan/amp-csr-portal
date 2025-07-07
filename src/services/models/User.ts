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
    createdAt: string;
    updatedAt: string;
    role: "admin" | "customer";
    password: string;
}

/**
 * Customer interface extending User with additional properties specific to customers.
 */
export interface Customer extends User {
    address: Address; // Address of the customer
    vehicleSubscriptions: string[]; // List of vehicle subscription IDs for the customer
    CSRRequests: string[]; // List of CSR request IDs associated with the customer
}
