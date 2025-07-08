import { House, ClipboardList, Users } from "lucide-react";
import { Link } from "react-router";

function NavLink({ href, icon: Icon, children }) {
    return (
        <Link
            to={href}
            className="hover:underline hover:bg-base-300 flex flex-col items-center justify-center p-6 border-b border-gray-200 transition duration-200 ease-in-out"
        >
            <Icon />
            {children}
        </Link>
    );
}

export default function Navbar() {
    return (
        <nav className="flex justify-center md:justify-start md:flex-col md:max-w-[10%] w-full border-r border-gray-200">
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
