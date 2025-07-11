import { useState } from "react";

/**
 * Form to add a vehicle to a subscription
 */
export default function AddVehicleToSubCard({ cancelForm, onSubmit }) {
    const initialFormState = {
        year: "",
        make: "",
        model: "",
        color: "",
        licensePlate: "",
        vin: "",
        dateAdded: new Date().toISOString().split("T")[0],
    };

    const [form, setForm] = useState(initialFormState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
        setForm({
            ...initialFormState,
            dateAdded: new Date().toISOString().split("T")[0],
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex *:flex-1 gap-4">
                <div className="flex flex-col">
                    <label>Year:</label>
                    <input
                        className="input input-bordered"
                        type="number"
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label>Make:</label>
                    <input
                        className="input input-bordered"
                        type="text"
                        name="make"
                        value={form.make}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="flex *:flex-1 gap-4">
                <div className="flex flex-col">
                    <label>Model:</label>
                    <input
                        className="input input-bordered"
                        type="text"
                        name="model"
                        value={form.model}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Color:</label>
                    <input
                        className="input input-bordered"
                        type="text"
                        name="color"
                        value={form.color}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <label>License Plate Number:</label>
                <input
                    className="input input-bordered w-full"
                    type="text"
                    name="licensePlate"
                    value={form.licensePlate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col">
                <label>VIN:</label>
                <input
                    className="input input-bordered w-full"
                    type="text"
                    name="vin"
                    value={form.vin}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex w-full justify-end">
                <button
                    className="btn btn-primary bg-blue-600 mt-4"
                    type="submit"
                >
                    Add Vehicle
                </button>
                <button
                    className="btn mt-4 ml-2"
                    type="button"
                    onClick={cancelForm}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
