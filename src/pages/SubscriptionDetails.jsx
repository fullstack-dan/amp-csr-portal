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
    Trash2,
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
import ModifySubscriptionModal from "../components/ModifySubscriptionModal";

const VehicleCard = ({ vehicle, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <>
            {isDeleting ? (
                <div className="border rounded-lg p-4">
                    <h2 className="text-lg text-center font-bold">
                        Deleting Vehicle
                    </h2>
                    <p className="text-sm text-center text-gray-600">
                        Are you sure you want to delete this {vehicle.year}{" "}
                        {vehicle.make} {vehicle.model}? This action cannot be
                        undone.
                    </p>
                    <div className="flex justify-center mt-4">
                        <button
                            className="btn bg-red-500 text-white px-4 py-2 rounded-md"
                            onClick={() => onDelete(vehicle.id)}
                        >
                            Delete
                        </button>
                        <button
                            className="btn bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2"
                            onClick={() => setIsDeleting(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-semibold">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {vehicle.color}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Eye className="w-4 h-4 hover:text-blue-500 cursor-pointer" />
                            <Trash2
                                className="w-4 h-4 hover:text-red-500 cursor-pointer"
                                onClick={() => setIsDeleting(true)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1 text-sm">
                        <p>
                            <span className="text-gray-600">License:</span>{" "}
                            {vehicle.licensePlate}
                        </p>
                        <p>
                            <span className="text-gray-600">VIN:</span>{" "}
                            {vehicle.vin}
                        </p>
                        <p>
                            <span className="text-gray-600">Added:</span>{" "}
                            {new Date(vehicle.addedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

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
    const [editing, setEditing] = useState(false);

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

            console.log(data);

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

    const onModalClose = async (modifiedSub = null) => {
        document.getElementById("modifysub_modal").close();
        setLoading(true);
        if (modifiedSub._targetInst !== null) {
            //weirdly, onClose in this modal is returning an actual object. Workaround.
            await API.updateSubscription(modifiedSub);
            const updatedSubscription = await API.getSubscriptionById(
                subscriptionId
            );
            setSubscription(updatedSubscription);
            if (updatedSubscription.customerId) {
                const customerData = await API.getCustomerById(
                    updatedSubscription.customerId
                );
                setCustomer(customerData);
            }
        }
        setLoading(false);
    };

    const handleModifySubscription = () => {
        document.getElementById("modifysub_modal").showModal();
    };

    const handleDelete = async (vehicleId) => {
        try {
            await API.removeVehicleFromSubscription(subscriptionId, vehicleId);
            const updatedSubscription = await API.getSubscriptionById(
                subscriptionId
            );
            setSubscription(updatedSubscription);
        } catch (error) {
            console.error("Error deleting vehicle:", error); //TODO: add error handling
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
            <ModifySubscriptionModal
                subscription={subscription}
                onClose={onModalClose}
            />
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
                                Transfer Subscription
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleModifySubscription}
                            >
                                Manage Subscription
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
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    onDelete={handleDelete}
                                />
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
