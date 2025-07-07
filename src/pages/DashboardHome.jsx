export default function DashboardHome() {
    return (
        <div className="flex min-h-screen">
            <div className="flex flex-col max-w-md p-4">
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                <p className="text-lg">Welcome to the CSR Portal Dashboard!</p>
                <p className="text-sm mt-2">
                    Here you can view all active CSR requests, search for users,
                    and see CSR information.
                </p>
            </div>
        </div>
    );
}
