import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { supabaseAPI as API } from "../api/supabaseAPI";
import {
    Mail,
    Phone,
    Eye,
    MapPin,
    Car,
    Calendar,
    CreditCard,
    Building2,
    CheckCircle,
    XCircle,
    DollarSign,
    Tag,
    Globe,
    User,
    Clock,
    AlertCircle,
} from "lucide-react";

export default function SubscriptionDetails() {
    const { subscriptionId } = useParams();
    const [subscription, setSubscription] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (!subscriptionId) {
            console.error("No subscription ID provided");
            return;
        }
        setLoading(true);
        fetchSubscription();
    }, [subscriptionId]);

    const fetchSubscription = async () => {
        try {
            const data = await API.getSubscriptionById(subscriptionId);
            setSubscription(data);

            if (data?.customerId) {
                const customerData = await API.getCustomerById(data.customerId);
                setCustomer(customerData);
            }
        } catch (error) {
            console.error("Error fetching subscription:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "paused":
                return "badge-warning";
            case "cancelled":
                return "badge-error";
            case "active":
                return "badge-success";
            case "expired":
                return "badge-ghost";
            default:
                return "badge-ghost";
        }
    };

    const getPaymentMethodDisplay = (paymentMethod) => {
        const { type, details } = paymentMethod;
        switch (type) {
            case "card":
                return `${details.cardBrand} •••• ${details.cardLast4}`;
            case "bank_transfer":
                return `Bank Account •••• ${details.bankAccountLast4}`;
            case "paypal":
                return `PayPal (${details.paypalEmail})`;
            default:
                return type;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (!subscription) {
        //TODO: copy this to other pages
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Subscription not found</p>
                <Link to="/users" className="btn btn-primary mt-4">
                    Back to Users
                </Link>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto ">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-xs">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                {subscription.planType} Plan
                                <span
                                    className={`badge badge-sm ${getStatusColor(
                                        subscription.status
                                    )}`}
                                >
                                    {subscription.status}
                                </span>
                            </h2>
                            <p className="text-sm text-gray-500">
                                Subscription ID: {subscription.id}
                            </p>
                            {customer && (
                                <Link
                                    to={`/users/${customer.id}`}
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                                >
                                    <User className="w-3 h-3" />
                                    {customer.firstName} {customer.lastName}
                                </Link>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button className="btn btn-outline">
                                Edit Subscription
                            </button>
                            <button className="btn btn-primary">
                                Manage Billing
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="tabs tabs-boxed">
                        <button
                            className={`tab ${
                                activeTab === "overview" ? "tab-active" : ""
                            }`}
                            onClick={() => setActiveTab("overview")}
                        >
                            Overview
                        </button>
                        <button
                            className={`tab ${
                                activeTab === "vehicles" ? "tab-active" : ""
                            }`}
                            onClick={() => setActiveTab("vehicles")}
                        >
                            Vehicles ({subscription.vehicles.length})
                        </button>
                        <button
                            className={`tab ${
                                activeTab === "locations" ? "tab-active" : ""
                            }`}
                            onClick={() => setActiveTab("locations")}
                        >
                            Locations ({subscription.locations.length})
                        </button>
                        <button
                            className={`tab ${
                                activeTab === "billing" ? "tab-active" : ""
                            }`}
                            onClick={() => setActiveTab("billing")}
                        >
                            Billing
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Plan Details */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                Plan Details
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Plan Type
                                    </p>
                                    <p className="font-medium">
                                        {subscription.planType}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Max Vehicles
                                    </p>
                                    <p className="font-medium">
                                        {subscription.vehicles.length} /{" "}
                                        {subscription.planFeatures.maxVehicles}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Monthly Washes
                                    </p>
                                    <p className="font-medium">
                                        {
                                            subscription.planFeatures
                                                .maxWashesPerMonth
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Detailing Included
                                    </p>
                                    <p className="font-medium flex items-center gap-1">
                                        {subscription.planFeatures
                                            .detailingIncluded ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                Yes
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4 text-red-500" />
                                                No
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Subscription Timeline */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Timeline
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Start Date
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            subscription.startDate
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Created
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            subscription.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Last Updated
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            subscription.updatedAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                {subscription.status === "paused" &&
                                    subscription.pausedAt && (
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Paused Since
                                            </p>
                                            <p className="font-medium text-warning">
                                                {new Date(
                                                    subscription.pausedAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                {subscription.status === "cancelled" &&
                                    subscription.cancelledAt && (
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Cancelled On
                                            </p>
                                            <p className="font-medium text-error">
                                                {new Date(
                                                    subscription.cancelledAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Quick Stats
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Monthly Cost
                                    </p>
                                    <p className="font-medium text-2xl">
                                        {formatCurrency(
                                            subscription.billingInfo.amount
                                        )}
                                    </p>
                                    {subscription.billingInfo.discount && (
                                        <p className="text-sm text-green-600">
                                            Save{" "}
                                            {formatCurrency(
                                                subscription.billingInfo
                                                    .discount.amount
                                            )}
                                            /month
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Active Vehicles
                                    </p>
                                    <p className="font-medium">
                                        {subscription.vehicles.length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Available Locations
                                    </p>
                                    <p className="font-medium">
                                        {subscription.locations.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "vehicles" && (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Car className="w-5 h-5" />
                                Registered Vehicles
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {subscription.vehicles.map((vehicle) => (
                                    <div
                                        key={vehicle.id}
                                        className="border rounded-lg p-4"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold">
                                                    {vehicle.year}{" "}
                                                    {vehicle.make}{" "}
                                                    {vehicle.model}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {vehicle.color}
                                                </p>
                                            </div>
                                            <button className="btn btn-ghost btn-sm">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <p>
                                                <span className="text-gray-600">
                                                    License:
                                                </span>{" "}
                                                {vehicle.licensePlate}
                                            </p>
                                            <p>
                                                <span className="text-gray-600">
                                                    VIN:
                                                </span>{" "}
                                                {vehicle.vin}
                                            </p>
                                            <p>
                                                <span className="text-gray-600">
                                                    Added:
                                                </span>{" "}
                                                {new Date(
                                                    vehicle.addedAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {subscription.vehicles.length <
                                    subscription.planFeatures.maxVehicles && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                                        <button className="btn btn-outline btn-sm">
                                            Add Vehicle
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "locations" && (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Available Locations
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {subscription.locations.map((location) => (
                                    <div
                                        key={location.id}
                                        className="border rounded-lg p-4"
                                    >
                                        <h4 className="font-semibold mb-2">
                                            {location.name}
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p>{location.address}</p>
                                                    <p>
                                                        {location.city},{" "}
                                                        {location.state}{" "}
                                                        {location.zip}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <p>{location.phone}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <p>{location.email}</p>
                                            </div>
                                            {location.website && (
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-gray-400" />
                                                    <a
                                                        href={`https://${location.website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {location.website}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "billing" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Billing Overview */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Billing Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Billing Frequency
                                    </p>
                                    <p className="font-medium capitalize">
                                        {subscription.billingInfo.frequency}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Amount
                                    </p>
                                    <p className="font-medium text-xl">
                                        {formatCurrency(
                                            subscription.billingInfo.amount
                                        )}
                                        <span className="text-sm text-gray-600">
                                            /
                                            {subscription.billingInfo.frequency}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Payment Method
                                    </p>
                                    <p className="font-medium">
                                        {getPaymentMethodDisplay(
                                            subscription.billingInfo
                                                .paymentMethod
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Next Billing Date
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            subscription.billingInfo.nextBillingDate
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Last Billed
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            subscription.billingInfo.lastBillingDate
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Discount Information */}
                        {subscription.billingInfo.discount && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Tag className="w-5 h-5" />
                                    Active Discount
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Discount
                                        </p>
                                        <p className="font-medium text-green-600">
                                            {subscription.billingInfo.discount
                                                .percentage
                                                ? `${subscription.billingInfo.discount.percentage}% off`
                                                : formatCurrency(
                                                      subscription.billingInfo
                                                          .discount.amount
                                                  ) + " off"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Reason
                                        </p>
                                        <p className="font-medium">
                                            {
                                                subscription.billingInfo
                                                    .discount.reason
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Valid Until
                                        </p>
                                        <p className="font-medium">
                                            {new Date(
                                                subscription.billingInfo.discount.validUntil
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-sm text-gray-600">
                                            You're saving
                                        </p>
                                        <p className="font-semibold text-green-600 text-xl">
                                            {formatCurrency(
                                                subscription.billingInfo
                                                    .discount.amount * 12
                                            )}
                                            /year
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
