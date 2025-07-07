export default interface VehicleSubscription {
    id: string; // Unique identifier for the vehicle subscription
    vehicleId: string; // ID of the vehicle associated with the subscription
    customerId: string; // ID of the customer who owns the subscription
    startDate: string; // start date of the subscription
    endDate: string; // end date of the subscription
    status: "active" | "inactive" | "cancelled"; // Status of the subscription
    createdAt: string;
    updatedAt: string;
    vehicleDetails: {
        // details about the vehicle
        make: string;
        model: string;
        year: number;
        vin: string;
    };
}
