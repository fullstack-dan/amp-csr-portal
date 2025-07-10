import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { supabaseAPI as API } from "../api/supabaseAPI";
import AddVehicleToSubCard from "../components/AddVehicleToSubCard";
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
} from "lucide-react";
import {
    DetailsViewLayout,
    DetailsHeader,
    HeaderContent,
    DetailsTabs,
    DetailsContent,
    DetailsGrid,
    DetailsCard,
    InfoRow,
} from "../components/DetailsViewLayout";

/**
 * Detailed view component for subscription information,
 * uses the details view layout
 */
export default function SubscriptionDetails() {
    const { subscriptionId } = useParams();
    const [subscription, setSubscription] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [addingVehicle, setAddingVehicle] = useState(false);

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

    const addVehicleToSubscription = async (vehicleData) => {
        try {
            const updatedSubscription = await API.addVehicleToSubscription(
                subscriptionId,
                vehicleData
            );
            setSubscription(updatedSubscription);
            setAddingVehicle(false);
        } catch (error) {
            console.error("Error adding vehicle:", error); //TODO: add error handling
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

    const tabs = [
        { id: "overview", label: "Overview" },
        {
            id: "vehicles",
            label: "Vehicles",
            count: subscription?.vehicles.length,
        },
        {
            id: "locations",
            label: "Locations",
            count: subscription?.locations.length,
        },
        { id: "billing", label: "Billing" },
    ];

    return (
        <DetailsViewLayout
            loading={loading}
            notFound={!subscription}
            notFoundMessage="Subscription not found"
            backLink="/users"
        >
            <DetailsHeader>
                <HeaderContent
                    title={`${subscription?.planType} Plan`}
                    subtitle={`Subscription ID: ${subscription?.id}`}
                    badge={subscription?.status}
                    badgeColor={`badge-${
                        subscription?.status === "active"
                            ? "success"
                            : subscription?.status === "paused"
                            ? "warning"
                            : "error"
                    }`}
                    actions={
                        <>
                            <button className="btn btn-outline">
                                Edit Subscription
                            </button>
                            <button className="btn btn-primary">
                                Manage Billing
                            </button>
                        </>
                    }
                >
                    {customer && (
                        <Link
                            to={`/users/${customer.id}`}
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                            <User className="w-3 h-3" />
                            {customer.firstName} {customer.lastName}
                        </Link>
                    )}
                </HeaderContent>
                <DetailsTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </DetailsHeader>

            <DetailsContent>
                {activeTab === "overview" && (
                    <DetailsGrid cols={3}>
                        {/* Plan details */}
                        <DetailsCard title="Plan Details" icon={Tag}>
                            <div className="space-y-3">
                                <InfoRow
                                    label="Plan Type"
                                    value={subscription?.planType}
                                />
                                <InfoRow
                                    label="Max Vehicles"
                                    value={`${subscription?.vehicles.length} / ${subscription?.planFeatures.maxVehicles}`}
                                />
                                <InfoRow
                                    label="Monthly Washes"
                                    value={
                                        subscription?.planFeatures
                                            .maxWashesPerMonth
                                    }
                                />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Detailing Included
                                    </p>
                                    <p className="font-medium flex items-center gap-1">
                                        {subscription?.planFeatures
                                            .detailingIncluded ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                                                Yes
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4 text-red-500" />{" "}
                                                No
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </DetailsCard>

                        {/* Timeline */}
                        <DetailsCard title="Timeline" icon={Calendar}>
                            <div className="space-y-3">
                                <InfoRow
                                    label="Start Date"
                                    value={new Date(
                                        subscription?.startDate
                                    ).toLocaleDateString()}
                                />
                                <InfoRow
                                    label="Created"
                                    value={new Date(
                                        subscription?.createdAt
                                    ).toLocaleDateString()}
                                />
                                <InfoRow
                                    label="Last Updated"
                                    value={new Date(
                                        subscription?.updatedAt
                                    ).toLocaleDateString()}
                                />
                                {subscription?.status === "paused" &&
                                    subscription?.pausedAt && (
                                        <InfoRow
                                            label="Paused Since"
                                            value={new Date(
                                                subscription.pausedAt
                                            ).toLocaleDateString()}
                                        />
                                    )}
                                {subscription?.status === "cancelled" &&
                                    subscription?.cancelledAt && (
                                        <InfoRow
                                            label="Cancelled On"
                                            value={new Date(
                                                subscription.cancelledAt
                                            ).toLocaleDateString()}
                                        />
                                    )}
                            </div>
                        </DetailsCard>

                        {/* Quick stats */}
                        <DetailsCard title="Quick Stats" icon={DollarSign}>
                            <div className="space-y-3">
                                <div>
                                    <InfoRow
                                        label="Monthly Cost"
                                        value={formatCurrency(
                                            subscription?.billingInfo.amount
                                        )}
                                    />
                                    {subscription?.billingInfo.discount && (
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
                                <InfoRow
                                    label="Active Vehicles"
                                    value={subscription?.vehicles.length}
                                />
                                <InfoRow
                                    label="Available Locations"
                                    value={subscription?.locations.length}
                                />
                            </div>
                        </DetailsCard>
                    </DetailsGrid>
                )}

                {activeTab === "vehicles" && (
                    <DetailsCard title="Registered Vehicles" icon={Car}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subscription?.vehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="border rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold">
                                                {vehicle.year} {vehicle.make}{" "}
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
                            {subscription?.vehicles.length <
                                subscription?.planFeatures.maxVehicles && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full flex items-center justify-center">
                                    {addingVehicle ? (
                                        <AddVehicleToSubCard
                                            cancelForm={() =>
                                                setAddingVehicle(false)
                                            }
                                            onSubmit={addVehicleToSubscription}
                                        />
                                    ) : (
                                        <button
                                            className="btn btn-outline"
                                            onClick={() =>
                                                setAddingVehicle(true)
                                            }
                                        >
                                            Add Vehicle
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </DetailsCard>
                )}

                {activeTab === "locations" && (
                    <DetailsCard title="Available Locations" icon={Building2}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {subscription?.locations.map((location) => (
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
                    </DetailsCard>
                )}

                {activeTab === "billing" && (
                    <DetailsGrid cols={2}>
                        {/* Billing information */}
                        <DetailsCard
                            title="Billing Information"
                            icon={CreditCard}
                        >
                            <div className="space-y-3">
                                <InfoRow
                                    label="Billing Frequency"
                                    value={subscription?.billingInfo.frequency}
                                />
                                <InfoRow
                                    label="Amount"
                                    value={`${formatCurrency(
                                        subscription?.billingInfo.amount
                                    )} (${
                                        subscription?.billingInfo.frequency
                                    })`}
                                />

                                <InfoRow
                                    label="Payment Method"
                                    value={getPaymentMethodDisplay(
                                        subscription?.billingInfo.paymentMethod
                                    )}
                                />
                                <InfoRow
                                    label="Next Billing Date"
                                    value={new Date(
                                        subscription?.billingInfo.nextBillingDate
                                    ).toLocaleDateString()}
                                />
                                <InfoRow
                                    label="Last Billed"
                                    value={new Date(
                                        subscription?.billingInfo.lastBillingDate
                                    ).toLocaleDateString()}
                                />
                            </div>
                        </DetailsCard>

                        {/* Discount information */}
                        {subscription?.billingInfo.discount && (
                            <DetailsCard title="Active Discount" icon={Tag}>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-medium text-gray-600">
                                            Discount
                                        </p>
                                        <p className=" text-green-600">
                                            {subscription.billingInfo.discount
                                                .percentage
                                                ? `${subscription.billingInfo.discount.percentage}% off`
                                                : formatCurrency(
                                                      subscription.billingInfo
                                                          .discount.amount
                                                  ) + " off"}
                                        </p>
                                    </div>
                                    <InfoRow
                                        label="Reason"
                                        value={
                                            subscription.billingInfo.discount
                                                .reason
                                        }
                                    />
                                    <InfoRow
                                        label="Valid Until"
                                        value={new Date(
                                            subscription.billingInfo.discount.validUntil
                                        ).toLocaleDateString()}
                                    />
                                    <div className="pt-2">
                                        <p className="font-medium text-gray-600">
                                            You're saving
                                        </p>
                                        <p className=" text-green-600 text-xl">
                                            {formatCurrency(
                                                subscription.billingInfo
                                                    .discount.amount * 12
                                            )}
                                            /year
                                        </p>
                                    </div>
                                </div>
                            </DetailsCard>
                        )}
                    </DetailsGrid>
                )}
            </DetailsContent>
        </DetailsViewLayout>
    );
}
