import supabase from "../config/supabase";
import { Customer } from "../models/User";
import CSRRequest, { CSRRequestStatus } from "../models/CSRRequest";
import VehicleSubscription, {
    SubscriptionStatus,
    SubscriptionPlanType,
} from "../models/VehicleSubscription";
import { camelCase } from "lodash";

function convertKeysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(convertKeysToCamelCase);
    } else if (obj !== null && typeof obj === "object") {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const newKey = camelCase(key);
            acc[newKey] = convertKeysToCamelCase(value);
            return acc;
        }, {} as any);
    }
    return obj;
}

export const supabaseAPI = {
    // CSR Requests
    async getAllRequests(): Promise<CSRRequest[]> {
        const { data, error } = await supabase
            .from("csr_requests")
            .select(
                `
                *,
                history:csr_request_history(*)
            `
            )
            .order("created_at", { ascending: false });

        if (error) throw error;

        return data.map((req) => ({
            id: req.id,
            customerId: req.customer_id,
            requestType: req.request_type,
            status: req.status,
            details: req.details,
            createdAt: req.created_at,
            updatedAt: req.updated_at,
            history: req.history.map((h: any) => ({
                timestamp: h.timestamp,
                status: h.status,
                updatedBy: h.updated_by,
                comment: h.comment,
            })),
        }));
    },

    async getRequestById(id: string): Promise<CSRRequest | null> {
        const { data, error } = await supabase
            .from("csr_requests")
            .select(
                `
                *,
                history:csr_request_history(*)
            `
            )
            .eq("id", id)
            .single();

        if (error) return null;

        return {
            id: data.id,
            customerId: data.customer_id,
            requestType: data.request_type,
            status: data.status,
            details: data.details,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            history: data.history.map((h: any) => ({
                timestamp: h.timestamp,
                status: h.status,
                updatedBy: h.updated_by,
                comment: h.comment,
            })),
        };
    },

    async getRequestsByCustomerId(customerId: string): Promise<CSRRequest[]> {
        const { data, error } = await supabase
            .from("csr_requests")
            .select(
                `
                *,
                history:csr_request_history(*)
            `
            )
            .eq("customer_id", customerId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return data.map((req) => ({
            id: req.id,
            customerId: req.customer_id,
            requestType: req.request_type,
            status: req.status,
            details: req.details,
            createdAt: req.created_at,
            updatedAt: req.updated_at,
            history: req.history.map((h: any) => ({
                timestamp: h.timestamp,
                status: h.status,
                updatedBy: h.updated_by,
                comment: h.comment,
            })),
        }));
    },

    async getRequestsByStatus(status: CSRRequestStatus): Promise<CSRRequest[]> {
        const { data, error } = await supabase
            .from("csr_requests")
            .select(
                `
                *,
                history:csr_request_history(*)
            `
            )
            .eq("status", status)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return data.map((req) => ({
            id: req.id,
            customerId: req.customer_id,
            requestType: req.request_type,
            status: req.status,
            details: req.details,
            createdAt: req.created_at,
            updatedAt: req.updated_at,
            history: req.history.map((h: any) => ({
                timestamp: h.timestamp,
                status: h.status,
                updatedBy: h.updated_by,
                comment: h.comment,
            })),
        }));
    },

    async updateRequest(request: CSRRequest): Promise<CSRRequest | null> {
        // Update the main request record
        const { error: updateError } = await supabase
            .from("csr_requests")
            .update({
                status: request.status,
                details: request.details,
                updated_at: new Date().toISOString(),
            })
            .eq("id", request.id);

        if (updateError) throw updateError;

        // Remove all existing history entries for this request
        const { error: deleteHistoryError } = await supabase
            .from("csr_request_history")
            .delete()
            .eq("request_id", request.id);

        if (deleteHistoryError) throw deleteHistoryError;

        // Insert the new history entries
        if (request.history && request.history.length > 0) {
            const historyRows = request.history.map((h) => ({
                request_id: request.id,
                status: h.status,
                updated_by: h.updatedBy,
                comment: h.comment,
                timestamp: h.timestamp,
            }));

            const { error: insertHistoryError } = await supabase
                .from("csr_request_history")
                .insert(historyRows);

            if (insertHistoryError) throw insertHistoryError;
        }

        // Return the updated request
        return this.getRequestById(request.id);
    },

    // Customers
    async getAllCustomers(): Promise<Customer[]> {
        const { data, error } = await supabase
            .from("users")
            .select(
                `
                *,
                address:customer_addresses(*)
            `
            )
            .eq("role", "customer");

        if (error) throw error;

        return data.map((user) => ({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone,
            profilePicture: user.profile_picture,
            role: user.role,
            password: user.password,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            address: user.address
                ? {
                      street: user.address.street,
                      city: user.address.city,
                      state: user.address.state,
                      zipCode: user.address.zip_code,
                  }
                : undefined,
            vehicleSubscriptions: [],
            CSRRequests: [],
        }));
    },

    async getCustomerById(id: string): Promise<Customer | null> {
        const { data, error } = await supabase
            .from("users")
            .select(
                `
                *,
                address:customer_addresses(*)
            `
            )
            .eq("id", id)
            .single();

        if (error) return null;

        return {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            profilePicture: data.profile_picture,
            role: data.role,
            password: data.password,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            address: data.address
                ? {
                      street: data.address.street,
                      city: data.address.city,
                      state: data.address.state,
                      zipCode: data.address.zip_code,
                  }
                : undefined,
            vehicleSubscriptions: [],
            CSRRequests: [],
        };
    },

    async getCustomerByEmail(email: string): Promise<Customer | null> {
        const { data, error } = await supabase
            .from("users")
            .select(
                `
                *,
                address:customer_addresses(*)
            `
            )
            .eq("email", email)
            .single();

        if (error) return null;

        return {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            profilePicture: data.profile_picture,
            role: data.role,
            password: data.password,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            address: data.address
                ? {
                      street: data.address.street,
                      city: data.address.city,
                      state: data.address.state,
                      zipCode: data.address.zip_code,
                  }
                : undefined,
            vehicleSubscriptions: [],
            CSRRequests: [],
        };
    },

    async getCustomersByName(name: string): Promise<Customer[]> {
        const { data, error } = await supabase
            .from("users")
            .select(
                `
                *,
                address:customer_addresses(*)
            `
            )
            .eq("role", "customer")
            .or(`first_name.ilike.%${name}%,last_name.ilike.%${name}%`);

        if (error) throw error;

        return data.map((user) => ({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone,
            profilePicture: user.profile_picture,
            role: user.role,
            password: user.password,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            address: user.address
                ? {
                      street: user.address.street,
                      city: user.address.city,
                      state: user.address.state,
                      zipCode: user.address.zip_code,
                  }
                : undefined,
            vehicleSubscriptions: [],
            CSRRequests: [],
        }));
    },

    async updateCustomerDetails(
        userId: string,
        userData: any,
        addressData: any
    ): Promise<Customer> {
        // Validate input
        if (!userId) throw new Error("User ID is required");

        // Start by updating the users table
        const { first_name, last_name, email, phone } = userData;
        const { street, city, state, zip_code } = addressData;

        // Use a transaction-like flow since Supabase doesn't support multi-table transactions directly
        const { error: userError } = await supabase
            .from("users")
            .update({
                first_name,
                last_name,
                email,
                phone,
            })
            .eq("id", userId);

        if (userError) {
            throw new Error(`Failed to update user info: ${userError.message}`);
        }

        const { error: addressError } = await supabase
            .from("customer_addresses")
            .upsert({
                user_id: userId,
                street,
                city,
                state,
                zip_code,
            });

        if (addressError) {
            throw new Error(
                `Failed to update address: ${addressError.message}`
            );
        }

        // Fetch the updated customer details
        const { data, error: fetchError } = await supabase
            .from("users")
            .select(
                `
                *,
                address:customer_addresses(*)
            `
            )
            .eq("id", userId)
            .single();

        if (fetchError) {
            throw new Error(
                `Failed to fetch updated customer: ${fetchError.message}`
            );
        }

        console.log(data);

        return data;
    },

    // Vehicle Subscriptions
    async getSubscriptionById(id: string): Promise<VehicleSubscription | null> {
        const { data, error } = await supabase
            .from("vehicle_subscriptions")
            .select(
                `
                *,
                features:subscription_plan_features(*),
                locations:subscription_locations(
                    location:car_wash_locations(*)
                ),
                vehicles(*),
                billing:billing_info(
                    *,
                    payment_method:payment_methods(*)
                ),
                discount:billing_discounts(*)
            `
            )
            .eq("id", id)
            .single();

        if (error) return null;

        return convertKeysToCamelCase(this.mapSubscriptionData(data));
    },

    async getSubscriptionsByCustomerId(
        customerId: string
    ): Promise<VehicleSubscription[]> {
        const { data, error } = await supabase
            .from("vehicle_subscriptions")
            .select(
                `
                *,
                features:subscription_plan_features(*),
                locations:subscription_locations(
                    location:car_wash_locations(*)
                ),
                vehicles(*),
                billing:billing_info(
                    *,
                    payment_method:payment_methods(*)
                ),
                discount:billing_discounts(*)
            `
            )
            .eq("customer_id", customerId);

        if (error) throw error;

        return data.map((sub) => this.mapSubscriptionData(sub));
    },

    // Helper function to map Supabase data to our model
    mapSubscriptionData(data: any): VehicleSubscription {
        return {
            id: data.id,
            customerId: data.customer_id,
            planType: data.plan_type,
            planFeatures: {
                maxVehicles: data.features.max_vehicles,
                maxWashesPerMonth: data.features.max_washes_per_month,
                detailingIncluded: data.features.detailing_included,
            },
            status: data.status,
            locations: data.locations.map((l: any) => ({
                id: l.location.id,
                name: l.location.name,
                address: l.location.address,
                city: l.location.city,
                state: l.location.state,
                zip: l.location.zip,
                phone: l.location.phone,
                email: l.location.email,
                website: l.location.website,
            })),
            vehicles: data.vehicles.map((v: any) => ({
                id: v.id,
                vin: v.vin,
                make: v.make,
                model: v.model,
                year: v.year,
                color: v.color,
                licensePlate: v.license_plate,
                addedAt: v.added_at,
            })),
            startDate: data.start_date,
            endDate: data.end_date,
            pausedAt: data.paused_at,
            cancelledAt: data.cancelled_at,
            billingInfo: {
                amount: parseFloat(data.billing.amount),
                currency: data.billing.currency,
                frequency: data.billing.frequency,
                nextBillingDate: data.billing.next_billing_date,
                lastBillingDate: data.billing.last_billing_date,
                paymentMethod: {
                    id: data.billing.payment_method.id,
                    type: data.billing.payment_method.type,
                    details: {
                        cardBrand: data.billing.payment_method.card_brand,
                        cardLast4: data.billing.payment_method.card_last4,
                        paypalEmail: data.billing.payment_method.paypal_email,
                        bankAccountLast4:
                            data.billing.payment_method.bank_account_last4,
                    },
                },
                discount: data.discount
                    ? {
                          percentage: data.discount.percentage,
                          amount: parseFloat(data.discount.amount || 0),
                          reason: data.discount.reason,
                          validUntil: data.discount.valid_until,
                      }
                    : undefined,
            },
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    },

    // Combined customer data with subscriptions
    async getCustomerWithSubscriptions(customerId: string) {
        const customer = await this.getCustomerById(customerId);
        if (!customer) return null;

        const subscriptions = await this.getSubscriptionsByCustomerId(
            customerId
        );

        return {
            customer,
            subscriptions,
            hasActiveSubscription: subscriptions.some(
                (s) => s.status === SubscriptionStatus.ACTIVE
            ),
            totalVehicles: subscriptions.reduce(
                (count, sub) => count + sub.vehicles.length,
                0
            ),
        };
    },

    // Additional subscription methods
    async updateSubscriptionStatus(
        subscriptionId: string,
        status: SubscriptionStatus
    ): Promise<VehicleSubscription | null> {
        const updateData: any = { status };

        // Update status-specific timestamps
        switch (status) {
            case SubscriptionStatus.PAUSED:
                updateData.paused_at = new Date().toISOString();
                break;
            case SubscriptionStatus.CANCELLED:
                updateData.cancelled_at = new Date().toISOString();
                updateData.end_date = new Date().toISOString();
                break;
            case SubscriptionStatus.ACTIVE:
                updateData.paused_at = null;
                break;
        }

        const { error } = await supabase
            .from("vehicle_subscriptions")
            .update(updateData)
            .eq("id", subscriptionId);

        if (error) throw error;

        return this.getSubscriptionById(subscriptionId);
    },

    async addVehicleToSubscription(
        subscriptionId: string,
        vehicle: any
    ): Promise<VehicleSubscription | null> {
        // Check if subscription exists and get current vehicle count
        const subscription = await this.getSubscriptionById(subscriptionId);
        if (!subscription) throw new Error("Subscription not found");

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
        const { data: existingVehicle } = await supabase
            .from("vehicles")
            .select("id")
            .eq("vin", vehicle.vin)
            .single();

        if (existingVehicle) {
            throw new Error("Vehicle already exists in system");
        }

        //get the last vehicle id added to db
        const { data: lastVehicle } = await supabase
            .from("vehicles")
            .select("id")
            .order("id", { ascending: false })
            .limit(1)
            .single();

        //ids are in form veh-###... add 1 and create the new id
        const newId = `veh-${parseInt(lastVehicle.id.split("-")[1]) + 1}`;

        // Add vehicle
        const { error } = await supabase.from("vehicles").insert({
            id: newId,
            subscription_id: subscriptionId,
            vin: vehicle.vin,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            color: vehicle.color,
            license_plate: vehicle.licensePlate,
        });

        if (error) throw error;

        return this.getSubscriptionById(subscriptionId);
    },

    async removeVehicleFromSubscription(
        subscriptionId: string,
        vehicleId: string
    ): Promise<VehicleSubscription | null> {
        const { error } = await supabase
            .from("vehicles")
            .delete()
            .eq("id", vehicleId)
            .eq("subscription_id", subscriptionId);

        if (error) throw error;

        return this.getSubscriptionById(subscriptionId);
    },
};
