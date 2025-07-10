import { House, ClipboardList, Users } from "lucide-react";
import { Link } from "react-router";

function NavLink({ href, icon: Icon, children }) {
    return (
        <Link
            to={href}
            className=" hover:bg-gray-100 flex flex-col items-center justify-center p-4 transition duration-200 ease-in-out"
        >
            <Icon className="h-5 w-5" />
            {children}
        </Link>
    );
}

/**
 * Navbar component for the CSR portal
 */
export default function Navbar() {
    return (
        <nav className="flex justify-evenly md:justify-start md:flex-col md:max-w-[7rem] w-full text-gray-600 bg-gray-200 ">
            <NavLink href="/" icon={House}>
                Home
            </NavLink>
            <NavLink href="/requests" icon={ClipboardList}>
                Requests
            </NavLink>
            <NavLink href="/users" icon={Users}>
                Users
            </NavLink>
        </nav>
    );
}
