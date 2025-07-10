import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { supabaseAPI as API } from "../api/supabaseAPI";
import VehicleSubscriptionsList from "../components/VehicleSubscriptionsList";
import {
    Mail,
    Phone,
    User,
    MapPin,
    Calendar,
    Save,
    X,
    Edit2,
} from "lucide-react";

function UserInfoDisplay({ customer }) {
    return (
        <>
            <h2 className="text-xl font-bold">
                {customer.firstName} {customer.lastName}
            </h2>
            <p className="">{customer.email}</p>
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
                    className="input input-bordered input-sm flex-1"
                    value={formData.firstName}
                    onChange={onChange}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    className="input input-bordered input-sm flex-1"
                    value={formData.lastName}
                    onChange={onChange}
                />
            </div>
            <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered input-sm w-full"
                value={formData.email}
                onChange={onChange}
            />
        </div>
    );
}

// Field component that switches between display and edit
function EditableField({
    label,
    value,
    name,
    type = "text",
    editing,
    formData,
    onChange,
    icon: Icon,
}) {
    return (
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="w-4 h-4 " />}
                <span className="font-semibold ">{label}</span>
            </div>
            {editing ? (
                <input
                    type={type}
                    name={name}
                    value={formData[name] || ""}
                    onChange={onChange}
                    className="input input-bordered w-full"
                    placeholder={`Enter ${label.toLowerCase()}`}
                />
            ) : (
                <p className=" pl-6">{value || "Not provided"}</p>
            )}
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

            console.log(formData);

            const updatedCustomer = await API.updateCustomerDetails(
                customer.id,
                {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    profilePicture: formData.profilePicture,
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <User className="w-12 h-12 mx-auto mb-2" />
                    <p className="">No customer selected</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {editing && (
                <div
                    className={` ${infoColor} text-white text-center py-2 flex items-center justify-center gap-2`}
                >
                    <Edit2 className="w-4 h-4" />
                    <span>{info}</span>
                </div>
            )}

            <div className="border-b border-gray-200">
                <div className="flex justify-between items-center p-6">
                    <div className="flex items-center gap-4">
                        {customer.profilePicture ? (
                            <img
                                src={customer.profilePicture}
                                alt="Profile"
                                className="w-16 h-16 rounded-full"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-8 h-8 " />
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

                    {!editing && (
                        <div className="flex items-center gap-4">
                            <a
                                href={`mailto:${customer.email}`}
                                className="p-2 hover:bg-base-300 rounded-lg transition-colors"
                                title="Send email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                            <a
                                href={`tel:${customer.phone}`}
                                className="p-2 hover:bg-base-300 rounded-lg transition-colors"
                                title="Call customer"
                            >
                                <Phone className="w-5 h-5" />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex h-full *:h-full overflow-hidden">
                {/* Customer details section */}
                <div className="flex-1 overflow-y-auto py-6">
                    <div className="max-w-2xl px-4">
                        <h3 className="font-bold text-xl mb-4">
                            Customer Information
                        </h3>
                        <div className="space-y-1">
                            <EditableField
                                label="Phone"
                                value={formatPhone(customer.phone)}
                                name="phone"
                                type="tel"
                                editing={editing}
                                formData={formData}
                                onChange={handleInputChange}
                                icon={Phone}
                            />
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="w-4 h-4 " />
                                    <span className="font-semibold ">
                                        Address
                                    </span>
                                </div>
                                {editing ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full"
                                            placeholder="Street address"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="input input-bordered flex-1"
                                                placeholder="City"
                                            />
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="input input-bordered w-24"
                                                placeholder="State"
                                                maxLength="2"
                                            />
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                className="input input-bordered w-32"
                                                placeholder="ZIP code"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className=" pl-6">
                                        <p>{customer.address.street}</p>
                                        <p>
                                            {customer.address.city},{" "}
                                            {customer.address.state}{" "}
                                            {customer.address.zipCode}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="w-4 h-4 " />
                                    <span className="font-semibold ">
                                        Member Since
                                    </span>
                                </div>
                                <p className=" pl-6">
                                    {new Date(
                                        customer.createdAt
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                        {/* Action buttons */}
                        <div className="flex gap-3 mt-8">
                            {editing ? (
                                <>
                                    <button
                                        className="btn btn-primary flex items-center gap-2"
                                        onClick={handleSave}
                                        disabled={!hasChanges}
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                    <button
                                        className="btn flex items-center gap-2"
                                        onClick={handleCancel}
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="btn btn-primary flex items-center gap-2"
                                        onClick={() => {
                                            setInfo(
                                                "Editing customer information"
                                            );
                                            setInfoColor("bg-blue-500");
                                            setEditing(true);
                                        }}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Details
                                    </button>
                                    <button className="btn">
                                        Reset Password
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Open requests section */}
                    <div className="flex-1 overflow-y-auto mt-6 border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 px-4">
                            Pending Requests
                        </h2>
                        <div>
                            {requests.filter(
                                (request) => request.status === "pending"
                            ).length > 0 ? (
                                <ul>
                                    {requests
                                        .filter(
                                            (request) =>
                                                request.status === "pending"
                                        )
                                        .map((request) => (
                                            <li
                                                key={request.id}
                                                className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0 hover:bg-base-300 transition duration-200 ease-in-out"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold">
                                                            {
                                                                request.requestType
                                                            }
                                                        </h4>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {request.customerEmail}
                                                    </p>
                                                    <p className="text-sm mt-1">
                                                        "{request.details}"
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-2 italic">
                                                        Last Updated:{" "}
                                                        {new Date(
                                                            request.updatedAt
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                                <Link
                                                    to={`/requests/${request.id}`}
                                                    className="ml-4"
                                                >
                                                    <button className="btn">
                                                        View
                                                    </button>
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p className="text-center text-gray-500">
                                    No pending requests.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {/* Vehicle subscriptions section */}
                <div className="flex-1 overflow-y-auto border-l border-gray-200">
                    <h2 className="text-xl font-semibold p-6">Subscriptions</h2>
                    <VehicleSubscriptionsList subscriptions={subscriptions} />
                </div>
            </div>
        </div>
    );
}
