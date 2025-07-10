import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { supabaseAPI as API } from "../api/supabaseAPI";
import VehicleSubscriptionsList from "../components/VehicleSubscriptionsList";
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

function UserInfoDisplay({ customer }) {
    return (
        <>
            <h2 className="text-2xl font-bold">
                {customer.firstName} {customer.lastName}
            </h2>
            <p className="text-gray-600">{customer.email}</p>
        </>
    );
}

function UserInfoEdit({ formData, onChange }) {
    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    className="input input-bordered flex-1"
                    value={formData.firstName}
                    onChange={onChange}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    className="input input-bordered flex-1"
                    value={formData.lastName}
                    onChange={onChange}
                />
            </div>
            <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={onChange}
            />
        </div>
    );
}

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

    const formatPhone = (phone) => {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    };

    const getRequestStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "badge-warning";
            case "completed":
                return "badge-success";
            case "rejected":
                return "badge-error";
            default:
                return "badge-ghost";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <User className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Customer not found</p>
                <Link to="/users" className="btn btn-primary mt-4">
                    Back to Users
                </Link>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto ">
            {/* Edit Mode Banner */}
            {editing && (
                <div
                    className={`${infoColor} text-white text-center py-2 flex items-center justify-center gap-2`}
                >
                    <Edit2 className="w-4 h-4" />
                    <span>{info}</span>
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-xs">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            {customer.profilePicture ? (
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
                                <p className="text-sm text-gray-500 mt-1">
                                    Customer ID: {customer.id}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {!editing && (
                                <>
                                    <a
                                        href={`mailto:${customer.email}`}
                                        className="btn btn-outline btn-sm"
                                        title="Send email"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </a>
                                    <a
                                        href={`tel:${customer.phone}`}
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
                                activeTab === "subscriptions"
                                    ? "tab-active"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("subscriptions")}
                        >
                            Subscriptions ({subscriptions.length})
                        </button>
                        <button
                            className={`tab ${
                                activeTab === "requests" ? "tab-active" : ""
                            }`}
                            onClick={() => setActiveTab("requests")}
                        >
                            Requests ({requests.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Contact Information
                            </h3>
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
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Phone
                                            </p>
                                            <p className="font-medium">
                                                {formatPhone(customer.phone)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Email
                                            </p>
                                            <p className="font-medium">
                                                {customer.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Address
                            </h3>
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
                                    <p>{customer.address.street}</p>
                                    <p>
                                        {customer.address.city},{" "}
                                        {customer.address.state}
                                    </p>
                                    <p>{customer.address.zipCode}</p>
                                </div>
                            )}
                        </div>

                        {/* Account Status */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Account Status
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Member Since
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            customer.createdAt
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Status
                                    </p>
                                    <span className="badge badge-success">
                                        Active
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Role
                                    </p>
                                    <p className="font-medium capitalize">
                                        {customer.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "subscriptions" && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-semibold text-lg mb-4">
                            Vehicle Subscriptions
                        </h3>
                        <VehicleSubscriptionsList
                            subscriptions={subscriptions}
                        />
                    </div>
                )}

                {activeTab === "requests" && (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6">
                            <h3 className="font-semibold text-lg mb-4">
                                Customer Requests
                            </h3>
                            {requests.length > 0 ? (
                                <div className="space-y-4">
                                    {requests.map((request) => (
                                        <div
                                            key={request.id}
                                            className="border rounded-lg p-4 hover: transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold">
                                                            {
                                                                request.requestType
                                                            }
                                                        </h4>
                                                        <span
                                                            className={`badge badge-sm ${getRequestStatusColor(
                                                                request.status
                                                            )}`}
                                                        >
                                                            {request.status}
                                                        </span>
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
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500">
                                        No requests found
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
