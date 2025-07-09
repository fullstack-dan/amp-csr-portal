import React, { useState } from "react";

export default function CSRRequestActionModal({ request, onClose }) {
    const [actionTaken, setActionTaken] = useState("");
    const [status, setStatus] = useState(request ? request.status : "pending");
    if (!request) {
        return null; // or handle loading state
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "badge-warning";
            case "approved":
                return "badge-success";
            case "rejected":
                return "badge-error";
            case "completed":
                return "badge-info";
            default:
                return "badge-ghost";
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const CSRRequestHistoryEntry = {
            timestamp: new Date().toISOString(),
            status: status,
            updatedBy: "csr-001",
            comment: actionTaken,
        };

        const newRequest = {
            ...request,
            status: status,
            updatedAt: new Date().toISOString(),
            history: [CSRRequestHistoryEntry, ...request.history],
        };

        setActionTaken("");
        onClose(newRequest);
    };

    return (
        <dialog id="csrreqaction_modal" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <div>
                    <h2 className="text-xl font-bold">
                        {request.requestType}
                        <span
                            className={`ml-2 badge badge-sm ${getStatusColor(
                                request.status
                            )}`}
                        >
                            {request.status}
                        </span>
                    </h2>
                    <p>ID: {request.id}</p>
                </div>
                <div className="flex gap-12">
                    <div>
                        <h3 className="py-4">Action taken:</h3>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input"
                            value={actionTaken}
                            onChange={(e) => setActionTaken(e.target.value)}
                        />
                    </div>
                    <div>
                        <h3 className="py-4">Updated status:</h3>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="select"
                        >
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog" className="flex gap-4">
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                        <button className="btn" onClick={onClose}>
                            Close
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}
