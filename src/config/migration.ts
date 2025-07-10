import supabase from "./supabase.ts";
import { customers, admins } from "../db/users.ts";
import { exampleCsrRequests } from "../db/csrrequests.ts";
import { exampleVehicleSubscriptions } from "../db/subscriptions.ts";

async function migrateData() {
    console.log("Starting migration to Supabase...");

    try {
        // 1. Migrate Users (both customers and admins)
        console.log("Migrating users...");
        const allUsers = [...customers, ...admins];

        for (const user of allUsers) {
            const { error: userError } = await supabase.from("users").insert({
                id: user.id,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                phone: user.phone,
                profile_picture: user.profilePicture,
                role: user.role,
                password: user.password, // In production, hash this!
                created_at: user.createdAt,
                updated_at: user.updatedAt,
            });

            if (userError) {
                console.error(`Error inserting user ${user.id}:`, userError);
                continue;
            }

            // If it's a customer, insert their address
            if ("address" in user) {
                const { error: addressError } = await supabase
                    .from("customer_addresses")
                    .insert({
                        user_id: user.id,
                        street: user.address.street,
                        city: user.address.city,
                        state: user.address.state,
                        zip_code: user.address.zipCode,
                    });

                if (addressError) {
                    console.error(
                        `Error inserting address for ${user.id}:`,
                        addressError
                    );
                }
            }
        }

        // 2. Migrate CSR Requests
        console.log("Migrating CSR requests...");
        for (const request of exampleCsrRequests) {
            // Insert the request
            const { error: requestError } = await supabase
                .from("csr_requests")
                .insert({
                    id: request.id,
                    customer_id: request.customerId,
                    request_type: request.requestType,
                    status: request.status,
                    details: request.details,
                    created_at: request.createdAt,
                    updated_at: request.updatedAt,
                });

            if (requestError) {
                console.error(
                    `Error inserting request ${request.id}:`,
                    requestError
                );
                continue;
            }

            // Insert request history
            for (const history of request.history) {
                const { error: historyError } = await supabase
                    .from("csr_request_history")
                    .insert({
                        request_id: request.id,
                        status: history.status,
                        updated_by: history.updatedBy,
                        comment: history.comment,
                        timestamp: history.timestamp,
                    });

                if (historyError) {
                    console.error(
                        `Error inserting history for ${request.id}:`,
                        historyError
                    );
                }
            }
        }

        // 3. Migrate Car Wash Locations (extract unique locations)
        console.log("Migrating car wash locations...");
        const uniqueLocations = new Map();

        exampleVehicleSubscriptions.forEach((sub) => {
            sub.locations.forEach((loc) => {
                uniqueLocations.set(loc.id, loc);
            });
        });

        for (const location of uniqueLocations.values()) {
            const { error } = await supabase.from("car_wash_locations").insert({
                id: location.id,
                name: location.name,
                address: location.address,
                city: location.city,
                state: location.state,
                zip: location.zip,
                phone: location.phone,
                email: location.email,
                website: location.website,
            });

            if (error) {
                console.error(
                    `Error inserting location ${location.id}:`,
                    error
                );
            }
        }

        // 4. Migrate Payment Methods (extract unique payment methods)
        console.log("Migrating payment methods...");
        const paymentMethods = new Map();

        exampleVehicleSubscriptions.forEach((sub) => {
            const pm = sub.billingInfo.paymentMethod;
            paymentMethods.set(pm.id, pm);
        });

        for (const pm of paymentMethods.values()) {
            const { error } = await supabase.from("payment_methods").insert({
                id: pm.id,
                type: pm.type,
                card_brand: pm.details.cardBrand,
                card_last4: pm.details.cardLast4,
                paypal_email: pm.details.paypalEmail,
                bank_account_last4: pm.details.bankAccountLast4,
            });

            if (error) {
                console.error(
                    `Error inserting payment method ${pm.id}:`,
                    error
                );
            }
        }

        // 5. Migrate Vehicle Subscriptions
        console.log("Migrating vehicle subscriptions...");
        for (const subscription of exampleVehicleSubscriptions) {
            // Insert subscription
            const { error: subError } = await supabase
                .from("vehicle_subscriptions")
                .insert({
                    id: subscription.id,
                    customer_id: subscription.customerId,
                    plan_type: subscription.planType,
                    status: subscription.status,
                    start_date: subscription.startDate,
                    end_date: subscription.endDate,
                    paused_at: subscription.pausedAt,
                    cancelled_at: subscription.cancelledAt,
                    created_at: subscription.createdAt,
                    updated_at: subscription.updatedAt,
                });

            if (subError) {
                console.error(
                    `Error inserting subscription ${subscription.id}:`,
                    subError
                );
                continue;
            }

            // Insert plan features
            const { error: featuresError } = await supabase
                .from("subscription_plan_features")
                .insert({
                    subscription_id: subscription.id,
                    max_vehicles: subscription.planFeatures.maxVehicles,
                    max_washes_per_month:
                        subscription.planFeatures.maxWashesPerMonth,
                    detailing_included:
                        subscription.planFeatures.detailingIncluded,
                });

            if (featuresError) {
                console.error(
                    `Error inserting features for ${subscription.id}:`,
                    featuresError
                );
            }

            // Insert subscription locations (many-to-many)
            for (const location of subscription.locations) {
                const { error } = await supabase
                    .from("subscription_locations")
                    .insert({
                        subscription_id: subscription.id,
                        location_id: location.id,
                    });

                if (error) {
                    console.error(
                        `Error linking location for ${subscription.id}:`,
                        error
                    );
                }
            }

            // Insert vehicles
            for (const vehicle of subscription.vehicles) {
                const { error } = await supabase.from("vehicles").insert({
                    id: vehicle.id,
                    subscription_id: subscription.id,
                    vin: vehicle.vin,
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    color: vehicle.color,
                    license_plate: vehicle.licensePlate,
                    added_at: vehicle.addedAt,
                });

                if (error) {
                    console.error(
                        `Error inserting vehicle ${vehicle.id}:`,
                        error
                    );
                }
            }

            // Insert billing info
            const { error: billingError } = await supabase
                .from("billing_info")
                .insert({
                    subscription_id: subscription.id,
                    amount: subscription.billingInfo.amount,
                    currency: subscription.billingInfo.currency,
                    frequency: subscription.billingInfo.frequency,
                    next_billing_date: subscription.billingInfo.nextBillingDate,
                    last_billing_date: subscription.billingInfo.lastBillingDate,
                    payment_method_id:
                        subscription.billingInfo.paymentMethod.id,
                });

            if (billingError) {
                console.error(
                    `Error inserting billing info for ${subscription.id}:`,
                    billingError
                );
            }

            // Insert discount if exists
            if (subscription.billingInfo.discount) {
                const { error } = await supabase
                    .from("billing_discounts")
                    .insert({
                        subscription_id: subscription.id,
                        percentage:
                            subscription.billingInfo.discount.percentage,
                        amount: subscription.billingInfo.discount.amount,
                        reason: subscription.billingInfo.discount.reason,
                        valid_until:
                            subscription.billingInfo.discount.validUntil,
                    });

                if (error) {
                    console.error(
                        `Error inserting discount for ${subscription.id}:`,
                        error
                    );
                }
            }
        }

        console.log("Migration completed!");
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

// Run the migration
migrateData();
