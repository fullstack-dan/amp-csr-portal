import { useState } from "react";

/**
 * Allows CSRS to modify subscription details
 */
export default function ModifySubscriptionModal({ subscription, onClose }) {
    const [planType, setPlanType] = useState(subscription.planType);
    const [maxVehicles, setMaxVehicles] = useState(
        subscription.planFeatures.maxVehicles
    );
    const [maxWashes, setMaxWashes] = useState(
        subscription.planFeatures.maxWashesPerMonth
    );
    const [detailingIncluded, setDetailingIncluded] = useState(
        subscription.planFeatures.detailingIncluded
    );
    const [status, setStatus] = useState(subscription.status);
    const [billingAmount, setBillingAmount] = useState(
        subscription.billingInfo.amount
    );

    const handleSave = (event) => {
        event.preventDefault();

        const updated = {
            ...subscription,
            planType,
            planFeatures: {
                ...subscription.planFeatures,
                maxVehicles,
                maxWashesPerMonth: maxWashes,
                detailingIncluded,
            },
            status,
            billingInfo: {
                ...subscription.billingInfo,
                amount: billingAmount,
            },
        };
        onClose(updated);
    };

    return (
        <dialog id="modifysub_modal" className="modal">
            <div className="modal-box w-full max-w-3xl">
                <h3 className="font-bold text-xl mb-4">Manage Subscription</h3>

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

                <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Max Vehicles</span>
                        </label>
                        <input
                            type="number"
                            className="input input-bordered"
                            value={maxVehicles}
                            onChange={(e) =>
                                setMaxVehicles(Number(e.target.value))
                            }
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Max Washes / Month
                            </span>
                        </label>
                        <input
                            type="number"
                            className="input input-bordered"
                            value={maxWashes}
                            onChange={(e) =>
                                setMaxWashes(Number(e.target.value))
                            }
                        />
                    </div>
                </div>

                <div className="form-control mt-4">
                    <label className="label cursor-pointer">
                        <span className="label-text">Detailing Included</span>
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

                <div className="form-control flex flex-col mt-4">
                    <label className="label">
                        <span className="label-text">Status</span>
                    </label>
                    <select
                        className="select select-bordered"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="form-control flex flex-col mt-4">
                    <label className="label">
                        <span className="label-text">Billing Amount (USD)</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        className="input input-bordered"
                        value={billingAmount}
                        onChange={(e) =>
                            setBillingAmount(Number(e.target.value))
                        }
                    />
                </div>

                <div className="modal-action">
                    <form method="dialog" className="flex gap-4">
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                        <button className="btn" onClick={onClose}>
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}
