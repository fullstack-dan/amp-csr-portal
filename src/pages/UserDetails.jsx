import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { supabaseAPI as API } from "../api/supabaseAPI";
import VehicleSubscriptionsList from "../components/VehicleSubscriptionsList";
import AddNewSubscriptionModal from "../components/AddNewSubscriptionModal";
import {
    Mail,
    Phone,
    User,
    MapPin,
    Save,
    X,
    Edit2,
    FileText,
    Activity,
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
    InfoRowWithIcon,
    EditModeBanner,
    DetailsList,
    DetailsListItem,
    StatusBadge,
    EmptyState,
} from "../components/DetailsViewLayout";
import { formatPhoneNumber } from "../utils/formatting";

function UserInfoDisplay({ customer }) {
    return (
        <>
            <h2 className="text-2xl font-bold">
                {customer.firstName} {customer.lastName}
            </h2>
            <p>
                Member since{" "}
                {new Date(customer.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </p>
            <p className="text-sm text-gray-500">Customer ID: {customer?.id}</p>
        </>
    );
}

function UserInfoEdit({ formData, onChange }) {
    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">First name</label>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        className="input input-bordered flex-1"
                        value={formData.firstName}
                        onChange={onChange}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Last name</label>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        className="input input-bordered flex-1"
                        value={formData.lastName}
                        onChange={onChange}
                    />
                </div>
            </div>
        </div>
    );
}

/**
 * Detailed view component for user information. This LOOKS big but
 * it's because I was adamant on using the ternary operator for
 * conditional rendering when editing customer information.
 *
 * If I have enough time I might refactor, but it does now use the details view
 * layout
 */
export default function UserDetails() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [info, setInfo] = useState("");
    const [infoColor, setInfoColor] = useState("bg-blue-500");
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (!id) {
            setCustomer(null);
            setLoading(false);
            return;
        }
        fetchCustomer(id);
    }, [id]);

    const fetchCustomer = async (customerId) => {
        setLoading(true);
        try {
            const data = await API.getCustomerWithSubscriptions(customerId);
            const customerData = data.customer;
            setCustomer(customerData);
            setSubscriptions(data.subscriptions || []);

            const customerOpenRequests = await API.getRequestsByCustomerId(
                customerId
            );
            setRequests(customerOpenRequests || []);

            setFormData({
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                email: customerData.email,
                phone: customerData.phone,
                street: customerData.address.street,
                city: customerData.address.city,
                state: customerData.address.state,
                zipCode: customerData.address.zipCode,
            });
        } catch (error) {
            console.error("Failed to fetch customer details:", error);
            setCustomer(null);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            if (!validateFormData()) {
                setInfo("Please fill in all fields correctly.");
                setInfoColor("bg-red-500");
                setTimeout(() => {
                    setInfo("Editing customer information");
                    setInfoColor("bg-blue-500");
                }, 3000);
                return;
            }

            const updatedCustomer = await API.updateCustomerDetails(
                customer.id,
                {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    profile_picture: formData.profilePicture,
                },
                {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zip_code: formData.zipCode,
                }
            );

            if (!updatedCustomer) {
                setInfo("Failed to save changes. Please try again.");
                setInfoColor("bg-red-500");
                setTimeout(() => {
                    setInfo("Editing customer information");
                    setInfoColor("bg-blue-500");
                }, 3000);
                return;
            }

            const updatedCustomerObj = {
                ...updatedCustomer,
                firstName: updatedCustomer.first_name,
                lastName: updatedCustomer.last_name,
                profilePicture: updatedCustomer.profile_picture,
                createdAt: updatedCustomer.created_at,
                address: {
                    street: updatedCustomer.address.street,
                    city: updatedCustomer.address.city,
                    state: updatedCustomer.address.state,
                    zipCode: updatedCustomer.address.zip_code,
                },
            };

            setCustomer(updatedCustomerObj);
            setInfo("Changes saved successfully.");
            setInfoColor("bg-green-500");
            setEditing(false);
            setHasChanges(false);
        } catch (error) {
            console.error("Failed to save changes:", error);
        }
    };

    const handleAddSubscription = (newSubscription) => {
        if (!newSubscription) {
            return;
        }
        setSubscriptions((prev) => [...prev, newSubscription]);
        setInfo("New subscription added successfully.");
        setInfoColor("bg-green-500");
        setTimeout(() => {
            setInfo("Editing customer information");
            setInfoColor("bg-blue-500");
        }, 3000);
    };

    const validateFormData = () => {
        const {
            firstName,
            lastName,
            email,
            phone,
            street,
            city,
            state,
            zipCode,
        } = formData;
        return (
            firstName.trim() &&
            lastName.trim() &&
            email.trim() &&
            phone.trim() &&
            street.trim() &&
            city.trim() &&
            state.trim() &&
            zipCode.trim() &&
            /^[a-zA-Z\s]+$/.test(firstName) &&
            /^[a-zA-Z\s]+$/.test(lastName) &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
            /^\d{10}$/.test(phone.replace(/\D/g, "")) &&
            /^[a-zA-Z0-9\s,.'-]{3,}$/.test(street) &&
            /^[a-zA-Z\s]+$/.test(city) &&
            /^[A-Z]{2}$/.test(state) &&
            /^\d{5}(-\d{4})?$/.test(zipCode)
        );
    };

    const handleCancel = () => {
        setFormData({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            street: customer.address.street,
            city: customer.address.city,
            state: customer.address.state,
            zipCode: customer.address.zipCode,
        });
        setEditing(false);
        setHasChanges(false);
    };

    const tabs = [
        { id: "overview", label: "Overview" },
        {
            id: "subscriptions",
            label: "Subscriptions",
            count: subscriptions.length,
        },
        { id: "requests", label: "Requests", count: requests.length },
    ];

    return (
        <DetailsViewLayout
            loading={loading}
            notFound={!customer}
            notFoundMessage="Customer not found"
            backLink="/users"
        >
            {editing && (
                <EditModeBanner message={info} icon={Edit2} color={infoColor} />
            )}

            <DetailsHeader>
                <HeaderContent
                    actions={
                        <>
                            {!editing && (
                                <>
                                    <a
                                        href={`mailto:${customer?.email}`}
                                        className="btn btn-outline btn-sm"
                                        title="Send email"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </a>
                                    <a
                                        href={`tel:${customer?.phone}`}
                                        className="btn btn-outline btn-sm"
                                        title="Call customer"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Call
                                    </a>
                                </>
                            )}
                            {editing ? (
                                <>
                                    <button
                                        className="btn btn-primary btn-sm flex items-center gap-2"
                                        onClick={handleSave}
                                        disabled={!hasChanges}
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                    <button
                                        className="btn btn-outline btn-sm flex items-center gap-2"
                                        onClick={handleCancel}
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="btn btn-primary btn-sm flex items-center gap-2"
                                    onClick={() => {
                                        setInfo("Editing customer information");
                                        setInfoColor("bg-blue-500");
                                        setEditing(true);
                                    }}
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            )}
                        </>
                    }
                >
                    <div className="flex items-center gap-4">
                        {customer?.profilePicture ? (
                            <img
                                src={customer.profilePicture}
                                alt="Profile"
                                className="w-20 h-20 rounded-full"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-10 h-10 text-gray-500" />
                            </div>
                        )}
                        <div>
                            {editing ? (
                                <UserInfoEdit
                                    formData={formData}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <UserInfoDisplay customer={customer} />
                            )}
                        </div>
                    </div>
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
                        {/* Contact information */}
                        <DetailsCard title="Contact Information" icon={User}>
                            {editing ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full mt-1"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full mt-1"
                                            placeholder="Email address"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <InfoRowWithIcon
                                        icon={Phone}
                                        label="Phone"
                                        value={formatPhoneNumber(
                                            customer?.phone
                                        )}
                                    />
                                    <InfoRowWithIcon
                                        icon={Mail}
                                        label="Email"
                                        value={customer?.email}
                                    />
                                </div>
                            )}
                        </DetailsCard>

                        {/* Address */}
                        <DetailsCard title="Address" icon={MapPin}>
                            {editing ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full"
                                        placeholder="Street address"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="input input-bordered"
                                            placeholder="City"
                                        />
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="input input-bordered"
                                            placeholder="State"
                                            maxLength="2"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full"
                                        placeholder="ZIP code"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <p>{customer?.address.street}</p>
                                    <p>
                                        {customer?.address.city},{" "}
                                        {customer?.address.state}
                                    </p>
                                    <p>{customer?.address.zipCode}</p>
                                </div>
                            )}
                        </DetailsCard>

                        {/* Account status */}
                        <DetailsCard title="Account Status" icon={Activity}>
                            <div className="space-y-3">
                                <InfoRow
                                    label="Member Since"
                                    value={new Date(
                                        customer?.createdAt
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Status
                                    </p>
                                    <StatusBadge status="active" />
                                </div>
                                <InfoRow label="Role" value={customer?.role} />
                            </div>
                        </DetailsCard>
                    </DetailsGrid>
                )}

                {activeTab === "subscriptions" && (
                    <DetailsCard title="Vehicle Subscriptions">
                        <VehicleSubscriptionsList
                            subscriptions={subscriptions}
                        />
                        <AddNewSubscriptionModal
                            customerId={customer?.id}
                            onClose={handleAddSubscription}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                document
                                    .getElementById("addnewsub_modal")
                                    ?.showModal();
                            }}
                        >
                            Add New Subscription
                        </button>
                    </DetailsCard>
                )}

                {activeTab === "requests" && (
                    <DetailsCard title="Customer Requests">
                        {requests.length > 0 ? (
                            <DetailsList>
                                {requests.map((request) => (
                                    <DetailsListItem key={request.id}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold">
                                                        {request.requestType}
                                                    </h4>
                                                    <StatusBadge
                                                        status={request.status}
                                                    />
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    "{request.details}"
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Last Updated:{" "}
                                                    {new Date(
                                                        request.updatedAt
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <Link
                                                to={`/requests/${request.id}`}
                                            >
                                                <button className="btn btn-sm">
                                                    View
                                                </button>
                                            </Link>
                                        </div>
                                    </DetailsListItem>
                                ))}
                            </DetailsList>
                        ) : (
                            <EmptyState
                                icon={FileText}
                                message="No requests found"
                            />
                        )}
                    </DetailsCard>
                )}
            </DetailsContent>
        </DetailsViewLayout>
    );
}
