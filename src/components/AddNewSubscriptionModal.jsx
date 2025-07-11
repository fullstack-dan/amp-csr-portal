import { useState, useEffect } from "react";
import { supabaseAPI as API } from "../api/supabaseAPI";
import { AlertCircle, Check } from "lucide-react";

/**
 * Allows CSRs to add a new subscription for a given customer
 */
export default function AddNewSubscriptionModal({ customerId, onClose }) {
    // Plan details
    const [planType, setPlanType] = useState("Basic");
    const [maxVehicles, setMaxVehicles] = useState(1);
    const [maxWashes, setMaxWashes] = useState(4);
    const [detailingIncluded, setDetailingIncluded] = useState(false);

    // Billing details
    const [billingAmount, setBillingAmount] = useState(29.99);
    const [billingFrequency, setBillingFrequency] = useState("monthly");
    const [startDate, setStartDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    // Payment method
    const [paymentType, setPaymentType] = useState("card");
    const [cardBrand, setCardBrand] = useState("");
    const [cardLast4, setCardLast4] = useState("");
    const [paypalEmail, setPaypalEmail] = useState("");
    const [bankLast4, setBankLast4] = useState("");

    // Locations
    const [locations, setLocations] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);

    // Discount
    const [hasDiscount, setHasDiscount] = useState(false);
    const [discountType, setDiscountType] = useState("percentage");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [discountReason, setDiscountReason] = useState("");
    const [discountValidUntil, setDiscountValidUntil] = useState("");

    // State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loadingLocations, setLoadingLocations] = useState(true);

    // Preset plan configurations
    const planPresets = {
        Basic: {
            maxVehicles: 1,
            maxWashes: 4,
            detailing: false,
            amount: 29.99,
        },
        Standard: {
            maxVehicles: 2,
            maxWashes: 8,
            detailing: false,
            amount: 49.99,
        },
        Premium: {
            maxVehicles: 3,
            maxWashes: 12,
            detailing: true,
            amount: 89.99,
        },
        Enterprise: {
            maxVehicles: 5,
            maxWashes: 50,
            detailing: true,
            amount: 199.99,
        },
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        // Auto-update fields when plan type changes
        const preset = planPresets[planType];
        if (preset) {
            setMaxVehicles(preset.maxVehicles);
            setMaxWashes(preset.maxWashes);
            setDetailingIncluded(preset.detailing);
            setBillingAmount(preset.amount);
        }
    }, [planType]);

    const fetchLocations = async () => {
        try {
            const data = await API.getAllLocations();
            setLocations(data);
            // Default select first location for Basic plan
            if (data.length > 0) {
                setSelectedLocations([data[0].id]);
            }
        } catch (error) {
            console.error("Failed to fetch locations:", error);
        } finally {
            setLoadingLocations(false);
        }
    };

    const calculateNextBillingDate = () => {
        const start = new Date(startDate);
        switch (billingFrequency) {
            case "monthly":
                start.setMonth(start.getMonth() + 1);
                break;
            case "quarterly":
                start.setMonth(start.getMonth() + 3);
                break;
            case "semi_annual":
                start.setMonth(start.getMonth() + 6);
                break;
            case "annual":
                start.setFullYear(start.getFullYear() + 1);
                break;
        }
        return start.toISOString();
    };

    const validateForm = () => {
        if (!customerId) {
            setError("Customer ID is required");
            return false;
        }

        if (selectedLocations.length === 0) {
            setError("Please select at least one location");
            return false;
        }

        // Payment method validation
        if (
            paymentType === "card" &&
            (!cardBrand || !cardLast4 || cardLast4.length !== 4)
        ) {
            setError("Please enter valid card details");
            return false;
        }

        if (paymentType === "paypal" && !paypalEmail) {
            setError("Please enter PayPal email");
            return false;
        }

        if (
            paymentType === "bank_transfer" &&
            (!bankLast4 || bankLast4.length !== 4)
        ) {
            setError("Please enter valid bank account details");
            return false;
        }

        if (hasDiscount) {
            if (
                discountType === "percentage" &&
                (discountPercentage <= 0 || discountPercentage > 100)
            ) {
                setError("Discount percentage must be between 1 and 100");
                return false;
            }
            if (discountType === "amount" && discountAmount <= 0) {
                setError("Discount amount must be greater than 0");
                return false;
            }
            if (!discountReason) {
                setError("Please provide a reason for the discount");
                return false;
            }
        }

        setError("");
        return true;
    };

    const handleSave = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const subscriptionData = {
                customerId,
                planType,
                planFeatures: {
                    maxVehicles,
                    maxWashesPerMonth: maxWashes,
                    detailingIncluded,
                },
                status: "active",
                startDate,
                selectedLocationIds: selectedLocations,
                billingInfo: {
                    amount: billingAmount,
                    currency: "USD",
                    frequency: billingFrequency,
                    nextBillingDate: calculateNextBillingDate(),
                    paymentMethod: {
                        type: paymentType,
                        details: {
                            cardBrand:
                                paymentType === "card" ? cardBrand : null,
                            cardLast4:
                                paymentType === "card" ? cardLast4 : null,
                            paypalEmail:
                                paymentType === "paypal" ? paypalEmail : null,
                            bankAccountLast4:
                                paymentType === "bank_transfer"
                                    ? bankLast4
                                    : null,
                        },
                    },
                },
            };

            // Add discount if applicable
            if (hasDiscount) {
                subscriptionData.billingInfo.discount = {
                    percentage:
                        discountType === "percentage"
                            ? discountPercentage
                            : null,
                    amount: discountType === "amount" ? discountAmount : null,
                    reason: discountReason,
                    validUntil: discountValidUntil || null,
                };
            }

            const newSubscription = await API.createSubscription(
                subscriptionData
            );
            onClose(newSubscription);
            document.getElementById("addnewsub_modal")?.close();
        } catch (error) {
            console.error("Failed to create subscription:", error);
            setError(error.message || "Failed to create subscription");
        } finally {
            setLoading(false);
        }
    };

    const handleLocationToggle = (locationId) => {
        setSelectedLocations((prev) => {
            if (prev.includes(locationId)) {
                return prev.filter((id) => id !== locationId);
            }
            return [...prev, locationId];
        });
    };

    return (
        <dialog id="addnewsub_modal" className="modal ">
            <div className="bg-gray-200 modal-box w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h3 className="font-bold text-xl mb-4">Add New Subscription</h3>

                {error && (
                    <div className="alert alert-error mb-4">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Plan selection */}
                <div className="card bg-white p-4 mb-4 border border-gray-50 shadow-md">
                    <h4 className="font-semibold mb-3">Plan Details</h4>

                    <div className="form-control flex flex-col mb-4">
                        <label className="label">
                            <span className="label-text">Plan Type</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={planType}
                            onChange={(e) => setPlanType(e.target.value)}
                        >
                            <option value="Basic">Basic</option>
                            <option value="Standard">Standard</option>
                            <option value="Premium">Premium</option>
                            <option value="Enterprise">Enterprise</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="form-control flex flex-col">
                            <label className="label">
                                <span className="label-text">Max Vehicles</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="input input-bordered"
                                value={maxVehicles}
                                onChange={(e) =>
                                    setMaxVehicles(Number(e.target.value))
                                }
                            />
                        </div>

                        <div className="form-control flex flex-col">
                            <label className="label">
                                <span className="label-text">
                                    Max Washes/Month
                                </span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="input input-bordered"
                                value={maxWashes}
                                onChange={(e) =>
                                    setMaxWashes(Number(e.target.value))
                                }
                            />
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer flex flex-col">
                                <span className="label-text">
                                    Detailing Included
                                </span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={detailingIncluded}
                                    onChange={() =>
                                        setDetailingIncluded(!detailingIncluded)
                                    }
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Location selection */}
                <div className="card bg-white p-4 mb-4 border border-gray-50 shadow-md">
                    <h4 className="font-semibold mb-3">Available Locations</h4>
                    {loadingLocations ? (
                        <p>Loading locations...</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {locations.map((location) => (
                                <label
                                    key={location.id}
                                    className="label cursor-pointer"
                                >
                                    <span className="label-text">
                                        {location.name}
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary"
                                        checked={selectedLocations.includes(
                                            location.id
                                        )}
                                        onChange={() =>
                                            handleLocationToggle(location.id)
                                        }
                                    />
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Billing information */}
                <div className="card bg-white p-4 mb-4 border border-gray-50 shadow-md">
                    <h4 className="font-semibold mb-3">Billing Information</h4>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Start Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Billing Amount (USD)
                                </span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="input input-bordered"
                                value={billingAmount}
                                onChange={(e) =>
                                    setBillingAmount(Number(e.target.value))
                                }
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Billing Frequency
                                </span>
                            </label>
                            <select
                                className="select select-bordered"
                                value={billingFrequency}
                                onChange={(e) =>
                                    setBillingFrequency(e.target.value)
                                }
                            >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="semi_annual">Semi-Annual</option>
                                <option value="annual">Annual</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Payment method */}
                <div className="card bg-white p-4 mb-4 border border-gray-50 shadow-md">
                    <h4 className="font-semibold mb-3">Payment Method</h4>

                    <div className="form-control mb-4 flex flex-col">
                        <label className="label">
                            <span className="label-text">Payment Type</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                        >
                            <option value="card">Credit/Debit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank_transfer">Bank Transfer</option>
                        </select>
                    </div>

                    {paymentType === "card" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Card Brand
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={cardBrand}
                                    onChange={(e) =>
                                        setCardBrand(e.target.value)
                                    }
                                >
                                    <option value="">Select Brand</option>
                                    <option value="Visa">Visa</option>
                                    <option value="Mastercard">
                                        Mastercard
                                    </option>
                                    <option value="American Express">
                                        American Express
                                    </option>
                                    <option value="Discover">Discover</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Last 4 Digits
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    maxLength="4"
                                    pattern="\d{4}"
                                    className="input input-bordered"
                                    value={cardLast4}
                                    onChange={(e) =>
                                        setCardLast4(
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {paymentType === "paypal" && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">PayPal Email</span>
                            </label>
                            <input
                                type="email"
                                className="input input-bordered"
                                value={paypalEmail}
                                onChange={(e) => setPaypalEmail(e.target.value)}
                            />
                        </div>
                    )}

                    {paymentType === "bank_transfer" && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Last 4 Digits of Account
                                </span>
                            </label>
                            <input
                                type="text"
                                maxLength="4"
                                pattern="\d{4}"
                                className="input input-bordered"
                                value={bankLast4}
                                onChange={(e) =>
                                    setBankLast4(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Discount */}
                <div className="card bg-white p-4 mb-4 border border-gray-50 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Discount (Optional)</h4>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={hasDiscount}
                            onChange={() => setHasDiscount(!hasDiscount)}
                        />
                    </div>

                    {hasDiscount && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control flex flex-col">
                                <label className="label">
                                    <span className="label-text">
                                        Discount Type
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={discountType}
                                    onChange={(e) =>
                                        setDiscountType(e.target.value)
                                    }
                                >
                                    <option value="percentage">
                                        Percentage
                                    </option>
                                    <option value="amount">Fixed Amount</option>
                                </select>
                            </div>

                            {discountType === "percentage" ? (
                                <div className="form-control flex flex-col">
                                    <label className="label">
                                        <span className="label-text">
                                            Discount Percentage
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        className="input input-bordered"
                                        value={discountPercentage}
                                        onChange={(e) =>
                                            setDiscountPercentage(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </div>
                            ) : (
                                <div className="form-control flex flex-col">
                                    <label className="label">
                                        <span className="label-text">
                                            Discount Amount (USD)
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        className="input input-bordered"
                                        value={discountAmount}
                                        onChange={(e) =>
                                            setDiscountAmount(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </div>
                            )}

                            <div className="form-control flex flex-col">
                                <label className="label">
                                    <span className="label-text">
                                        Reason for Discount
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={discountReason}
                                    onChange={(e) =>
                                        setDiscountReason(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-control flex flex-col">
                                <label className="label">
                                    <span className="label-text">
                                        Valid Until (Optional)
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={discountValidUntil}
                                    onChange={(e) =>
                                        setDiscountValidUntil(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-action">
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Create Subscription
                            </>
                        )}
                    </button>
                    <button
                        className="btn"
                        onClick={() => {
                            onClose(null);
                            document.getElementById("addnewsub_modal")?.close();
                        }}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </dialog>
    );
}
