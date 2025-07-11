import { AlertCircle } from "lucide-react";
import { Link } from "react-router";

/**
 * Layout component for displaying detailed views of various entities.
 *
 * Wrote this after realizing that I had three very monolithic detail view components,
 * and they were all using the same code. Pulled out the common code to here.
 */

// Main layout wrapper
export function DetailsViewLayout({
    children,
    loading,
    error,
    notFound,
    notFoundMessage = "Item not found",
    backLink = "/",
}) {
    if (loading) {
        return <LoadingSpinner />;
    }

    if (error || notFound) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500">{error || notFoundMessage}</p>
                <Link
                    to={backLink}
                    className="btn btn-primary bg-blue-600 mt-4"
                >
                    Go Back
                </Link>
            </div>
        );
    }

    return <div className="h-full overflow-y-auto">{children}</div>;
}

// Loading spinner component
export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
    );
}

// Header component
export function DetailsHeader({
    children,
    className = "",
    showBorder = true,
    showShadow = true,
}) {
    return (
        <div className={`bg-white ${className}`}>
            <div className="">{children}</div>
        </div>
    );
}

// Header content wrapper with title and actions
export function HeaderContent({
    title,
    subtitle,
    badge,
    badgeColor = "badge-ghost",
    children,
    actions,
}) {
    return (
        <div className="flex items-center flex-wrap gap-4 justify-between p-6">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    {title}
                    {badge && (
                        <span className={`badge badge-sm ${badgeColor}`}>
                            {badge}
                        </span>
                    )}
                </h2>
                {subtitle && (
                    <p className="text-sm text-gray-500">{subtitle}</p>
                )}
                {children}
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
        </div>
    );
}

// Tabs component
export function DetailsTabs({ tabs, activeTab, onTabChange }) {
    return (
        <div className="tabs tabs-lift  ">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab ${
                        activeTab === tab.id
                            ? "tab-active [--tab-bg:theme(colors.gray.100)]"
                            : ""
                    }`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                    {tab.count !== undefined && ` (${tab.count})`}
                </button>
            ))}
        </div>
    );
}

// Content wrapper with padding
export function DetailsContent({ children, className = "" }) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}

// Card component
export function DetailsCard({
    title,
    icon: Icon,
    children,
    className = "",
    contentClassName = "",
}) {
    return (
        <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
            {title && (
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5" />}
                    {title}
                </h3>
            )}
            <div className={contentClassName}>{children}</div>
        </div>
    );
}

// Grid layout for cards
export function DetailsGrid({ children, cols = 3, className = "" }) {
    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div className={`grid ${gridCols[cols]} gap-6 ${className}`}>
            {children}
        </div>
    );
}

// Info row component for displaying label-value pairs
export function InfoRow({ label, value, className = "" }) {
    return (
        <div className={className}>
            <p className="font-medium ">{label}</p>
            <p className="text-gray-600">{value}</p>
        </div>
    );
}

// Info row with icon
export function InfoRowWithIcon({ icon: Icon, label, value, className = "" }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {Icon && <Icon className="w-4 h-4 text-gray-400" />}
            <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    );
}

// Edit mode banner
export function EditModeBanner({
    message,
    icon: Icon,
    color = "bg-blue-500",
    textColor = "text-white",
}) {
    return (
        <div
            className={`${color} ${textColor} text-center py-2 flex items-center justify-center gap-2`}
        >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{message}</span>
        </div>
    );
}

// Empty state component for no data found
export function EmptyState({ icon: Icon, message, action, className = "" }) {
    return (
        <div className={`text-center py-8 ${className}`}>
            {Icon && <Icon className="w-12 h-12 text-gray-300 mx-auto mb-2" />}
            <p className="text-gray-500 text-lg">{message}</p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

// Status badge helper
export function StatusBadge({ status, size = "badge-sm" }) {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
            case "completed":
            case "success":
                return "badge-success";
            case "pending":
            case "paused":
            case "warning":
                return "badge-warning";
            case "cancelled":
            case "rejected":
            case "error":
                return "badge-error";
            case "expired":
            case "inactive":
            default:
                return "badge-ghost";
        }
    };

    return (
        <span className={`badge ${size} ${getStatusColor(status)}`}>
            {status}
        </span>
    );
}

// List item wrapper for consistent styling
export function DetailsList({ children, className = "" }) {
    return <div className={`space-y-4 ${className}`}>{children}</div>;
}

// List item component
export function DetailsListItem({
    children,
    onClick,
    className = "",
    hoverable = true,
}) {
    const hoverClass = hoverable ? "hover:bg-gray-50" : "";
    const cursorClass = onClick ? "cursor-pointer" : "";

    return (
        <div
            className={`border rounded-lg p-4 transition-colors ${hoverClass} ${cursorClass} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
